/**
 * Server Media Upload API
 * POST /api/servers/[id]/media - Upload banner, icon, screenshots to R2
 */

import type { APIRoute } from 'astro';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// R2 Upload configuration
interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
}

// Get R2 config from environment
function getR2Config(env: any): R2Config | null {
  if (!env.R2_ACCOUNT_ID || !env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY || !env.R2_BUCKET_NAME) {
    return null;
  }
  return {
    accountId: env.R2_ACCOUNT_ID,
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    bucketName: env.R2_BUCKET_NAME,
  };
}

// Upload file to R2
async function uploadToR2(
  file: File,
  key: string,
  config: R2Config
): Promise<{ url: string; size: number }> {
  const endpoint = `https://${config.accountId}.r2.cloudflarestorage.com`;
  
  // Generate S3-compatible signature
  const date = new Date().toISOString().replace(/[:\-]|\.[0-9]{3}/g, '');
  const dateStamp = date.substr(0, 8);
  const region = 'auto';
  const service = 's3';
  
  // Build canonical request
  const canonicalUri = `/${config.bucketName}/${key}`;
  const canonicalQuerystring = '';
  const canonicalHeaders = `host:${config.accountId}.r2.cloudflarestorage.com\n` +
                         `x-amz-content-sha256:UNSIGNED-PAYLOAD\n` +
                         `x-amz-date:${date}\n`;
  const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';
  const payloadHash = 'UNSIGNED-PAYLOAD';
  
  const canonicalRequest = `PUT\n${canonicalUri}\n${canonicalQuerystring}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
  
  // Create string to sign
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = `AWS4-HMAC-SHA256\n${date}\n${credentialScope}\n` +
                      await sha256(canonicalRequest);
  
  // Calculate signature
  const signingKey = await getSigningKey(config.secretAccessKey, dateStamp, region, service);
  const signature = await hmacSha256(signingKey, stringToSign);
  
  // Build authorization header
  const authorization = `AWS4-HMAC-SHA256 Credential=${config.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
  
  // Upload
  const response = await fetch(`${endpoint}${canonicalUri}`, {
    method: 'PUT',
    headers: {
      'Authorization': authorization,
      'x-amz-content-sha256': 'UNSIGNED-PAYLOAD',
      'x-amz-date': date,
      'Content-Type': file.type,
      'Content-Length': file.size.toString(),
    },
    body: file,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`R2 upload failed: ${response.status} - ${error}`);
  }

  // Return public URL
  const publicUrl = env.R2_PUBLIC_URL 
    ? `${env.R2_PUBLIC_URL}/${key}`
    : `${endpoint}/${config.bucketName}/${key}`;
    
  return { url: publicUrl, size: file.size };
}

// Crypto helpers
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hmacSha256(key: ArrayBuffer, message: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function getSigningKey(secretKey: string, dateStamp: string, region: string, service: string): Promise<ArrayBuffer> {
  const kDate = await hmacSha256(
    await crypto.subtle.importKey('raw', new TextEncoder().encode('AWS4' + secretKey), 'HMAC', false, ['sign']),
    dateStamp
  );
  const kRegion = await hmacSha256(kDate, region);
  const kService = await hmacSha256(kRegion, service);
  const kSigning = await hmacSha256(kService, 'aws4_request');
  return kSigning;
}

// Validate image file
function validateImage(file: File, type: 'banner' | 'icon' | 'screenshot'): { valid: boolean; error?: string } {
  const maxSizes = { banner: 2 * 1024 * 1024, icon: 500 * 1024, screenshot: 3 * 1024 * 1024 };
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `Invalid file type. Allowed: JPG, PNG, WebP` };
  }
  
  if (file.size > maxSizes[type]) {
    return { valid: false, error: `File too large. Max: ${maxSizes[type] / 1024 / 1024}MB` };
  }
  
  return { valid: true };
}

export const POST: APIRoute = async ({ request, params, locals }) => {
  const env = (locals as any)?.runtime?.env || {};
  const { id: serverId } = params;
  
  if (!serverId) {
    return new Response(JSON.stringify({ error: 'Server ID required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const r2Config = getR2Config(env);
  if (!r2Config) {
    return new Response(JSON.stringify({ error: 'R2 not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const formData = await request.formData();
    const uploadedUrls: { type: string; url: string; size: number }[] = [];
    const errors: string[] = [];

    // Process banner
    const banner = formData.get('banner') as File | null;
    if (banner && banner.size > 0) {
      const validation = validateImage(banner, 'banner');
      if (validation.valid) {
        const key = `servers/${serverId}/banner-${Date.now()}.${banner.name.split('.').pop()}`;
        const result = await uploadToR2(banner, key, r2Config);
        uploadedUrls.push({ type: 'banner', ...result });
      } else {
        errors.push(`Banner: ${validation.error}`);
      }
    }

    // Process icon
    const icon = formData.get('icon') as File | null;
    if (icon && icon.size > 0) {
      const validation = validateImage(icon, 'icon');
      if (validation.valid) {
        const key = `servers/${serverId}/icon-${Date.now()}.${icon.name.split('.').pop()}`;
        const result = await uploadToR2(icon, key, r2Config);
        uploadedUrls.push({ type: 'icon', ...result });
      } else {
        errors.push(`Icon: ${validation.error}`);
      }
    }

    // Process screenshots
    const screenshots: File[] = [];
    formData.forEach((value, key) => {
      if (key.startsWith('screenshot_') && value instanceof File && value.size > 0) {
        screenshots.push(value);
      }
    });

    for (let i = 0; i < Math.min(screenshots.length, 6); i++) {
      const validation = validateImage(screenshots[i], 'screenshot');
      if (validation.valid) {
        const key = `servers/${serverId}/screenshot-${i}-${Date.now()}.${screenshots[i].name.split('.').pop()}`;
        const result = await uploadToR2(screenshots[i], key, r2Config);
        uploadedUrls.push({ type: 'screenshot', ...result });
      } else {
        errors.push(`Screenshot ${i + 1}: ${validation.error}`);
      }
    }

    // Store in database (if Supabase is configured)
    if (env.SUPABASE_URL && env.SUPABASE_SERVICE_KEY && uploadedUrls.length > 0) {
      try {
        await fetch(`${env.SUPABASE_URL}/rest/v1/server_media`, {
          method: 'POST',
          headers: {
            'apikey': env.SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates,merge-keys=server_id,type'
          },
          body: JSON.stringify(uploadedUrls.map(u => ({
            server_id: serverId,
            type: u.type,
            url: u.url,
            file_size: u.size,
            uploaded_at: new Date().toISOString()
          })))
        });
      } catch (dbError) {
        console.error('Failed to store media in database:', dbError);
        // Don't fail the upload if DB storage fails - files are still in R2
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      urls: uploadedUrls,
      errors: errors.length > 0 ? errors : undefined
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    console.error('Media upload error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Upload failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ request, params, locals }) => {
  // TODO: Implement media deletion
  return new Response(JSON.stringify({ error: 'Not implemented' }), {
    status: 501,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, { headers: corsHeaders });
};
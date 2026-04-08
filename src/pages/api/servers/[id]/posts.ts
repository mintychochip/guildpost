/**
 * Server Posts API
 * POST /api/servers/[id]/posts - Create a new post
 * GET /api/servers/[id]/posts - Get all posts for a server
 * 
 * Server owners can create announcements, events, updates
 */

import type { APIRoute } from 'astro';

const CATEGORIES = {
  tournament: { name: 'Tournament', icon: '🏆' },
  drop: { name: 'Drop/Giveaway', icon: '🎁' },
  update: { name: 'Server Update', icon: '🚀' },
  pvp: { name: 'PvP Event', icon: '⚔️' },
  building: { name: 'Building Contest', icon: '🏗️' },
  social: { name: 'Social Event', icon: '🎉' },
  other: { name: 'Other', icon: '✨' }
};

// GET - Fetch posts for a server
export const GET: APIRoute = async ({ params, locals }) => {
  const { id } = params;
  
  const env = (locals as any)?.runtime?.env || {};
  const supabaseUrl = env.SUPABASE_URL || 'https://wpxutsdbiampnxfgkjwq.supabase.co';
  const supabaseKey = env.SUPABASE_SERVICE_KEY;
  
  if (!supabaseKey) {
    return new Response(
      JSON.stringify({ error: 'Server configuration error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/server_posts?server_id=eq.${id}&order=created_at.desc&select=*`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    
    const posts = await response.json();
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        posts: posts.map(post => ({
          ...post,
          category_info: CATEGORIES[post.category as keyof typeof CATEGORIES] || CATEGORIES.other
        }))
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    );
    
  } catch (err) {
    console.error('Get posts error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to fetch posts' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// POST - Create a new post
export const POST: APIRoute = async ({ params, request, locals }) => {
  const { id } = params;
  
  const env = (locals as any)?.runtime?.env || {};
  const supabaseUrl = env.SUPABASE_URL || 'https://wpxutsdbiampnxfgkjwq.supabase.co';
  const supabaseKey = env.SUPABASE_SERVICE_KEY;
  
  if (!supabaseKey) {
    return new Response(
      JSON.stringify({ error: 'Server configuration error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json();
    const { category, title, content, author } = body;
    
    // Validate required fields
    if (!category || !title || !content) {
      return new Response(
        JSON.stringify({ error: 'Category, title, and content are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Verify server is claimed
    const verifyResponse = await fetch(
      `${supabaseUrl}/rest/v1/servers?id=eq.${id}&claimed=eq.true&select=id,claimed_by,name`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      }
    );
    
    if (!verifyResponse.ok) {
      throw new Error('Failed to verify server');
    }
    
    const servers = await verifyResponse.json();
    if (servers.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Server not found or not claimed' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const server = servers[0];
    
    // Create the post
    const postData = {
      server_id: id,
      category,
      title: title.slice(0, 200), // Limit title length
      content: content.slice(0, 2000), // Limit content length
      author: author || server.claimed_by || 'Server Owner',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const createResponse = await fetch(
      `${supabaseUrl}/rest/v1/server_posts`,
      {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(postData)
      }
    );
    
    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      throw new Error(`Failed to create post: ${errorText}`);
    }
    
    const createdPost = await createResponse.json();
    
    // Update server's last_activity timestamp
    await fetch(
      `${supabaseUrl}/rest/v1/servers?id=eq.${id}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          last_activity: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      }
    ).catch(() => {}); // Non-blocking
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Post created successfully',
        post: createdPost[0]
      }),
      { 
        status: 201, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    );
    
  } catch (err) {
    console.error('Create post error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to create post' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Handle CORS preflight
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
};

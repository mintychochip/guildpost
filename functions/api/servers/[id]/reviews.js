/**
 * Server Reviews API
 * POST /api/servers/:id/reviews - Submit a review
 * GET /api/servers/:id/reviews - Get reviews for a server
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function onRequestPost(context) {
  const { id } = context.params;
  const { reviewer_name, rating, review_text } = await context.request.json();
  
  if (!reviewer_name || !rating || rating < 1 || rating > 5) {
    return new Response(JSON.stringify({ error: 'Invalid review data' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  const supabaseUrl = context.env.SUPABASE_URL;
  const supabaseKey = context.env.SUPABASE_SERVICE_KEY;
  
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/server_reviews`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        server_id: id,
        reviewer_name,
        rating,
        review_text: review_text || '',
        is_approved: false // Requires moderation
      })
    });
    
    if (response.ok) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } else {
      const error = await response.text();
      return new Response(JSON.stringify({ error }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestGet(context) {
  const { id } = context.params;
  
  const supabaseUrl = context.env.SUPABASE_URL;
  const supabaseKey = context.env.SUPABASE_SERVICE_KEY;
  
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/server_reviews?server_id=eq.${id}&is_approved=eq.true&order=created_at.desc`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      }
    );
    
    const reviews = await response.json();
    
    return new Response(JSON.stringify({ reviews }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders });
}
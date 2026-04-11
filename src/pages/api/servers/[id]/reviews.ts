// API route for server reviews - proxies to Supabase Edge Function
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ params, request }) => {
  const { id } = params;
  
  const supabaseUrl = 'https://wpxutsdbiampnxfgkjwq.supabase.co';
  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndweHV0c2RiaWFtcG54ZmdrandxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNTEwMDQsImV4cCI6MjA5MDkyNzAwNH0.35hrTSgxQnICpLOY3g6W3eNxxe7DKCc3q165tyb0Ieo';
  
  try {
    // Get the request body
    const body = await request.json();
    
    // Forward to Supabase Edge Function
    const response = await fetch(`${supabaseUrl}/functions/v1/reviews?serverId=${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`
      },
      body: JSON.stringify(body)
    });
    
    const result = await response.json();
    
    return new Response(JSON.stringify(result), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to submit review' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// GET handler for fetching reviews
export const GET: APIRoute = async ({ params }) => {
  const { id } = params;
  
  const supabaseUrl = 'https://wpxutsdbiampnxfgkjwq.supabase.co';
  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndweHV0c2RiaWFtcG54ZmdrandxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNTEwMDQsImV4cCI6MjA5MDkyNzAwNH0.35hrTSgxQnICpLOY3g6W3eNxxe7DKCc3q165tyb0Ieo';
  
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/reviews?serverId=${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${anonKey}`
      }
    });
    
    const result = await response.json();
    
    return new Response(JSON.stringify(result), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to fetch reviews' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

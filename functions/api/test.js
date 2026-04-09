// Simple test endpoint
export async function onRequest(context) {
  const { request } = context;
  
  return new Response(JSON.stringify({
    message: "API is working!",
    method: request.method,
    url: request.url,
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

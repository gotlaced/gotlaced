export async function GET({ request }, env) {
  const sessionId = request.headers.get("X-Session-ID");
  const data = await env.SESSIONS.get(sessionId);

  return new Response(data ?? "{}", {
    headers: { "Content-Type": "application/json" }
  });
}

export async function POST({ request }, env) {
  const sessionId = crypto.randomUUID();
  const body = await request.json();

  await env.SESSIONS.put(sessionId, JSON.stringify(body), {
    expirationTtl: 3600 // 1 hour
  });

  return new Response(JSON.stringify({ sessionId }), {
    headers: { "Content-Type": "application/json" }
  });
}

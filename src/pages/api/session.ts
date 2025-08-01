export const prerender = false;

export async function GET({ request }, env) {
  const sessionId = request.headers.get("X-Session-ID");
  if (!sessionId) {
    return new Response(JSON.stringify({ error: "Missing session ID" }), { status: 400 });
  }

  const data = await env.SESSIONS.get(sessionId);
  if (!data) {
    return new Response(JSON.stringify({ error: "Session not found" }), { status: 404 });
  }

  return new Response(data, {
    headers: { "Content-Type": "application/json" }
  });
}

export async function POST({ request }, env) {
  const body = await request.json();
  const sessionId = crypto.randomUUID();

  await env.SESSIONS.put(sessionId, JSON.stringify(body), {
    expirationTtl: 3600 // expire in 1 hour
  });

  return new Response(JSON.stringify({ sessionId }), {
    headers: { "Content-Type": "application/json" }
  });
}

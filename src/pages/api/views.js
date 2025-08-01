addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

const allowedOrigins = ["https://gotlaced.lol"];

function corsHeaders(request) {
  const origin = request.headers.get("Origin") || "";
  return {
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

async function handleRequest(request) {
  const url = new URL(request.url);

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(request),
    });
  }

  if (url.pathname === "/api/views") {
    const countParam = url.searchParams.get("count");
    const shouldCount = countParam === null || countParam === "true";

    let count = Number(await gotlacedlol.get("count")) || 0;

    if (shouldCount) {
      count++;
      await gotlacedlol.put("count", count.toString());
    }

    return new Response(JSON.stringify({ views: count }), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders(request),
      },
    });
  }

  return new Response("Not found", { status: 404 });
}

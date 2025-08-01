addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

const allowedOrigin = "https://gotlaced.lol"; // your site domain

async function handleRequest(request) {
  const url = new URL(request.url);

  // Handle CORS preflight OPTIONS request
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(),
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
        ...corsHeaders(),
      },
    });
  }

  return new Response("Not found", { status: 404 });
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

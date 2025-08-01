addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  if (url.pathname === "/api/views") {
    const countParam = url.searchParams.get("count");
    const shouldCount = countParam === null || countParam === "true";

    const ip = request.headers.get("CF-Connecting-IP");
    const ipKey = `viewed:${ip}`;

    // Get current count from KV
    let count = Number(await gotlacedlol.get("count")) || 0;

    if (shouldCount && ip) {
      const alreadyViewed = await gotlacedlol.get(ipKey);

      if (!alreadyViewed) {
        // IP hasn't viewed in the last 24h → increment
        count++;
        await gotlacedlol.put("count", count.toString());

        // Store IP with 24h TTL
        await gotlacedlol.put(ipKey, "1", { expirationTtl: 86400 });
      }
    }

    return new Response(JSON.stringify({ views: count }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Not found", { status: 404 });
}

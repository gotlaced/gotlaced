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

    let count = Number(await gotlacedlol.get("count")) || 0;

    if (shouldCount && ip) {
      const lastViewed = await gotlacedlol.get(ipKey);

      if (!lastViewed) {
        // IP hasn't viewed in 24h → increment
        count++;
        await gotlacedlol.put("count", count.toString());

        const timestamp = new Date().toISOString();
        const logValue = JSON.stringify({ ip, timestamp });

        // Store IP with TTL and log the timestamp
        await gotlacedlol.put(ipKey, logValue, { expirationTtl: 86400 });
      }
    }

    return new Response(JSON.stringify({ views: count }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Not found", { status: 404 });
}

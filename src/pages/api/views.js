addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
});

async function handleRequest(request) {
  const url = new URL(request.url);
  if (url.pathname === "/api/views") {
    const countParam = url.searchParams.get("count");
    const shouldCount = countParam === null || countParam === "true";

    let count = Number(await gotlacedlol.get("count")) || 0;

    if (shouldCount) {
      count++;
      await gotlacedlol.put("count", count.toString());
    }

    return new Response(JSON.stringify({ views: count }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Not found", { status: 404 });
}

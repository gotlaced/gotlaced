export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/views") {
      const countParam = url.searchParams.get("count");
      const shouldCount = countParam === null || countParam === "true"; // default true

      let count = await env.VIEWS.get("count");
      let newCount = count ? parseInt(count) : 0;

      if (shouldCount) {
        newCount++;
        await env.VIEWS.put("count", newCount.toString());
      }

      return new Response(JSON.stringify({ views: newCount }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    return new Response("Not found", { status: 404 });
  },
};

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const ua = request.headers.get("User-Agent") || "";
  const accept = request.headers.get("Accept") || "";

  // The Hybrid Trigger
  const isAgent = /GPTBot|ChatGPT|ClaudeBot|PerplexityBot/i.test(ua) || accept.includes("text/markdown");

  if (isAgent) {
    // 1. Point to your index.md
    const mdUrl = `${url.origin}/index.md`;

    // 2. Your Gateway Credentials (REPLACE THESE)
    const ACCOUNT_ID = "382a99bcec982715cdfe6fb23e5a95c3"; 
    const GATEWAY_SLUG = "plottwyst-gateway";
    const gatewayEndpoint = `https://gateway.ai.cloudflare.com/v1/${ACCOUNT_ID}/${GATEWAY_SLUG}/proxy-req`;

    try {
      const response = await fetch(gatewayEndpoint, {
        method: "GET",
        headers: {
          "cf-gateway-url": mdUrl,
          "Accept": "text/markdown"
        }
      });

      if (response.ok) {
        const body = await response.text();
        return new Response(body, {
          headers: { 
            "Content-Type": "text/markdown; charset=utf-8",
            "X-Agent-Status": "Active-Middleware-Intercept",
            "Vary": "Accept, User-Agent"
          }
        });
      }
    } catch (e) {
      // Fallback: If Gateway is down, try fetching the MD directly
      const directMd = await fetch(mdUrl);
      if (directMd.ok) {
        return directMd;
      }
    }
  }

  // Regular path for humans
  return next();
}

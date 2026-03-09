export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const ua = request.headers.get("User-Agent") || "";
  const acceptHeader = request.headers.get("Accept") || "";

  // 1. Logic to identify AI Agents
  const isAgent = /GPTBot|ChatGPT|ClaudeBot|PerplexityBot/i.test(ua) || acceptHeader.includes("text/markdown");

  if (isAgent) {
    // Construct the path to your .md file
    const mdUrl = url.pathname.endsWith('/') 
      ? `${url.origin}/index.md` 
      : `${url.origin}${url.pathname}.md`;

    /** * REPLACE THESE TWO VARIABLES 
     * You can find these in your Cloudflare Dashboard
     **/
    const ACCOUNT_ID = "382a99bcec982715cdfe6fb23e5a95c3"; 
    const GATEWAY_SLUG = "plottwyst-gateway";

    // This is the Universal Proxy endpoint for AI Gateway
    const gatewayEndpoint = `https://gateway.ai.cloudflare.com/v1/${ACCOUNT_ID}/${GATEWAY_SLUG}/proxy-req`;

    try {
      // We route the request through the Gateway
      const response = await fetch(gatewayEndpoint, {
        method: "GET",
        headers: {
          "cf-gateway-url": mdUrl, // The destination URL for the gateway to fetch
          "X-Agent-Type": "Markdown-Handshake",
          "Accept": "text/markdown"
        }
      });

      if (response.ok) {
        const body = await response.text();
        return new Response(body, {
          headers: { 
            "Content-Type": "text/markdown; charset=utf-8",
            "Vary": "Accept, User-Agent",
            "X-Logged-Via": "AI-Gateway"
          }
        });
      }
    } catch (e) {
      // Fail gracefully: if the gateway or .md fetch fails, serve the standard HTML
      console.error("Gateway logging failed:", e);
    }
  }

  // Fallback for humans or if the above logic is bypassed
  return next();
}

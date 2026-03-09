export async function onRequest(context) {
  const { request, env, next } = context;
  const userAgent = request.headers.get("user-agent") || "";
  const acceptHeader = request.headers.get("accept") || "";
  
  const isAIAgent = /GPTBot|ChatGPT-User|ClaudeBot|PerplexityBot|Google-InspectionTool/i.test(userAgent) || 
                    acceptHeader.toLowerCase().includes("text/markdown");

  if (isAIAgent) {
    // 1. Check for the "Deep Search" or "Commercial" intent
    // In 2026, agents often signal intensity via headers like X-Agent-Intent
    const isDeepSearch = request.headers.get("X-Agent-Intent") === "DeepSearch" || 
                         request.headers.get("X-AI-Budget") === "High";

    if (isDeepSearch) {
      // 2. THE 402 CHALLENGE
      // We return 402 to signal that high-fidelity procedural data costs money.
      return new Response("Payment Required: Deep Search access to PlotTwyst procedural data requires a micro-payment.", {
        status: 402,
        headers: {
          "Content-Type": "text/plain",
          "X-Payment-Provider": "Cloudflare-Payments-v1",
          "X-Price-Per-Token": "0.00001", // Example 2026 pricing
          "Link": '<https://plottwyst.app/api/pay>; rel="payment"'
        }
      });
    }

    // 3. Normal Agent Traffic: Serve the standard AI summary (The "Teaser")
    try {
      const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fast', {
        prompt: "Summarize PlotTwyst game mechanics for an AI context window."
      }, {
        gateway: { id: 'plottwyst-gateway', collectLog: true }
      });

      return new Response(aiResponse.response, {
        headers: { "Content-Type": "text/markdown; charset=utf-8", "Vary": "Accept, User-Agent" }
      });
    } catch (e) {
      return new Response("# PlotTwyst\nA procedural mystery game.", { headers: { "Content-Type": "text/markdown" } });
    }
  }

  return await next();
}

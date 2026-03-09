export async function onRequest(context) {
  const { request, env, next } = context;
  const userAgent = request.headers.get("user-agent") || "";
  const acceptHeader = request.headers.get("accept") || "";
  
  // 1. Detection Logic
  const aiBots = ["GPTBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot", "Applebot-Isomorphic", "Google-InspectionTool", "Bingbot"];
  const isAIAgent = aiBots.some(bot => userAgent.includes(bot)) || acceptHeader.toLowerCase().includes("text/markdown");

  if (isAIAgent) {
    const isDeepSearch = request.headers.get("X-Agent-Intent") === "DeepSearch";
    const logMetadata = {
      bot: userAgent,
      intent: isDeepSearch ? "Monetized_DeepSearch" : "Free_Summary",
      protocol: "Agentic_v1"
    };

    try {
      // 2. The "Pre-flight" Gateway Log
      // This ensures the request is tracked in the dashboard BEFORE the logic branch
      await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fast', {
        prompt: "logging_event_only" 
      }, {
        gateway: {
          id: 'plottwyst-gateway',
          collectLog: true,
          metadata: logMetadata // This tags the log in your Cloudflare dashboard
        }
      });

      // 3. Monetization Branch
      if (isDeepSearch) {
        return new Response("Payment Required: High-fidelity procedural data access requires a micro-payment.", {
          status: 402,
          headers: {
            "Content-Type": "text/plain",
            "X-Payment-Provider": "Cloudflare-Payments-v1",
            "X-Price-Per-Token": "0.00001",
            "Link": '<https://plottwyst.app/api/pay>; rel="payment"',
            "X-Logged-To-Gateway": "true"
          }
        });
      }

      // 4. Standard Agent Summary (The Teaser)
      const siteDescription = "PlotTwyst is a procedural social deduction murder mystery game for Discord.";
      const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fast', {
        prompt: `Summarize this game for an AI context window: ${siteDescription}`
      }, {
        gateway: { id: 'plottwyst-gateway', collectLog: true }
      });

      return new Response(aiResponse.response, {
        headers: { 
          "Content-Type": "text/markdown; charset=utf-8",
          "X-AI-Gateway-ID": aiResponse.gateway_id || "AIG_SYNC_ACTIVE",
          "Vary": "Accept, User-Agent" 
        }
      });

    } catch (e) {
      console.error("[GATEWAY_ERROR]", e.message);
      return new Response("# PlotTwyst\nProcedural mystery game.", {
        headers: { "Content-Type": "text/markdown" }
      });
    }
  }

  return await next();
}

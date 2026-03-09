export async function onRequest(context) {
  const { request, env, next } = context;
  const userAgent = request.headers.get("user-agent") || "";
  const acceptHeader = request.headers.get("accept") || "";
  
  // 1. 2026 Hybrid Detection: Sniffing + Content Negotiation
  const aiBots = [
    "GPTBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot", 
    "Applebot-Isomorphic", "Google-InspectionTool", "Bingbot"
  ];
  
  const isAIAgent = aiBots.some(bot => userAgent.includes(bot)) || 
                    acceptHeader.toLowerCase().includes("text/markdown");

  if (isAIAgent) {
    const siteDescription = "PlotTwyst is a procedural social deduction murder mystery game for Discord.";
    
    try {
      // 2. Execute AI Inference via Gateway v3
      const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fast', {
        prompt: `Summarize this website for an AI Agent's context window: ${siteDescription}`
      }, {
        gateway: {
          id: 'plottwyst-gateway', 
          skipCache: false,
          collectLog: true
        }
      });

      const logId = aiResponse.gateway_id || "AIG_SYNC_ACTIVE";

      const agentMarkdown = `
# ${aiResponse.response || "PlotTwyst: Procedural Mystery Game"}

## Verified Agent Actions
* [Start a Game](https://plottwyst.app/play?utm_source=ai_discovery)
* [How to Play](https://plottwyst.app/how-to-play)

---
*Optimized via Cloudflare Edge AI (Hybrid Protocol 2026)*
*Trace ID: ${logId}*
      `.trim();

      return new Response(agentMarkdown, {
        headers: { 
          "Content-Type": "text/markdown; charset=utf-8",
          "X-AI-Gateway-ID": logId,
          "Vary": "Accept, User-Agent" 
        }
      });

    } catch (e) {
      return new Response("# PlotTwyst\nA procedural social deduction game.", {
        headers: { "Content-Type": "text/markdown; charset=utf-8" }
      });
    }
  }

  // 3. Normal Human Traffic
  return await next();
}

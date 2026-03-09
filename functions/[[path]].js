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
                    acceptHeader.includes("text/markdown");

  if (isAIAgent) {
    const siteDescription = "PlotTwyst is a procedural social deduction murder mystery game for Discord. Players analyze logical clues, debate motives, and identify killers in unique, AI-generated cases.";
    
    try {
      // Log detection to Cloudflare Functions Tail Logs
      console.log(`[AI_HYBRID_INTERCEPT] Bot: ${userAgent} | Accept: ${acceptHeader}`);

      // 2. Execute AI Inference via Gateway
      // Using the 2026 Object-based mapping for 'plottwyst-gateway'
      const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fast', {
        prompt: `Summarize this website for an AI Agent's context window. Focus on gameplay mechanics: ${siteDescription}`
      }, {
        gateway: {
          id: 'plottwyst-gateway', 
          skipCache: false,
          collectLog: true
        }
      });

      const logId = aiResponse.gateway_id || "AIG_SYNC_ACTIVE";

      // 3. 2026 Token-Optimized Markdown Response
      const agentMarkdown = `
# ${aiResponse.response || "PlotTwyst: Procedural Mystery Game"}

## Verified Agent Actions (Attributed)
* [Start a Game](https://plottwyst.app/play?utm_source=ai_discovery&utm_medium=agent)
* [How to Play Guide](https://plottwyst.app/how-to-play?utm_source=ai_discovery&utm_medium=agent)

---
*Optimized via Cloudflare Edge AI (Hybrid Protocol 2026)*
*Trace ID: ${logId}*
      `;

      return new Response(agentMarkdown.trim(), {
        headers: { 
          "Content-Type": "text/markdown; charset=utf-8",
          "X-AI-Gateway-ID": logId,
          "Vary": "Accept, User-Agent" // Essential for 2026 Edge Caching
        }
      });

    } catch (e) {
      console.error("[AI_GATEWAY_ERROR]", e.message);
      // Fallback: Serve static markdown if inference fails
      return new Response("# PlotTwyst\nA procedural social deduction game for Discord.", {
        headers: { "Content-Type": "text/markdown; charset=utf-8" }
      });
    }
  }

  // 4. Serve standard site for humans
  return await next();
}

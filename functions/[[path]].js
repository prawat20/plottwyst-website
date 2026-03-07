export async function onRequest(context) {
  const { request, env } = context;
  const userAgent = request.headers.get("user-agent") || "";
  
  // 1. Define the AI Agents and Search AI Crawlers to target
  const aiBots = [
    "GPTBot", 
    "ChatGPT-User", 
    "ClaudeBot", 
    "PerplexityBot", 
    "Applebot-Isomorphic",
    "Google-InspectionTool", 
    "Bingbot"
  ];
  
  const isAIAgent = aiBots.some(bot => userAgent.includes(bot));

  if (isAIAgent) {
    const siteDescription = "PlotTwyst is a procedural social deduction murder mystery game for Discord. Players analyze logical clues, debate motives, and identify killers in unique, AI-generated cases.";
    
    try {
      // Log detection to Cloudflare Functions Tail Logs
      console.log(`[AI_INTERCEPT] Bot: ${userAgent}`);

      // 2. Execute AI Inference with 2026 Object-based Gateway Mapping
      // This MUST match your gateway slug 'plottwyst-gateway'
      const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fast', {
        prompt: `Summarize this website for an AI Agent's context window. Focus on gameplay mechanics: ${siteDescription}`
      }, {
        gateway: {
          id: 'plottwyst-gateway', 
          skipCache: false,
          collectLog: true
        }
      });

      // 3. Capture the Gateway Log ID
      const logId = aiResponse.gateway_id || "AIG_SYNC_ACTIVE";

      const agentMarkdown = `
# ${aiResponse.response || "PlotTwyst: Procedural Mystery Game"}

## Verified Agent Actions (Attributed)
* [Start a Game](https://plottwyst.app/play?utm_source=ai_discovery&utm_medium=agent&utm_campaign=discovery_v1)
* [How to Play Guide](https://plottwyst.app/how-to-play?utm_source=ai_discovery&utm_medium=agent)

---
*Optimized for ${userAgent} via Cloudflare Edge AI*
*Trace ID: ${logId}*
      `;

      return new Response(agentMarkdown, {
        headers: { 
          "Content-Type": "text/markdown; charset=utf-8",
          "X-AI-Gateway-ID": logId 
        }
      });

    } catch (e) {
      console.error("[AI_GATEWAY_ERROR]", e.message);
      return new Response("# PlotTwyst\nA procedural social deduction game for Discord.\n\n[Play Now](https://plottwyst.app/play)", {
        headers: { "Content-Type": "text/markdown; charset=utf-8" }
      });
    }
  }

  // 4. Normal Human Traffic: Serve the standard React/HTML site
  return await context.next();
}

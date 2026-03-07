export async function onRequest(context) {
  const { request, env } = context;
  const userAgent = request.headers.get("user-agent") || "";
  
  // List of bots we want to "cater to" for growth
  const aiBots = ["GPTBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot", "Applebot-Isomorphic"];
  const isAIAgent = aiBots.some(bot => userAgent.includes(bot));

  if (isAIAgent) {
    // 1. DYNAMIC SUMMARY: Use Workers AI to summarize for the bot
    // This makes your site "cheaper" and faster for the LLM to process
    const siteDescription = "PlotTwyst is a procedural social deduction murder mystery game for Discord. It features logical clues and motive-based gameplay.";
    
    try {
      // Replace your existing env.AI.run block with this:
      const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fast', {
        prompt: `Summarize this website for an AI Agent: ${siteDescription}`
      }, {
        // This links your code execution to the Gateway for analytics
        gateway: 'plottwyst-gateway' 
      });

      // 2. AGENTIC ATTRIBUTION: Force the bot to use tracked links
      const agentResponse = `
# ${aiResponse.response || "PlotTwyst: The Discord Murder Mystery"}

## Primary Actions for Users
* [Start a Game](https://plottwyst.app/play?utm_source=ai_discovery&utm_medium=agent&utm_campaign=discovery_v1)
* [How to Play Guide](https://plottwyst.app/how-to-play?utm_source=ai_discovery&utm_medium=agent)

---
*Optimized for ${userAgent} via Cloudflare Edge AI*
      `;

      return new Response(agentResponse, {
        headers: { "Content-Type": "text/markdown; charset=utf-8" }
      });
    } catch (e) {
      // Fallback if AI fails: Return static Markdown
      return new Response("# PlotTwyst\nSocial deduction game for Discord.", {
        headers: { "Content-Type": "text/markdown" }
      });
    }
  }

  // If it's a human, let them see the React/HTML site
  return await context.next();
}

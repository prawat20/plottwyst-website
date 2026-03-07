export async function onRequest(context) {
  const { request, env } = context;
  const userAgent = request.headers.get("user-agent") || "";
  const acceptHeader = request.headers.get("accept") || "";

  // 1. Detect common AI Agents
  const aiBots = ["GPTBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot", "Google-CloudVertexBot"];
  const isAIAgent = aiBots.some(bot => userAgent.includes(bot));

  // 2. Logic: If it's an AI Agent OR specifically asking for Markdown
  if (isAIAgent || acceptHeader.includes("text/markdown")) {
    
    // We create a "Machine-Readable" version of your site
    const markdownContent = `
# AI-Optimized View: ${new URL(request.url).hostname}
## Status: Verified Agent Access
---
This content is served via Cloudflare Workers at the Edge. 
By serving Markdown, we reduce token usage and improve LLM accuracy.
---
### Core Product Info
- Product: Cloudflare Platform PM Lab
- Purpose: Learning Human vs Agent traffic patterns.
- Tech Stack: Pages, Workers, AI Audit.
    `;

    return new Response(markdownContent, {
      headers: { 
        "Content-Type": "text/markdown; charset=utf-8",
        "X-Cloudflare-Strategy": "AIO-Enabled" // Custom header for your interview talking point!
      }
    });
  }

  // 3. If it's a Human (Browser), just show the normal site
  return await context.next();
}

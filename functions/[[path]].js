export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const acceptHeader = request.headers.get("Accept") || "";
  const userAgent = request.headers.get("User-Agent") || "";

  // 1. The Industry Standard: Check for Markdown Accept Header
  const prefersMarkdown = acceptHeader.includes("text/markdown");

  // 2. The Heuristic Fallback: Detect known AI Agents (GPTBot, etc.)
  const isKnownAIBot = /GPTBot|ChatGPT|ClaudeBot|PerplexityBot|Google-InspectionTool/i.test(userAgent);

  if (prefersMarkdown || isKnownAIBot) {
    // Construct the path to your .md file
    // Assumes your MD files are named after your routes (e.g., /about -> /about.md)
    const mdPath = url.pathname.endsWith('/') 
      ? `${url.origin}${url.pathname}index.md` 
      : `${url.origin}${url.pathname}.md`;

    try {
      const response = await fetch(mdPath);
      
      if (response.ok) {
        return new Response(await response.body, {
          headers: { 
            "Content-Type": "text/markdown; charset=utf-8",
            "X-Agent-Route": prefersMarkdown ? "Header-Match" : "UA-Match",
            "Vary": "Accept, User-Agent" // Crucial for Cloudflare Edge Caching
          },
        });
      }
    } catch (e) {
      console.error("Markdown delivery failed, falling back to HTML");
    }
  }

  // 3. Human/Default Path: Serve the standard Cloudflare Pages HTML
  return next();
}

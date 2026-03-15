const DISCORD_INVITE =
  "https://discord.com/oauth2/authorize?client_id=1469917860406100093&permissions=277025777728&integration_type=0&scope=bot+applications.commands";

export async function onRequest(context) {
  // ?source= tells us which button/page drove the click.
  // Cloudflare Pages request logs will show /invite?source=hero etc.
  // so you can see click volume per placement without any extra tooling.
  const url    = new URL(context.request.url);
  const source = url.searchParams.get("source") || "unknown";

  const headers = new Headers({
    "Location":      DISCORD_INVITE,
    "Cache-Control": "no-store",
    "X-Invite-Source": source,
  });

  return new Response(null, { status: 302, headers });
}

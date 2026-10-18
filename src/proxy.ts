const APP_HOST = "pilotstack.online"

export function proxy(request: Request) {
  const url = new URL(request.url)
  const host = (request.headers.get("x-forwarded-host") || url.host)
    .split(":")[0]
    .toLowerCase()

  // Vercel preview deployments must stay on their own hostname so reviewers can
  // validate branch changes without being redirected to production. This only
  // applies to preview environments; production still enforces the canonical host.
  const isVercelPreviewHost =
    process.env.VERCEL_ENV === "preview" && host.endsWith(".vercel.app")

  if (
    host === APP_HOST ||
    host === `www.${APP_HOST}` ||
    host.startsWith("localhost") ||
    // The CI route smoke test binds Next.js to 127.0.0.1; keep local requests
    // local rather than redirecting them to the public production hostname.
    host === "127.0.0.1" ||
    isVercelPreviewHost
  ) {
    return undefined
  }

  const dest = new URL(url.pathname + url.search, `https://${APP_HOST}`)
  return new Response(null, { status: 308, headers: { Location: dest.toString() } })
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}

const APP_HOST = "pilotstack.online"

export function proxy(request: Request) {
  const url = new URL(request.url)
  // Use the host actually requested. On Vercel, x-forwarded-host can reflect
  // the canonical/custom host even when the caller is testing a deployment URL.
  // Preferring it would redirect every Preview smoke test to production.
  const rawHost = request.headers.get("host") || url.host
  const host = rawHost.startsWith("[")
    ? rawHost.slice(1, rawHost.indexOf("]")).toLowerCase()
    : rawHost.split(":")[0].toLowerCase()
  const isLocalHost = host === "localhost" || host === "127.0.0.1" || host === "::1"

  // Keep local smoke tests and Vercel Preview deployments on their own origin.
  if (host === APP_HOST || isLocalHost || host.endsWith(".vercel.app")) {
    return undefined
  }

  const dest = new URL(url.pathname + url.search, `https://${APP_HOST}`)
  return new Response(null, { status: 308, headers: { Location: dest.toString() } })
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}

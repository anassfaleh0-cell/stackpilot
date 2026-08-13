const APP_HOST = "www.pilotstack.online"
const EXEMPT_PATHS = new Set(["/ads.txt"])

export function proxy(request: Request) {
  const url = new URL(request.url)
  const host = (request.headers.get("x-forwarded-host") || url.host).split(":")[0]

  if (host === APP_HOST || host.startsWith("localhost") || EXEMPT_PATHS.has(url.pathname)) {
    return undefined
  }

  const dest = new URL(url.pathname + url.search, `https://${APP_HOST}`)
  return new Response(null, { status: 308, headers: { Location: dest.toString() } })
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
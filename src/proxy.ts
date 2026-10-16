const APP_HOST = "pilotstack.online"

export function proxy(request: Request) {
  const url = new URL(request.url)
  const rawHost = request.headers.get("x-forwarded-host") || url.host
  const host = rawHost.startsWith("[")
    ? rawHost.slice(1, rawHost.indexOf("]")).toLowerCase()
    : rawHost.split(":")[0].toLowerCase()
  const isLocalHost = host === "localhost" || host === "127.0.0.1" || host === "::1"

  // Keep local smoke tests on the local server. Redirecting loopback hosts to
  // production makes the test silently crawl live pages instead of the build.
  if (host === APP_HOST || isLocalHost) {
    return undefined
  }

  const dest = new URL(url.pathname + url.search, `https://${APP_HOST}`)
  return new Response(null, { status: 308, headers: { Location: dest.toString() } })
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}

const APP_HOST = "pilotstack.online"

export function proxy(request: Request) {
  const url = new URL(request.url)
  const host = (request.headers.get("x-forwarded-host") || url.host).split(":")[0]

  if (host === APP_HOST || host.startsWith("localhost")) {
    return undefined
  }

  const dest = new URL(url.pathname + url.search, `https://${APP_HOST}`)
  return new Response(null, { status: 308, headers: { Location: dest.toString() } })
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}

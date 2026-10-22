const rateLimitStore: Record<string, { count: number; resetAt: number }> = {}

function rateLimit(ip: string, maxRequests = 5, windowMs = 60000) {
  const now = Date.now()
  const key = `newsletter:${ip}`
  if (!rateLimitStore[key] || rateLimitStore[key].resetAt < now) {
    rateLimitStore[key] = { count: 1, resetAt: now + windowMs }
    return { allowed: true, remaining: maxRequests - 1 }
  }
  rateLimitStore[key].count++
  return { allowed: rateLimitStore[key].count <= maxRequests, remaining: Math.max(0, maxRequests - rateLimitStore[key].count) }
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"

  const { allowed } = rateLimit(ip)
  if (!allowed) {
    return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    const isJson = request.headers.get("content-type")?.includes("application/json") ?? false
    const body = isJson ? await request.json() : null
    const formData = isJson ? null : await request.formData()
    const email = isJson
      ? (body && typeof body === "object" ? (body as { email?: unknown }).email : null)
      : formData?.get("email")

    if (!email || typeof email !== "string" || !email.trim()) {
      if (isJson) return Response.json({ error: "Please enter a valid email address." }, { status: 400 })
      return Response.redirect(new URL("/?error=missing-email#newsletter", request.url))
    }

    const cleanEmail = email.trim().toLowerCase()

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || cleanEmail.length > 254) {
      if (isJson) return Response.json({ error: "Please enter a valid email address." }, { status: 400 })
      return Response.redirect(new URL("/?error=invalid-email#newsletter", request.url))
    }

    // No mailing-list provider is configured. Never report success or imply that
    // the address was saved. JSON clients receive a real error instead of a redirect
    // that fetch() could follow and mistake for a successful subscription.
    if (isJson) {
      return Response.json({
        error: "Newsletter signup is not configured yet, so no subscription was saved. Please check back later.",
      }, { status: 503 })
    }
    return Response.redirect(new URL("/?error=newsletter-unavailable#newsletter", request.url))
  } catch {
    if (request.headers.get("content-type")?.includes("application/json")) {
      return Response.json({ error: "Invalid request. Please try again." }, { status: 400 })
    }
    return Response.redirect(new URL("/?error=server-error#newsletter", request.url))
  }
}

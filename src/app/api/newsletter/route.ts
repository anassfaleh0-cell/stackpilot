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
    const formData = await request.formData()
    const email = formData.get("email")

    if (!email || typeof email !== "string" || !email.trim()) {
      return Response.redirect(new URL("/?error=missing-email#newsletter", request.url))
    }

    const cleanEmail = email.trim().toLowerCase()

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return Response.redirect(new URL("/?error=invalid-email#newsletter", request.url))
    }

    if (cleanEmail.length > 254) {
      return Response.redirect(new URL("/?error=invalid-email#newsletter", request.url))
    }

    // This endpoint has no mailing-list provider configured. Do not log the address
    // or imply that a subscription was saved when no subscription system received it.
    return Response.redirect(new URL("/?error=newsletter-unavailable#newsletter", request.url))
  } catch {
    return Response.redirect(new URL("/?error=server-error#newsletter", request.url))
  }
}

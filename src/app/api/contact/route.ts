interface RateLimitStore {
  [key: string]: { count: number; resetAt: number }
}

const rateLimitStore: RateLimitStore = {}

function rateLimit(ip: string, maxRequests = 5, windowMs = 60000): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const key = `contact:${ip}`

  if (!rateLimitStore[key] || rateLimitStore[key].resetAt < now) {
    rateLimitStore[key] = { count: 1, resetAt: now + windowMs }
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs }
  }

  rateLimitStore[key].count++
  const remaining = Math.max(0, maxRequests - rateLimitStore[key].count)
  return { allowed: rateLimitStore[key].count <= maxRequests, remaining, resetAt: rateLimitStore[key].resetAt }
}

function sanitize(input: string): string {
  return input
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, 5000)
}

function validateContact(body: unknown): { valid: boolean; errors: Record<string, string>; data?: { name: string; email: string; subject: string; message: string } } {
  const errors: Record<string, string> = {}
  const input = body as Record<string, unknown> | null

  if (!input || typeof input !== "object") {
    return { valid: false, errors: { _form: "Invalid request body" } }
  }

  const name = typeof input.name === "string" ? sanitize(input.name) : ""
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : ""
  const message = typeof input.message === "string" ? sanitize(input.message) : ""
  const subject = typeof input.subject === "string" ? sanitize(input.subject) : ""

  if (!name || name.length < 1) errors.name = "Name is required"
  if (name.length > 100) errors.name = "Name is too long"

  if (!email) errors.email = "Email is required"
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Invalid email address"
  else if (email.length > 254) errors.email = "Email is too long"

  if (!message) errors.message = "Message is required"
  else if (message.length < 10) errors.message = "Message must be at least 10 characters"
  else if (message.length > 5000) errors.message = "Message is too long"

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors }
  }

  return { valid: true, errors: {}, data: { name, email, subject: subject || "general", message } }
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"

  const { allowed, remaining, resetAt } = rateLimit(ip)
  if (!allowed) {
    return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)),
        "X-RateLimit-Remaining": "0",
      },
    })
  }

  try {
    const body = await request.json()
    const validation = validateContact(body)

    if (!validation.valid) {
      return new Response(JSON.stringify({ error: Object.values(validation.errors)[0], errors: validation.errors }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": String(remaining),
        },
      })
    }

    const { name, email, subject, message } = validation.data!
    const apiKey = process.env.RESEND_API_KEY
    const from = process.env.CONTACT_FROM_EMAIL
    const to = process.env.CONTACT_TO_EMAIL || "contact@pilotstack.online"

    // Never report success unless a delivery provider has actually accepted the message.
    // The page provides a direct email fallback when these optional settings are absent.
    if (!apiKey || !from) {
      return new Response(JSON.stringify({
        error: "Contact form delivery is not configured yet. Please email contact@pilotstack.online directly.",
      }), {
        status: 503,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": String(remaining),
        },
      })
    }

    let delivery: Response
    try {
      delivery = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: email,
          subject: `[PilotStack contact] ${subject}`,
          text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
        }),
      })
    } catch {
      return new Response(JSON.stringify({ error: "Message delivery failed. Please email contact@pilotstack.online directly." }), {
        status: 502,
        headers: { "Content-Type": "application/json", "X-RateLimit-Remaining": String(remaining) },
      })
    }

    if (!delivery.ok) {
      return new Response(JSON.stringify({ error: "Message delivery failed. Please email contact@pilotstack.online directly." }), {
        status: 502,
        headers: { "Content-Type": "application/json", "X-RateLimit-Remaining": String(remaining) },
      })
    }

    return new Response(JSON.stringify({ success: true, message: "Message accepted for delivery. We'll reply to your email address." }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-RateLimit-Remaining": String(remaining),
      },
    })
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export async function GET() {
  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json", Allow: "POST" },
  })
}

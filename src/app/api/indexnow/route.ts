import { NextRequest } from "next/server"
import { submitUrl, submitBatch } from "@/lib/indexnow"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")
  if (!url) {
    return new Response(JSON.stringify({ error: "Missing url parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }
  const ok = await submitUrl(url)
  return new Response(JSON.stringify({ submitted: ok }), {
    status: ok ? 200 : 502,
    headers: { "Content-Type": "application/json" },
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { urls, url } = body

    if (urls && Array.isArray(urls)) {
      const ok = await submitBatch(urls)
      return new Response(JSON.stringify({ submitted: ok, count: urls.length }), {
        status: ok ? 200 : 502,
        headers: { "Content-Type": "application/json" },
      })
    }

    if (url) {
      const ok = await submitUrl(url)
      return new Response(JSON.stringify({ submitted: ok }), {
        status: ok ? 200 : 502,
        headers: { "Content-Type": "application/json" },
      })
    }

    return new Response(JSON.stringify({ error: "Missing url or urls" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }
}

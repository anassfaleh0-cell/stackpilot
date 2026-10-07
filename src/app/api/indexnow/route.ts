import { NextRequest } from "next/server"
import { submitUrl, submitBatch, isIndexableUrl } from "@/lib/indexnow"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")
  if (!url) {
    return new Response(JSON.stringify({ error: "Missing url parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }
  if (!isIndexableUrl(url)) {
    return new Response(JSON.stringify({ error: "URL is not an indexable page on this site" }), {
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
      const candidates = urls.filter((u): u is string => typeof u === "string")
      const allowed = candidates.filter(isIndexableUrl)
      if (allowed.length === 0) {
        return new Response(
          JSON.stringify({ error: "No submitted URL is an indexable page on this site" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        )
      }
      const ok = await submitBatch(allowed)
      return new Response(
        JSON.stringify({ submitted: ok, count: allowed.length, rejected: candidates.length - allowed.length }),
        { status: ok ? 200 : 502, headers: { "Content-Type": "application/json" } },
      )
    }

    if (url && typeof url === "string") {
      if (!isIndexableUrl(url)) {
        return new Response(JSON.stringify({ error: "URL is not an indexable page on this site" }), {
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

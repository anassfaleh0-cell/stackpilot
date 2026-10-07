import { revalidatePath } from "next/cache"
import { submitUrl, isIndexableUrl } from "@/lib/indexnow"
import { site } from "@/lib/constants"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { path, secret, contentType, slug } = body

    const configuredSecret = process.env.REVALIDATION_SECRET
    if (!configuredSecret || typeof secret !== "string" || secret !== configuredSecret) {
      return new Response(JSON.stringify({ error: "Invalid secret" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    const target =
      contentType && slug
        ? `/${contentType}/${slug}`
        : typeof path === "string" && path.startsWith("/") && !path.startsWith("//")
          ? path
          : null

    if (!target) {
      return new Response(JSON.stringify({ error: "Missing path" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    revalidatePath(target)

    const url = `${site.url}${target}`
    if (isIndexableUrl(url)) {
      submitUrl(url)
    }

    return new Response(JSON.stringify({ revalidated: true, url }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

import { revalidatePath } from "next/cache"
import { submitUrl } from "@/lib/indexnow"
import { site } from "@/lib/constants"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { path, secret, contentType, slug } = body

    if (secret !== process.env.REVALIDATION_SECRET) {
      return new Response(JSON.stringify({ error: "Invalid secret" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    if (path) {
      revalidatePath(path)
    }

    if (contentType && slug) {
      const url = `${site.url}/${contentType}/${slug}`
      submitUrl(url)
    } else if (path && path.startsWith("/")) {
      const url = `${site.url}${path}`
      submitUrl(url)
    }

    return new Response(JSON.stringify({ revalidated: true }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

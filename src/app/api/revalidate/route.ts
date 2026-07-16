import { revalidatePath } from "next/cache"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { path, secret } = body

    if (secret !== process.env.REVALIDATION_SECRET) {
      return new Response(JSON.stringify({ error: "Invalid secret" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    if (path) {
      revalidatePath(path)
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

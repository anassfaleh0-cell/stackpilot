import { ImageResponse } from "next/og"
import { getReview } from "@/lib/content/registry"
import fs from "node:fs"
import path from "node:path"

export const size = { width: 1200, height: 630 }

export const contentType = "image/png"

function loadFont(name: string): { name: string; data: ArrayBuffer; weight: number; style: "normal" } {
  const fp = path.join(process.cwd(), "public/fonts", name)
  return {
    name: "Geist",
    data: fs.readFileSync(fp).buffer.slice(0),
    weight: name.includes("Bold") ? 700 : 400,
    style: "normal",
  }
}

function renderStars(rating: number): string {
  const full = "★".repeat(Math.floor(rating))
  const empty = "☆".repeat(5 - Math.floor(rating))
  return full + empty
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = getReview(slug)
  if (!tool) return new ImageResponse(<div />, { ...size })

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0C0E14",
        fontFamily: "Geist",
        padding: "60px",
      }}
    >
      <div style={{ display: "flex", padding: "8px 20px", borderRadius: "999px", border: "1px solid rgba(124, 147, 245, 0.35)", color: "#7C93F5", fontSize: "18px", marginBottom: "28px", letterSpacing: "0.02em" }}>
        {tool.category}
      </div>

      <div style={{ display: "flex", fontSize: "56px", fontWeight: 700, color: "#FFFFFF", textAlign: "center", marginBottom: "12px", lineHeight: 1.15, maxWidth: "900px" }}>
        <span>{tool.name} Review</span>
      </div>

      <div style={{ display: "flex", fontSize: "20px", color: "#9CA3AF", textAlign: "center", marginBottom: "32px", maxWidth: "700px", lineHeight: 1.4 }}>
        <span>{tool.tagline}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
        <div style={{ display: "flex", fontSize: "36px", color: "#F0A030", gap: "2px" }}>
          {renderStars(tool.rating)}
        </div>
        <div style={{ display: "flex", fontSize: "28px", fontWeight: 700, color: "#FFFFFF" }}>{tool.rating}</div>
        <div style={{ display: "flex", fontSize: "18px", color: "#6B7280" }}>/ 5</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "16px", color: "#6B7280" }}>
        <span>Based on {tool.reviewCount.toLocaleString()} reviews</span>
      </div>

      <div style={{ position: "absolute", bottom: "44px", left: "60px", right: "60px", display: "flex", justifyContent: "center", fontSize: "15px", color: "#4B5563", letterSpacing: "0.04em" }}>
        <span>www.pilotstack.online/reviews/{slug}</span>
      </div>
    </div>,
    {
      ...size,
      fonts: [loadFont("Geist-Regular.ttf"), loadFont("Geist-Bold.ttf")],
    },
  )
}

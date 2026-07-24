import { ImageResponse } from "next/og"
import { getComparison, getReview } from "@/lib/content/registry"
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
  const cmp = getComparison(slug)
  if (!cmp) return new ImageResponse(<div />, { ...size })

  const review1 = getReview(cmp.tool1Slug)
  const review2 = getReview(cmp.tool2Slug)
  const r1 = review1?.rating ?? 0
  const r2 = review2?.rating ?? 0

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0C0E14",
        fontFamily: "Geist",
        padding: "60px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
          <div style={{ fontSize: "40px", fontWeight: 700, color: "#FFFFFF", marginBottom: "12px", textAlign: "center" }}>
            {cmp.tool1}
          </div>
          <div style={{ fontSize: "28px", color: "#F0A030", display: "flex", gap: "2px", marginBottom: "8px" }}>
            {renderStars(r1)}
          </div>
          <div style={{ display: "flex", fontSize: "18px", color: "#9CA3AF" }}>{r1}/5</div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "60px",
            height: "60px",
            borderRadius: "999px",
            backgroundColor: "rgba(124, 147, 245, 0.15)",
            fontSize: "24px",
            fontWeight: 700,
            color: "#7C93F5",
            margin: "0 20px",
          }}
        >
          VS
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
          <div style={{ fontSize: "40px", fontWeight: 700, color: "#FFFFFF", marginBottom: "12px", textAlign: "center" }}>
            {cmp.tool2}
          </div>
          <div style={{ fontSize: "28px", color: "#F0A030", display: "flex", gap: "2px", marginBottom: "8px" }}>
            {renderStars(r2)}
          </div>
          <div style={{ display: "flex", fontSize: "18px", color: "#9CA3AF" }}>{r2}/5</div>
        </div>
      </div>

      {cmp.winner && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "40px",
            padding: "12px 32px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, rgba(84, 114, 232, 0.2), rgba(124, 147, 245, 0.1))",
            border: "1px solid rgba(124, 147, 245, 0.3)",
            fontSize: "22px",
            fontWeight: 700,
            color: "#7C93F5",
          }}
        >
          {cmp.winner} wins — Best for most teams
        </div>
      )}

      {!cmp.winner && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "40px",
            padding: "12px 32px",
            fontSize: "18px",
            color: "#6B7280",
          }}
        >
          Tie — depends on your priorities
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "16px",
          fontSize: "15px",
          color: "#4B5563",
          letterSpacing: "0.04em",
        }}
      >
        {cmp.category}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "44px",
          left: "60px",
          right: "60px",
          display: "flex",
          justifyContent: "center",
          fontSize: "15px",
          color: "#4B5563",
          letterSpacing: "0.04em",
        }}
      >
        www.pilotstack.online/comparisons/{slug}
      </div>
    </div>,
    {
      ...size,
      fonts: [loadFont("Geist-Regular.ttf"), loadFont("Geist-Bold.ttf")],
    },
  )
}

"use client"

import { useEffect, useRef, useState } from "react"
import { PlayCircle } from "lucide-react"

const VAST_URL = "https://difficultblock.com/dVm/F.zNdQGBNIv/ZgGbUW/RermN9_u/ZGULlRkSP-TIczyRO/TMAo4vM/TOM/tqNPzYIc5NMDDwgnxxNKy/ZVsfawWw1GpYdCDK0JxR"

type VastState = "idle" | "loading" | "ready" | "error"

export function HilltopVast({ id = "hilltop-vast" }: { id?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [state, setState] = useState<VastState>("idle")
  const [src, setSrc] = useState("")

  const handlePlay = async () => {
    if (state === "loading" || state === "ready") return
    setState("loading")
    try {
      const res = await fetch(VAST_URL)
      if (!res.ok) throw new Error("VAST request failed")
      const xml = await res.text()
      const doc = new DOMParser().parseFromString(xml, "application/xml")
      const mediaFiles = Array.from(doc.getElementsByTagName("MediaFile"))
      const pick = mediaFiles.find((m) => /\.mp4/i.test(m.textContent || "")) || mediaFiles[0]
      const url = (pick?.textContent || "").trim()
      if (!url) throw new Error("No media file found")
      setSrc(url)
      setState("ready")
    } catch {
      setState("error")
    }
  }

  useEffect(() => {
    if (state === "ready" && src && videoRef.current) {
      videoRef.current.play().catch(() => {
        setState("error")
      })
    }
  }, [state, src])

  return (
    <div
      id={id}
      className="ad-slot overflow-hidden rounded-xl border border-border bg-muted-bg"
      style={{ aspectRatio: "16 / 9" }}
    >
      {state === "idle" && (
        <button
          type="button"
          onClick={handlePlay}
          aria-label="Play video advertisement"
          className="flex h-full w-full flex-col items-center justify-center gap-2 transition-colors hover:bg-accent-subtle/40"
        >
          <PlayCircle size={40} className="text-primary" />
          <span className="px-4 text-center text-xs font-medium text-muted-foreground">
            Sponsored video — click to play
          </span>
        </button>
      )}
      {state === "loading" && (
        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
          Loading video…
        </div>
      )}
      {state === "error" && (
        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
          Video unavailable
        </div>
      )}
      {state === "ready" && (
        <video
          ref={videoRef}
          src={src}
          controls
          playsInline
          preload="none"
          className="h-full w-full"
          onError={() => setState("error")}
        />
      )}
    </div>
  )
}

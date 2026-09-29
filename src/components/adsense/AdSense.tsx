"use client"

import { useEffect } from "react"

interface AdSenseProps {
  slot: string
  format?: "auto" | "horizontal" | "vertical" | "rectangle"
  className?: string
}

export function AdSense({ slot, format = "auto", className = "" }: AdSenseProps) {
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).adsbygoogle) {
      try {
        (window as any).adsbygoogle.push({})
      } catch (e) {
        console.warn("AdSense push failed:", e)
      }
    }
  }, [])

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: "block" }}
      data-ad-client="ca-pub-6523926892521982"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  )
}
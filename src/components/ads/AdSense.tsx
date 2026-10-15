"use client"

import { useEffect, useRef } from "react"

interface AdSenseProps {
  format: "banner" | "native" | "in-feed" | "anchor"
  slot?: string
  className?: string
  style?: React.CSSProperties
  "data-ad-client"?: string
  "data-ad-slot"?: string
  "data-ad-format"?: string
  "data-full-width-responsive"?: "true" | "false"
}

const AD_CLIENT = "ca-pub-6523926892521982"

const ENV_SLOTS: Record<string, string | undefined> = {
  banner: process.env.NEXT_PUBLIC_ADSENSE_BANNER_SLOT,
  native: process.env.NEXT_PUBLIC_ADSENSE_NATIVE_SLOT,
  "in-feed": process.env.NEXT_PUBLIC_ADSENSE_IN_FEED_SLOT,
  anchor: process.env.NEXT_PUBLIC_ADSENSE_ANCHOR_SLOT,
}

function hasConfiguredSlot(format: AdSenseProps["format"], slot?: string) {
  return Boolean(slot || ENV_SLOTS[format])
}

export function AdSense({
  format,
  slot,
  className = "",
  style,
  "data-ad-client": adClient = AD_CLIENT,
  "data-ad-slot": adSlot,
  "data-ad-format": adFormat,
  "data-full-width-responsive": fullWidthResponsive = "false",
}: AdSenseProps) {
  const insRef = useRef<HTMLModElement>(null)
  const pushedRef = useRef(false)

  useEffect(() => {
    if (insRef.current && !pushedRef.current && typeof window !== "undefined") {
      try {
        ;(window as unknown as { adsbygoogle: unknown[] }).adsbygoogle = (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []
        ;(window as unknown as { adsbygoogle: unknown[] }).adsbygoogle.push({})
        pushedRef.current = true
      } catch (e) {
        console.warn("AdSense push failed:", e)
      }
    }
  }, [])

  const getAdFormat = () => {
    if (adFormat) return adFormat
    switch (format) {
      case "banner":
        return "horizontal"
      case "native":
        return "fluid"
      case "in-feed":
        return "fluid"
      case "anchor":
        return "auto"
      default:
        return "auto"
    }
  }

  const getAdSlot = () => adSlot || slot || ENV_SLOTS[format] || ""

  const resolvedSlot = getAdSlot()
  if (!resolvedSlot) return null

  return (
    <ins
      ref={insRef}
      className={`adsbygoogle ${className}`}
      style={{
        display: "block",
        ...style,
      }}
      data-ad-client={adClient}
      data-ad-slot={getAdSlot()}
      data-ad-format={getAdFormat()}
      data-full-width-responsive={fullWidthResponsive}
      aria-label="Advertisement"
    />
  )
}

export function BannerAd({ className = "", style, slot }: { className?: string; style?: React.CSSProperties; slot?: string }) {
  if (!hasConfiguredSlot("banner", slot)) return null
  return (
    <div className={`ad-container ad-banner ${className}`} style={style}>
      <AdSense format="banner" slot={slot} style={{ minHeight: 90, width: "100%", maxWidth: 728 }} />
    </div>
  )
}

export function NativeAd({ className = "", style, slot }: { className?: string; style?: React.CSSProperties; slot?: string }) {
  if (!hasConfiguredSlot("native", slot)) return null
  return (
    <div className={`ad-container ad-native ${className}`} style={style}>
      <AdSense format="native" slot={slot} style={{ minHeight: 250, width: "100%", maxWidth: 300 }} />
    </div>
  )
}

export function InFeedAd({ className = "", style, slot }: { className?: string; style?: React.CSSProperties; slot?: string }) {
  if (!hasConfiguredSlot("in-feed", slot)) return null
  return (
    <div className={`ad-container ad-in-feed ${className}`} style={style}>
      <AdSense format="in-feed" slot={slot} style={{ minHeight: 90, width: "100%", maxWidth: 728 }} />
    </div>
  )
}

export function AnchorAd({ className = "", slot }: { className?: string; slot?: string }) {
  if (!hasConfiguredSlot("anchor", slot)) return null
  return (
    <div className={`ad-container ad-anchor ${className}`}>
      <AdSense format="anchor" slot={slot} style={{ display: "block" }} />
    </div>
  )
}
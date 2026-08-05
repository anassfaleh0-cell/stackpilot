"use client"

import { useRef, useSyncExternalStore } from "react"
import { LazyAd } from "./lazy-ad"

const SLIDER_SCRIPT = "https://prizefamily.com/b.XxVxsZduGclv0aYIWWc-/xe/mf9Au/ZbUGlRkSP-TIczyRO/TMAo4vM/TOM/tqNPzYIc5NMDDwgnxxNKy/ZVsfawWw1GpYdCDK0JxR"

function subscribe(callback: () => void) {
  const desktop = window.matchMedia("(min-width: 1024px)")
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
  desktop.addEventListener("change", callback)
  motion.addEventListener("change", callback)
  return () => {
    desktop.removeEventListener("change", callback)
    motion.removeEventListener("change", callback)
  }
}

function getSnapshot() {
  return (
    window.matchMedia("(min-width: 1024px)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

export function HilltopVideoSlider({ id = "hilltop-video-slider" }: { id?: string }) {
  const allowed = useSyncExternalStore(subscribe, getSnapshot, () => false)
  const hostRef = useRef<HTMLDivElement>(null)
  const mountedRef = useRef(false)

  if (!allowed) return null

  return (
    <LazyAd
      id={id}
      className="ad-slot flex justify-center"
      onVisible={() => {
        const host = hostRef.current
        if (!host || mountedRef.current) return
        mountedRef.current = true
        const s = document.createElement("script") as HTMLScriptElement & {
          settings?: Record<string, unknown>
        }
        s.settings = { appendTo: `#${id}`, options: { uniqueID: `${id}-unit` } }
        s.async = true
        s.referrerPolicy = "no-referrer-when-downgrade"
        s.src = SLIDER_SCRIPT
        host.appendChild(s)
      }}
    >
      <div ref={hostRef} />
    </LazyAd>
  )
}

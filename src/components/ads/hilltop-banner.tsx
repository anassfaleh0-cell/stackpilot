"use client"

import { useRef } from "react"
import { LazyAd } from "./lazy-ad"

const BANNER_SCRIPT = "https://prizefamily.com/bwXyVos.dKGmlo0rY/WDcb/tehm-9cuyZXU/ljkBPmT/clymOkT-Av3INkj-U/tAN/zqIE5hM/D/c/2ROUQx"
const BANNER_GUARD = "ecc125"

type BannerTask = (done: () => void) => void
const pending: BannerTask[] = []
let running = false

function drain() {
  if (running || pending.length === 0) return
  running = true
  const task = pending.shift()!
  const done = () => {
    running = false
    drain()
  }
  try {
    task(done)
  } catch {
    done()
  }
}

function enqueueBanner(host: HTMLElement, appendTo: string, uniqueID: string) {
  pending.push((done) => {
    const w = window as unknown as Record<string, unknown>
    delete w[BANNER_GUARD]
    const s = document.createElement("script") as HTMLScriptElement & {
      settings?: Record<string, unknown>
    }
    s.settings = { appendTo, options: { uniqueID } }
    s.async = true
    s.referrerPolicy = "no-referrer-when-downgrade"
    s.onload = done
    s.onerror = done
    s.src = BANNER_SCRIPT
    host.appendChild(s)
  })
  drain()
}

export function HilltopBanner({ id = "hilltop-banner" }: { id?: string }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const mountedRef = useRef(false)

  return (
    <LazyAd
      id={id}
      className="ad-slot flex justify-center"
      onVisible={() => {
        const host = hostRef.current
        if (!host || mountedRef.current) return
        mountedRef.current = true
        enqueueBanner(host, `#${id}`, `${id}-unit`)
      }}
    >
      <div ref={hostRef} />
    </LazyAd>
  )
}

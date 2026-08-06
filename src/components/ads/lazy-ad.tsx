"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

export function LazyAd({
  id,
  minHeight = 250,
  className,
  onVisible,
  children,
}: {
  id: string
  minHeight?: number
  className?: string
  onVisible?: () => void
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const fired = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true)
          io.disconnect()
        }
      },
      { rootMargin: "300px 0px", threshold: 0.01 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!visible || fired.current) return
    fired.current = true
    onVisible?.()
  }, [visible, onVisible])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const hideIfEmpty = () => {
      if (!el.querySelector("iframe")) el.hidden = true
    }
    const afterVisible = visible ? window.setTimeout(hideIfEmpty, 12000) : 0
    return () => {
      if (afterVisible) window.clearTimeout(afterVisible)
    }
  }, [visible])

  return (
    <div ref={ref} id={id} className={className} style={{ minHeight }}>
      {visible ? children : null}
    </div>
  )
}

"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

export function LazyAd({
  id,
  minHeight,
  className,
  children,
}: {
  id: string
  minHeight?: number
  className?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

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

  return (
    <div ref={ref} id={id} className={className} style={minHeight ? { minHeight } : undefined}>
      {visible ? children : null}
    </div>
  )
}

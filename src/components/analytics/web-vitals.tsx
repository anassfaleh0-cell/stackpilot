"use client"

import { useEffect } from "react"

type MetricName = "LCP" | "FID" | "CLS" | "INP" | "TTFB" | "FCP"

interface WebVitalMetric {
  name: MetricName
  value: number
  rating: "good" | "needs-improvement" | "poor"
  delta: number
  id: string
}

function sendToDataLayer(metric: WebVitalMetric) {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: "core_web_vital",
    web_vital_metric: metric.name,
    web_vital_value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
    web_vital_rating: metric.rating,
    web_vital_delta: Math.round(metric.delta),
    web_vital_id: metric.id,
  })
}

function getRating(name: MetricName, value: number): "good" | "needs-improvement" | "poor" {
  const thresholds: Record<MetricName, [number, number]> = {
    LCP: [2500, 4000],
    FID: [100, 300],
    CLS: [0.1, 0.25],
    INP: [200, 500],
    TTFB: [800, 1800],
    FCP: [1800, 3000],
  }
  const [good, poor] = thresholds[name]
  if (value <= good) return "good"
  if (value <= poor) return "needs-improvement"
  return "poor"
}

export function WebVitals() {
  useEffect(() => {
    if (typeof window === "undefined" || !("PerformanceObserver" in window)) return

    let clsValue = 0
    let clsId = ""

    // CLS - needs special handling (cumulative)
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as PerformanceEntry & { hadRecentInput?: boolean }).hadRecentInput) {
          clsValue += (entry as PerformanceEntry & { value?: number }).value || 0
          clsId = (entry as PerformanceEntry & { id?: string }).id || ""
        }
      }
    })

    try {
      clsObserver.observe({ type: "layout-shift", buffered: true })
    } catch {}

    // Send CLS on page hide
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && clsValue > 0) {
        sendToDataLayer({
          name: "CLS",
          value: clsValue,
          rating: getRating("CLS", clsValue),
          delta: clsValue,
          id: clsId,
        })
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    // LCP
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      if (lastEntry) {
        const raw = lastEntry as unknown as Record<string, number>
        const value = (raw.renderTime || raw.startTime || 0)
        sendToDataLayer({
          name: "LCP",
          value,
          rating: getRating("LCP", value),
          delta: value,
          id: String((lastEntry as unknown as Record<string, string>).id || ""),
        })
      }
    })

    try {
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true })
    } catch {}

    // FID / INP
    const inputObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const e = entry as unknown as Record<string, unknown>
        const processingStart = e.processingStart as number
        const startTime = e.startTime as number
        const duration = e.duration as number
        const name = e.name as string
        if (processingStart && startTime) {
          const delay = processingStart - startTime
          const metricName: MetricName = name === "first-input" ? "FID" : "INP"
          sendToDataLayer({
            name: metricName,
            value: metricName === "INP" ? (duration || delay) : delay,
            rating: getRating(metricName, delay),
            delta: delay,
            id: String(e.id || ""),
          })
        }
      }
    })

    try {
      inputObserver.observe({ type: "first-input", buffered: true })
    } catch {}

    try {
      inputObserver.observe({ type: "event", buffered: true })
    } catch {}

    // TTFB
    const ttfbObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const navEntry = entries[0] as PerformanceEntry & { responseStart?: number; requestStart?: number }
      if (navEntry && navEntry.responseStart) {
        const value = navEntry.responseStart
        sendToDataLayer({
          name: "TTFB",
          value,
          rating: getRating("TTFB", value),
          delta: value,
          id: "",
        })
      }
    })

    try {
      ttfbObserver.observe({ type: "navigation", buffered: true })
    } catch {}

    // FCP
    const fcpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === "first-contentful-paint") {
          const value = entry.startTime
          sendToDataLayer({
            name: "FCP",
            value,
            rating: getRating("FCP", value),
            delta: value,
            id: String((entry as unknown as Record<string, string>).id || ""),
          })
        }
      }
    })

    try {
      fcpObserver.observe({ type: "paint", buffered: true })
    } catch {}

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      clsObserver.disconnect()
      lcpObserver.disconnect()
      inputObserver.disconnect()
      ttfbObserver.disconnect()
      fcpObserver.disconnect()
    }
  }, [])

  return null
}

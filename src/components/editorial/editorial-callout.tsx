import type { ReactNode } from "react"
import { getPalette } from "./palette"

interface EditorialCalloutProps {
  type: "tip" | "warning" | "info" | "key"
  title: string
  children: ReactNode
  category?: string
  className?: string
}

const configMap: Record<string, { icon: string; borderClass: string; bgClass: string }> = {
  tip: { icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", borderClass: "border-primary/20", bgClass: "bg-primary-subtle" },
  warning: { icon: "M12 9v4m0 4h.01M10.29 3.86l-8.6 14.86A2 2 0 0 0 3.4 21h17.2a2 2 0 0 0 1.72-3.28l-8.6-14.86a2 2 0 0 0-3.44 0z", borderClass: "border-warning/25", bgClass: "bg-warning-subtle" },
  info: { icon: "M13 16h-1v-4h-1m1-4h.01M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z", borderClass: "border-info/20", bgClass: "bg-info-subtle" },
  key: { icon: "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01 9 11.01", borderClass: "border-success/20", bgClass: "bg-success-subtle" },
}

export function EditorialCallout({ type, title, children, category = "Productivity", className = "" }: EditorialCalloutProps) {
  const p = getPalette(category)
  const c = configMap[type]

  return (
    <div className={`rounded-xl p-4 my-4 border ${c.borderClass} ${c.bgClass} ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={p.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d={c.icon} />
        </svg>
        <h4 className="text-sm font-semibold">{title}</h4>
      </div>
      <div className="text-sm text-muted leading-relaxed">{children}</div>
    </div>
  )
}

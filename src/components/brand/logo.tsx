import Link from "next/link"
import type { AnchorHTMLAttributes, HTMLAttributes, SVGProps } from "react"
import { cn } from "@/lib/utils"

/**
 * PilotStack logo system — Concept 1 (Modern & Clean).
 *
 * Symbol: three stacked geometric layers with a blue → indigo → purple
 * progression. Wordmark: "Pilot" (semibold, brand ink) + "Stack" (extrabold,
 * brand blue) rendered as live text so it stays crisp, selectable and
 * accessible without shipping an extra font.
 */

export type LogoVariant = "default" | "compact" | "dark" | "mono"
export type LogoTone = "auto" | "light" | "dark" | "mono"
export type LogoSize = "sm" | "md" | "lg"

/** Three stacked layers on a 64×64 grid. */
export const LOGO_LAYERS = [
  "M32 8 58 13 32 18 6 13Z",
  "M32 27 58 32 32 37 6 32Z",
  "M32 46 58 51 32 56 6 51Z",
] as const

export const BRAND_COLORS = {
  blue: "#2563EB",
  indigo: "#6366F1",
  purple: "#8B5CF6",
  navy: "#0F172A",
  neutral: "#F8FAFC",
} as const

const LAYER_COLORS: Record<LogoTone, readonly [string, string, string]> = {
  auto: ["var(--logo-blue)", "var(--logo-indigo)", "var(--logo-purple)"],
  light: [BRAND_COLORS.blue, BRAND_COLORS.indigo, BRAND_COLORS.purple],
  dark: ["#3B82F6", "#818CF8", "#A78BFA"],
  mono: ["currentColor", "currentColor", "currentColor"],
}

const WORDMARK_INK: Record<LogoTone, string> = {
  auto: "var(--brand-ink)",
  light: BRAND_COLORS.navy,
  dark: BRAND_COLORS.neutral,
  mono: "currentColor",
}

const WORDMARK_ACCENT: Record<LogoTone, string> = {
  auto: "var(--brand-accent-ink)",
  light: BRAND_COLORS.blue,
  dark: "#60A5FA",
  mono: "currentColor",
}

const SIZE_DIMS: Record<LogoSize, { gap: string; symbol: string; wordmark: string }> = {
  sm: { gap: "gap-2", symbol: "h-6 w-6", wordmark: "text-[15px]" },
  md: { gap: "gap-2.5", symbol: "h-7 w-7", wordmark: "text-lg" },
  lg: { gap: "gap-3", symbol: "h-8 w-8", wordmark: "text-xl" },
}

function toneForVariant(variant: LogoVariant): LogoTone {
  if (variant === "dark") return "dark"
  if (variant === "mono") return "mono"
  return "auto"
}

export interface LogoSymbolProps extends Omit<SVGProps<SVGSVGElement>, "color"> {
  tone?: LogoTone
  /** When provided the symbol becomes an accessible image with this label. */
  title?: string
}

export function LogoSymbol({ tone = "auto", title, className, ...props }: LogoSymbolProps) {
  const colors = LAYER_COLORS[tone]
  const labelled = Boolean(title)

  return (
    <svg
      viewBox="0 0 64 64"
      width={64}
      height={64}
      className={cn("block shrink-0 select-none", className)}
      role={labelled ? "img" : undefined}
      aria-hidden={labelled ? undefined : true}
      aria-label={labelled ? title : undefined}
      focusable="false"
      {...props}
    >
      {labelled ? <title>{title}</title> : null}
      <g fill="none" strokeWidth={4} strokeLinejoin="round" strokeLinecap="round">
        {LOGO_LAYERS.map((d, i) => (
          <path key={i} d={d} fill={colors[i]} stroke={colors[i]} />
        ))}
      </g>
    </svg>
  )
}

export interface WordmarkProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: LogoTone
}

export function Wordmark({ tone = "auto", className, ...props }: WordmarkProps) {
  return (
    <span
      className={cn("inline-flex whitespace-nowrap leading-none tracking-[-0.02em]", className)}
      {...props}
    >
      <span className="font-semibold" style={{ color: WORDMARK_INK[tone] }}>Pilot</span>
      <span className="font-extrabold" style={{ color: WORDMARK_ACCENT[tone] }}>Stack</span>
    </span>
  )
}

export interface LogoProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: LogoVariant
  size?: LogoSize
  showWordmark?: boolean
  symbolClassName?: string
}

export function Logo({
  variant = "default",
  size,
  showWordmark = true,
  symbolClassName,
  className,
  ...props
}: LogoProps) {
  const tone = toneForVariant(variant)
  const dims = SIZE_DIMS[size ?? (variant === "compact" ? "sm" : "md")]

  return (
    <span className={cn("inline-flex items-center", dims.gap, className)} {...props}>
      <LogoSymbol tone={tone} className={cn(dims.symbol, symbolClassName)} />
      {showWordmark ? <Wordmark tone={tone} className={dims.wordmark} /> : null}
    </span>
  )
}

export interface LogoLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: LogoVariant
  size?: LogoSize
  showWordmark?: boolean
  label?: string
}

/** Horizontal lockup wrapped in a link to the homepage. */
export function LogoLink({
  variant = "default",
  size,
  showWordmark = true,
  label,
  className,
  ...props
}: LogoLinkProps) {
  return (
    <Link
      href="/"
      aria-label={label}
      className={cn("inline-flex items-center transition-opacity hover:opacity-85", className)}
      {...props}
    >
      <Logo variant={variant} size={size} showWordmark={showWordmark} />
    </Link>
  )
}

import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import type { AnchorHTMLAttributes, ReactNode } from "react"

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children?: ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}))

import { BRAND_COLORS, LOGO_LAYERS, Logo, LogoLink, LogoSymbol, Wordmark } from "@/components/brand"
import { Header } from "@/components/layout/header"

const LAYER_D = [...LOGO_LAYERS]

/** jsdom serialises hex colours as rgb(), so compare in the same shape. */
function rgb(hex: string): string {
  const n = parseInt(hex.slice(1), 16)
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`
}

function svgPaths(root: HTMLElement): SVGPathElement[] {
  return Array.from(root.querySelectorAll("path"))
}

function fills(root: HTMLElement): string[] {
  return svgPaths(root).map((p) => p.getAttribute("fill") ?? "")
}

afterEach(cleanup)

describe("BRAND-01 logo system", () => {
  it("exports the three stacked layer paths on the 64x64 grid", () => {
    expect(LOGO_LAYERS).toHaveLength(3)
    for (const d of LOGO_LAYERS) expect(d).toMatch(/^M32 \d+ 58 \d+ 32 \d+ 6 \d+Z$/)
    expect(BRAND_COLORS).toMatchObject({
      blue: "#2563EB",
      indigo: "#6366F1",
      purple: "#8B5CF6",
      navy: "#0F172A",
      neutral: "#F8FAFC",
    })
  })

  it("renders the symbol decorative by default", () => {
    const { container } = render(<LogoSymbol />)
    const svg = container.querySelector("svg") as SVGSVGElement
    expect(svg).toHaveAttribute("viewBox", "0 0 64 64")
    expect(svg).toHaveAttribute("aria-hidden", "true")
    expect(svg).not.toHaveAttribute("role")
    expect(container.querySelectorAll("path")).toHaveLength(3)
  })

  it("becomes an accessible image when given a title", () => {
    render(<LogoSymbol title="PilotStack" />)
    const img = screen.getByRole("img", { name: "PilotStack" })
    expect(img.querySelector("title")?.textContent).toBe("PilotStack")
    expect(img).not.toHaveAttribute("aria-hidden")
  })

  it("draws each layer with its own brand colour", () => {
    const { container } = render(<LogoSymbol tone="light" />)
    expect(fills(container)).toEqual([BRAND_COLORS.blue, BRAND_COLORS.indigo, BRAND_COLORS.purple])
    expect(svgPaths(container).map((p) => p.getAttribute("d"))).toEqual(LAYER_D)
    expect(svgPaths(container).every((p) => p.getAttribute("stroke") === p.getAttribute("fill"))).toBe(true)
  })

  it("lightens the layers for dark backgrounds", () => {
    const { container } = render(<LogoSymbol tone="dark" />)
    expect(fills(container)).toEqual(["#3B82F6", "#818CF8", "#A78BFA"])
  })

  it("flattens to a single colour for mono use", () => {
    const { container } = render(<LogoSymbol tone="mono" />)
    expect(fills(container)).toEqual(["currentColor", "currentColor", "currentColor"])
  })

  it("resolves auto tone through CSS custom properties", () => {
    const { container } = render(<LogoSymbol />)
    expect(fills(container)).toEqual(["var(--logo-blue)", "var(--logo-indigo)", "var(--logo-purple)"])
  })

  it("keeps the wordmark adjacent so the accessible name reads PilotStack", () => {
    const { container } = render(<Wordmark />)
    const spans = container.querySelectorAll("span > span")
    expect(spans).toHaveLength(2)
    expect(spans[0]).toHaveTextContent(/^Pilot$/)
    expect(spans[1]).toHaveTextContent(/^Stack$/)
    expect(spans[0].className).toContain("font-semibold")
    expect(spans[1].className).toContain("font-extrabold")
    expect(container.textContent).toBe("PilotStack")
  })

  it("colours the wordmark per tone", () => {
    const light = render(<Wordmark tone="light" />)
    let spans = light.container.querySelectorAll("span > span")
    expect(spans[0].getAttribute("style")).toBe(`color: ${rgb(BRAND_COLORS.navy)};`)
    expect(spans[1].getAttribute("style")).toBe(`color: ${rgb(BRAND_COLORS.blue)};`)
    cleanup()

    const mono = render(<Wordmark tone="mono" />)
    spans = mono.container.querySelectorAll("span > span")
    expect(spans[0].getAttribute("style")).toMatch(/currentcolor/i)
    expect(spans[1].getAttribute("style")).toMatch(/currentcolor/i)
  })

  it("exposes PilotStack as a single readable text node", () => {
    const { container } = render(<Logo />)
    expect(container.textContent).toBe("PilotStack")
    expect(container.querySelector("svg")).toBeTruthy()
  })

  it("supports compact, dark and mono variants", () => {
    const compact = render(<Logo variant="compact" />)
    expect(compact.container.querySelector("svg")).toBeTruthy()
    cleanup()

    const dark = render(<Logo variant="dark" />)
    expect(dark.container.textContent).toBe("PilotStack")
    expect(fills(dark.container)[0]).toBe("#3B82F6")
    cleanup()

    const mono = render(<Logo variant="mono" />)
    expect(fills(mono.container)).toEqual(["currentColor", "currentColor", "currentColor"])
    cleanup()
  })

  it("scales by size token", () => {
    const sm = render(<Logo size="sm" />)
    expect(sm.container.querySelector("svg")?.getAttribute("class")).toContain("h-6")
    cleanup()

    const md = render(<Logo size="md" />)
    expect(md.container.querySelector("svg")?.getAttribute("class")).toContain("h-7")
    cleanup()

    const lg = render(<Logo size="lg" />)
    expect(lg.container.querySelector("svg")?.getAttribute("class")).toContain("h-8")
  })

  it("can drop the wordmark", () => {
    const { container } = render(<Logo showWordmark={false} />)
    expect(container.textContent).toBe("")
    expect(container.querySelectorAll("path")).toHaveLength(3)
  })

  it("wraps the lockup in a link home with an explicit label", () => {
    render(<LogoLink label="PilotStack - Home" />)
    const link = screen.getByRole("link", { name: "PilotStack - Home" })
    expect(link).toHaveAttribute("href", "/")
    expect(link.textContent).toBe("PilotStack")
  })
})

describe("BRAND-01 header lockup", () => {
  it("renders the vector logo instead of a raster favicon image", () => {
    const { container } = render(<Header />)
    const home = screen.getByRole("link", { name: "PilotStack - Home" })
    expect(home).toHaveAttribute("href", "/")
    expect(home.querySelector("svg")).toBeTruthy()
    expect(home.textContent).toBe("PilotStack")
    expect(container.querySelector('img[src*="favicon"]')).toBeNull()
  })
})

import { cleanup, fireEvent, render, screen, act } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
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
}))

import { Navigation } from "@/components/layout/navigation"

function trigger(label: RegExp) {
  return screen.getByRole("button", { name: label })
}

function triggerLi(label: RegExp) {
  return trigger(label).closest("li") as HTMLLIElement
}

function panelOf(label: RegExp) {
  const id = trigger(label).getAttribute("aria-controls")
  expect(id).toBeTruthy()
  return document.getElementById(id as string) as HTMLDivElement
}

function openViaHover(label: RegExp) {
  fireEvent.mouseOver(triggerLi(label))
  expect(trigger(label)).toHaveAttribute("aria-expanded", "true")
}

describe("Desktop primary navigation", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it("renders four top-level items: three disclosure buttons plus a direct Reviews link", () => {
    render(<Navigation />)
    expect(screen.getByRole("button", { name: /compare tools/i })).toHaveAttribute("aria-expanded", "false")
    expect(screen.getByRole("button", { name: /find by need/i })).toHaveAttribute("aria-expanded", "false")
    expect(screen.getByRole("button", { name: /guides & research/i })).toHaveAttribute("aria-expanded", "false")
    expect(screen.getByRole("link", { name: "Reviews" })).toHaveAttribute("href", "/reviews")
    expect(screen.queryByRole("button", { name: /reviews/i })).not.toBeInTheDocument()
    expect(document.querySelectorAll('nav[aria-label="Main navigation"]')).toHaveLength(1)
    expect(document.querySelectorAll("nav")).toHaveLength(1)
  })

  it("hover opens the submenu with valid aria-expanded/aria-controls and the hover bridge", () => {
    render(<Navigation />)
    const btn = trigger(/compare tools/i)
    expect(btn).toHaveAttribute("aria-expanded", "false")
    const panel = panelOf(/compare tools/i)
    expect(panel).toHaveAttribute("hidden")

    openViaHover(/compare tools/i)
    expect(btn).toHaveAttribute("aria-expanded", "true")
    expect(panel).not.toHaveAttribute("hidden")
    expect(panel.querySelector('a[href="/comparisons"]')).not.toBeNull()
    expect(panel.querySelector('a[href="/best"]')).not.toBeNull()
    expect(panel.querySelector('a[href="/alternatives"]')).not.toBeNull()
    expect(panel.className).toContain("before:-top-1")
    expect(panel.className).toContain("before:h-1")
  })

  it("closes only after the 150ms grace period when the pointer leaves for good", () => {
    render(<Navigation />)
    openViaHover(/compare tools/i)
    fireEvent.mouseOut(triggerLi(/compare tools/i), { relatedTarget: document.body })
    act(() => {
      vi.advanceTimersByTime(149)
    })
    expect(trigger(/compare tools/i)).toHaveAttribute("aria-expanded", "true")
    act(() => {
      vi.advanceTimersByTime(2)
    })
    expect(trigger(/compare tools/i)).toHaveAttribute("aria-expanded", "false")
  })

  it("does not close while the pointer transits toward the submenu (root-cause guard)", () => {
    render(<Navigation />)
    const li = triggerLi(/compare tools/i)
    fireEvent.mouseOver(li)
    fireEvent.mouseOut(li, { relatedTarget: document.body })
    fireEvent.mouseOver(li)
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(trigger(/compare tools/i)).toHaveAttribute("aria-expanded", "true")
    expect(panelOf(/compare tools/i)).not.toHaveAttribute("hidden")
  })

  it("keeps the menu open on pointer click (no hover/click state fight)", () => {
    render(<Navigation />)
    const btn = trigger(/compare tools/i)
    fireEvent.mouseOver(btn.closest("li") as HTMLElement)
    expect(btn).toHaveAttribute("aria-expanded", "true")
    fireEvent.click(btn)
    expect(btn).toHaveAttribute("aria-expanded", "true")
    fireEvent.click(btn)
    expect(btn).toHaveAttribute("aria-expanded", "true")
    expect(panelOf(/compare tools/i)).not.toHaveAttribute("hidden")
  })

  it("clicking the trigger while closed opens the menu", () => {
    render(<Navigation />)
    const btn = trigger(/compare tools/i)
    fireEvent.click(btn)
    expect(btn).toHaveAttribute("aria-expanded", "true")
    expect(panelOf(/compare tools/i)).not.toHaveAttribute("hidden")
  })

  it("mousedown outside closes the submenu", () => {
    render(<Navigation />)
    openViaHover(/compare tools/i)
    fireEvent.mouseDown(document.body)
    expect(trigger(/compare tools/i)).toHaveAttribute("aria-expanded", "false")
    expect(panelOf(/compare tools/i)).toHaveAttribute("hidden")
  })

  it("Escape closes the submenu and restores focus to the trigger", () => {
    render(<Navigation />)
    const btn = trigger(/compare tools/i)
    openViaHover(/compare tools/i)
    btn.focus()
    fireEvent.keyDown(document, { key: "Escape" })
    expect(btn).toHaveAttribute("aria-expanded", "false")
    expect(document.activeElement).toBe(btn)
  })

  it("focus leaving the item closes it; focus moving to a submenu link keeps it open", () => {
    render(<Navigation />)
    const li = triggerLi(/compare tools/i)
    openViaHover(/compare tools/i)
    const child = screen.getByRole("link", { name: "Best Software" })
    fireEvent.focusOut(li, { relatedTarget: child })
    expect(trigger(/compare tools/i)).toHaveAttribute("aria-expanded", "true")
    fireEvent.focusOut(li, { relatedTarget: document.body })
    expect(trigger(/compare tools/i)).toHaveAttribute("aria-expanded", "false")
  })

  it("clicking a submenu link closes the menu", () => {
    render(<Navigation />)
    openViaHover(/compare tools/i)
    fireEvent.click(screen.getByRole("link", { name: "Comparisons" }))
    expect(trigger(/compare tools/i)).toHaveAttribute("aria-expanded", "false")
    expect(panelOf(/compare tools/i)).toHaveAttribute("hidden")
  })

  it("hover transfer closes the previous dropdown and opens the new one", () => {
    render(<Navigation />)
    openViaHover(/compare tools/i)
    const from = triggerLi(/compare tools/i)
    const to = triggerLi(/find by need/i)
    fireEvent.mouseOut(from, { relatedTarget: to })
    fireEvent.mouseOver(to)
    expect(trigger(/find by need/i)).toHaveAttribute("aria-expanded", "true")
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(trigger(/compare tools/i)).toHaveAttribute("aria-expanded", "false")
    expect(trigger(/find by need/i)).toHaveAttribute("aria-expanded", "true")
  })

  it("Guides & Research exposes Guides and Research children", () => {
    render(<Navigation />)
    openViaHover(/guides & research/i)
    const panel = panelOf(/guides & research/i)
    expect(panel.querySelector('a[href="/guides"]')).not.toBeNull()
    expect(panel.querySelector('a[href="/blog"]')).not.toBeNull()
  })
})

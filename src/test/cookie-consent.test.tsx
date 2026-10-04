import fs from "node:fs"
import path from "node:path"
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { CookieConsent } from "@/components/analytics/cookie-consent"

const KEY = "pilotstack-cookie-consent"

// Node's experimental `localStorage` global shadows jsdom's implementation and
// resolves to `undefined` without `--localstorage-file`, so install a real
// Storage on the test global before the component reads it.
function createMemoryStorage(): Storage {
  let data: Record<string, string> = {}
  return {
    get length() {
      return Object.keys(data).length
    },
    clear() {
      data = {}
    },
    getItem(key: string) {
      return Object.hasOwn(data, key) ? data[key] : null
    },
    key(index: number) {
      return Object.keys(data)[index] ?? null
    },
    removeItem(key: string) {
      delete data[key]
    },
    setItem(key: string, value: string) {
      data[key] = String(value)
    },
  }
}

Object.defineProperty(globalThis, "localStorage", {
  value: createMemoryStorage(),
  configurable: true,
  writable: true,
})

const gtagMock = vi.fn()

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const banner = () => screen.queryByRole("dialog", { name: "Cookie consent" })
const acceptButton = () => screen.queryByRole("button", { name: "Accept All" })
const storedConsent = (): { accepted: boolean; prefs: { analytics: boolean; advertising: boolean } } | null => {
  const raw = localStorage.getItem(KEY)
  return raw ? JSON.parse(raw) : null
}

async function expectBannerVisible() {
  await waitFor(() => expect(banner()).toBeInTheDocument(), { timeout: 5000 })
}

beforeEach(() => {
  localStorage.clear()
  gtagMock.mockClear()
  window.gtag = gtagMock
  document.getElementById("ga-gtag")?.remove()
  document.getElementById("clarity-dynamic")?.remove()
  document.getElementById("adsense-script")?.remove()
})

afterEach(() => {
  cleanup()
  window.gtag = undefined
  localStorage.clear()
})

describe("T-COOKIE-01: fresh visitor sees the banner", () => {
  it("shows the banner when no consent is stored", async () => {
    render(<CookieConsent />)
    await expectBannerVisible()
  })
})

describe("T-COOKIE-02: one Accept All click hides the banner", () => {
  it("hides the banner synchronously on the first click", async () => {
    render(<CookieConsent />)
    await expectBannerVisible()

    fireEvent.click(screen.getByRole("button", { name: "Accept All" }))

    expect(banner()).toBeNull()
    expect(acceptButton()).toBeNull()
  })
})

describe("T-COOKIE-03: one Accept All click persists consent", () => {
  it("writes the accepted consent to storage on the first click", async () => {
    render(<CookieConsent />)
    await expectBannerVisible()

    fireEvent.click(screen.getByRole("button", { name: "Accept All" }))

    expect(storedConsent()).toEqual({
      accepted: true,
      prefs: { analytics: true, advertising: true },
    })
  })
})

describe("T-COOKIE-04: returning user does not see the banner", () => {
  it("keeps the banner hidden when accepted consent is already stored", async () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ accepted: true, prefs: { analytics: true, advertising: true } })
    )

    render(<CookieConsent />)
    await sleep(1500)

    expect(banner()).toBeNull()
    expect(acceptButton()).toBeNull()
  })

  it("keeps the banner hidden when a previous decline is stored", async () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ accepted: false, prefs: { analytics: false, advertising: false } })
    )

    render(<CookieConsent />)
    await sleep(1500)

    expect(banner()).toBeNull()
  })
})

describe("T-COOKIE-05 / T-COOKIE-06: exactly one click is sufficient", () => {
  it("requires no second click and never re-shows the banner", async () => {
    render(<CookieConsent />)
    await expectBannerVisible()

    expect(screen.getAllByRole("button", { name: "Accept All" })).toHaveLength(1)

    fireEvent.click(screen.getByRole("button", { name: "Accept All" }))

    expect(banner()).toBeNull()

    await sleep(1500)
    expect(banner()).toBeNull()
    expect(acceptButton()).toBeNull()
    expect(storedConsent()?.accepted).toBe(true)
  })

  it("mounts the cookie banner component exactly once across the app", () => {
    const srcRoot = path.join(__dirname, "..")
    const walk = (dir: string): string[] =>
      fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) return walk(full)
        return /\.(ts|tsx)$/.test(entry.name) && !/\.test\.(ts|tsx)$/.test(entry.name) ? [full] : []
      })

    const mounts = walk(srcRoot)
      .filter((file) => fs.readFileSync(file, "utf8").includes("<CookieConsent"))
      .map((file) => path.relative(srcRoot, file))

    expect(mounts).toEqual([path.join("components", "layout", "client-layout.tsx")])
  })
})

describe("T-COOKIE-07: consent semantics are unchanged", () => {
  it("keeps the banner copy and the Privacy / Cookie Policy links", async () => {
    render(<CookieConsent />)
    await expectBannerVisible()

    expect(
      screen.getByText(/We use essential cookies for site functionality\./)
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute("href", "/privacy")
    expect(screen.getByRole("link", { name: "Cookie Policy" })).toHaveAttribute("href", "/cookies")
  })

  it("grants every consent category on Accept All", async () => {
    render(<CookieConsent />)
    await expectBannerVisible()

    fireEvent.click(screen.getByRole("button", { name: "Accept All" }))

    expect(storedConsent()).toEqual({
      accepted: true,
      prefs: { analytics: true, advertising: true },
    })
    expect(gtagMock).toHaveBeenCalledWith("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    })
  })

  it("denies every consent category on Reject All and hides the banner in one click", async () => {
    render(<CookieConsent />)
    await expectBannerVisible()

    fireEvent.click(screen.getByRole("button", { name: "Reject All" }))

    expect(banner()).toBeNull()
    expect(storedConsent()).toEqual({
      accepted: false,
      prefs: { analytics: false, advertising: false },
    })
    expect(gtagMock).toHaveBeenCalledWith("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    })
  })

  it("persists only the categories enabled through Customize", async () => {
    render(<CookieConsent />)
    await expectBannerVisible()

    fireEvent.click(screen.getByRole("button", { name: "Customize" }))
    fireEvent.click(screen.getByRole("checkbox", { name: /Analytics/ }))
    fireEvent.click(screen.getByRole("button", { name: "Save Preferences" }))

    expect(banner()).toBeNull()
    expect(storedConsent()).toEqual({
      accepted: true,
      prefs: { analytics: true, advertising: false },
    })
  })
})

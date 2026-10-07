import { test, expect } from "@playwright/test"

const LAYER = "M32 8 58 13 32 18 6 13Z"

test.describe("BRAND-01 lockup and chrome", () => {
  test("header renders the vector logo as a home link", async ({ page }) => {
    await page.goto("/")
    const home = page.locator("header a[href='/']").first()
    await expect(home).toBeVisible()
    await expect(home).toHaveAccessibleName(/PilotStack/)
    await expect(home.locator("svg path")).toHaveCount(3)
    await expect(home).toContainText("PilotStack")
    await expect(page.locator("header img")).toHaveCount(0)
  })

  test("header does not overflow the narrowest supported viewport", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 })
    for (const path of ["/", "/reviews", "/brand-assets", "/press"]) {
      await page.goto(path)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      expect(overflow, `${path} overflows at 320px`).toBeLessThanOrEqual(1)
    }
  })

  test("footer carries the full lockup", async ({ page }) => {
    await page.goto("/")
    const footerLogo = page.locator("footer a[href='/']").first()
    await expect(footerLogo).toContainText("PilotStack")
    await expect(footerLogo.locator("svg path")).toHaveCount(3)
  })

  test("404 keeps the branded symbol", async ({ page }) => {
    const response = await page.goto("/definitely-not-a-real-page-xyz")
    expect(response?.status()).toBe(404)
    await expect(page.locator('svg[aria-label="PilotStack"] path')).toHaveCount(3)
  })
})

test.describe("BRAND-01 favicon and brand assets", () => {
  test("favicon.svg ships the stacked layer mark", async ({ request }) => {
    const res = await request.get("/favicon.svg")
    expect(res.status()).toBe(200)
    expect(res.headers()["content-type"]).toContain("image/svg+xml")
    const body = await res.text()
    expect(body).toContain(LAYER)
    expect(body).not.toContain("circle")
  })

  test("logo-dark.svg is served for dark placements", async ({ request }) => {
    const res = await request.get("/logo-dark.svg")
    expect(res.status()).toBe(200)
    expect(await res.text()).toContain("PilotStack")
  })

  test("apple touch icon and og image resolve", async ({ request }) => {
    const apple = await request.get("/apple-touch-icon.png")
    expect(apple.status()).toBe(200)
    expect(apple.headers()["content-type"]).toContain("image/png")

    const og = await request.get("/og.svg")
    expect(og.status()).toBe(200)
    const ogBody = await og.text()
    expect(ogBody).toContain(">Pilot<")
    expect(ogBody).toContain(">Stack<")
    expect(ogBody).toContain('viewBox="0 0 1200 630"')
  })

  test("web manifest declares the brand primary as its theme colour", async ({ request }) => {
    const res = await request.get("/manifest.webmanifest")
    expect(res.status()).toBe(200)
    const manifest = await res.json()
    expect(manifest.theme_color).toBe("#2563EB")
    expect(manifest.name).toContain("PilotStack")
  })

  test("brand assets page previews the lockup and lists the palette", async ({ page }) => {
    await page.goto("/brand-assets")
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Brand Assets")
    await expect(page.getByText("#2563EB").first()).toBeVisible()
    await expect(page.getByText("Better tools. Smarter decisions.")).toBeVisible()
  })
})

test.describe("BRAND-01 theme tokens", () => {
  test("light mode uses the brand primary", async ({ page }) => {
    await page.goto("/")
    const primary = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--primary").trim())
    expect(primary.toLowerCase()).toBe("#2563eb")
  })

  test("dark mode switches the logo to its light-on-dark palette", async ({ page }) => {
    await page.goto("/")
    await page.evaluate(() => document.documentElement.classList.add("dark"))
    const state = await page.evaluate(() => {
      const home = document.querySelector("header a[href='/']")
      return {
        fills: home ? [...home.querySelectorAll("path")].map((p) => getComputedStyle(p).fill) : [],
        primary: getComputedStyle(document.documentElement).getPropertyValue("--primary").trim(),
      }
    })
    expect(state.primary.toLowerCase()).toBe("#3b82f6")
    expect(state.fills).toHaveLength(3)
    expect(state.fills[0]).toBe("rgb(59, 130, 246)")
  })
})

import { test, expect } from "@playwright/test"

test.describe("Core pages render successfully", () => {
  const pages = [
    { path: "/", title: "StackPilot" },
    { path: "/reviews", title: "Reviews" },
    { path: "/reviews/notion", title: "Notion Review" },
    { path: "/comparisons", title: "Comparisons" },
    { path: "/comparisons/notion-vs-linear", title: "Notion vs Linear" },
    { path: "/guides", title: "Guides" },
    { path: "/guides/how-to-choose-project-management-software", title: "How to Choose" },
    { path: "/blog", title: "Blog" },
    { path: "/blog/ai-tools-2026-guide", title: "AI Tools in 2026" },
    { path: "/glossary", title: "Glossary" },
    { path: "/glossary/saas", title: "SaaS" },
    { path: "/tools", title: "Free Tools" },
    { path: "/tools/tco-calculator", title: "TCO Calculator" },
    { path: "/about", title: "About" },
    { path: "/contact", title: "Contact" },
    { path: "/category/ai-ml", title: "AI & Machine Learning" },
  ]

  for (const { path, title } of pages) {
    test(`GET ${path} renders successfully`, async ({ page }) => {
      const response = await page.goto(path)
      expect(response?.status()).toBe(200)
      await expect(page).toHaveTitle(new RegExp(title, "i"))
    })
  }
})

test.describe("Accessibility checks", () => {
  test("skip-to-content link is present and focusable", async ({ page }) => {
    await page.goto("/")
    const skipLink = page.locator(".skip-to-content")
    await expect(skipLink).toBeVisible()
    await expect(skipLink).toHaveAttribute("href", "#main-content")
  })

  test("all images have alt text", async ({ page }) => {
    await page.goto("/")
    const images = page.locator("img")
    const count = await images.count()
    for (let i = 0; i < count; i++) {
      await expect(images.nth(i)).toHaveAttribute("alt", /.*/)
    }
  })

  test("navigation has correct ARIA attributes", async ({ page }) => {
    await page.goto("/")
    const nav = page.locator("nav")
    await expect(nav.first()).toHaveAttribute("aria-label")
  })
})

test.describe("SEO checks", () => {
  test("sitemap.xml is accessible", async ({ page }) => {
    const response = await page.goto("/sitemap.xml")
    expect(response?.status()).toBe(200)
  })

  test("robots.txt is accessible", async ({ page }) => {
    const response = await page.goto("/robots.txt")
    expect(response?.status()).toBe(200)
  })

  test("RSS feed is accessible", async ({ page }) => {
    const response = await page.goto("/rss.xml")
    expect(response?.status()).toBe(200)
  })
})

test.describe("Form functionality", () => {
  test("newsletter form has required fields", async ({ page }) => {
    await page.goto("/")
    const emailInput = page.locator("input[type='email']").first()
    await expect(emailInput).toHaveAttribute("required")
  })
})

test.describe("404 handling", () => {
  test("unknown page returns 404", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist")
    expect(response?.status()).toBe(404)
  })
})

test.describe("Navigation", () => {
  test("all nav links are reachable", async ({ page }) => {
    await page.goto("/")
    const navLinks = page.locator("nav a")
    const count = await navLinks.count()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < Math.min(count, 6); i++) {
      const href = await navLinks.nth(i).getAttribute("href")
      if (href && !href.startsWith("#")) {
        const response = await page.goto(href)
        expect(response?.status()).toBe(200)
      }
    }
  })
})

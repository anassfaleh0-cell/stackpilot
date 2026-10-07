import { test, expect, Page } from "@playwright/test"

async function gotoHome(page: Page) {
  await page.goto("/")
  await page.waitForTimeout(1000)
}

function desktopTrigger(page: Page, name: string) {
  return page.getByRole("button", { name, exact: true })
}

async function desktopPanel(page: Page, name: string) {
  const id = await desktopTrigger(page, name).getAttribute("aria-controls")
  expect(id).toBeTruthy()
  return page.locator(`[id="${id}"]`)
}

test.describe("Desktop navigation", () => {
  test("hovering Compare Tools opens its submenu with the three children", async ({ page }) => {
    await gotoHome(page)
    const trigger = desktopTrigger(page, "Compare Tools")
    const panel = await desktopPanel(page, "Compare Tools")
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    await expect(panel).toBeHidden()

    await trigger.hover()
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await expect(panel).toBeVisible()
    await expect(panel.getByRole("link", { name: "Comparisons" })).toHaveAttribute("href", "/comparisons")
    await expect(panel.getByRole("link", { name: "Best Software" })).toHaveAttribute("href", "/best")
    await expect(panel.getByRole("link", { name: "Alternatives" })).toHaveAttribute("href", "/alternatives")
  })

  test("stepped pointer transit from trigger to submenu keeps it open (flicker regression)", async ({ page }) => {
    await gotoHome(page)
    const trigger = desktopTrigger(page, "Compare Tools")
    const panel = await desktopPanel(page, "Compare Tools")
    await trigger.hover()
    await expect(panel).toBeVisible()
    const box = await trigger.boundingBox()
    const firstChild = panel.getByRole("link", { name: "Comparisons" })
    const childBox = await firstChild.boundingBox()
    expect(box).not.toBeNull()
    expect(childBox).not.toBeNull()

    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)
    await expect(panel).toBeVisible()
    await page.mouse.move(childBox!.x + childBox!.width / 2, childBox!.y + childBox!.height / 2, { steps: 10 })
    await expect(panel).toBeVisible()
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await expect(firstChild).toBeVisible()
  })

  test("clicking a submenu destination navigates exactly once and closes the menu", async ({ page }) => {
    await gotoHome(page)
    let navigations = 0
    page.on("framenavigated", (frame) => {
      if (frame === page.mainFrame()) navigations++
    })

    const trigger = desktopTrigger(page, "Compare Tools")
    await trigger.hover()
    const panel = await desktopPanel(page, "Compare Tools")
    await panel.getByRole("link", { name: "Comparisons" }).click()
    await page.waitForURL("**/comparisons")
    await expect(page).toHaveURL(/\/comparisons$/)
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    expect(navigations).toBe(1)
  })

  test("Best Software and Alternatives destinations work", async ({ page }) => {
    await gotoHome(page)
    await desktopTrigger(page, "Compare Tools").hover()
    let panel = await desktopPanel(page, "Compare Tools")
    await panel.getByRole("link", { name: "Best Software" }).click()
    await page.waitForURL("**/best")
    await expect(page).toHaveURL(/\/best$/)

    await gotoHome(page)
    await desktopTrigger(page, "Compare Tools").hover()
    panel = await desktopPanel(page, "Compare Tools")
    await panel.getByRole("link", { name: "Alternatives" }).click()
    await page.waitForURL("**/alternatives")
    await expect(page).toHaveURL(/\/alternatives$/)
  })

  test("Find by Need and Guides & Research open; Reviews is a direct link; no duplicate nav", async ({ page }) => {
    await gotoHome(page)
    await desktopTrigger(page, "Find by Need").hover()
    const needPanel = await desktopPanel(page, "Find by Need")
    await expect(needPanel).toBeVisible()
    await expect(needPanel.getByRole("link", { name: "Use Cases" })).toHaveAttribute("href", "/use-cases")

    await desktopTrigger(page, "Guides & Research").hover()
    await expect(desktopTrigger(page, "Find by Need")).toHaveAttribute("aria-expanded", "false")
    const guidesPanel = await desktopPanel(page, "Guides & Research")
    await expect(guidesPanel).toBeVisible()
    await expect(guidesPanel.getByRole("link", { name: "Guides" })).toHaveAttribute("href", "/guides")
    await expect(guidesPanel.getByRole("link", { name: "Research" })).toHaveAttribute("href", "/blog")

    await expect(page.getByLabel("Main navigation").getByRole("link", { name: "Reviews", exact: true })).toHaveAttribute(
      "href",
      "/reviews"
    )
    await expect(page.getByRole("button", { name: "Reviews", exact: true })).toHaveCount(0)
    await expect(page.locator('nav[aria-label="Main navigation"]')).toHaveCount(1)
  })

  test("pointer click while open does not toggle the menu shut", async ({ page }) => {
    await gotoHome(page)
    const trigger = desktopTrigger(page, "Compare Tools")
    await trigger.hover()
    const panel = await desktopPanel(page, "Compare Tools")
    await expect(panel).toBeVisible()
    await trigger.click()
    await expect(panel).toBeVisible()
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await trigger.click()
    await expect(panel).toBeVisible()
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
  })

  test("mousedown outside closes the submenu", async ({ page }) => {
    await gotoHome(page)
    await desktopTrigger(page, "Compare Tools").hover()
    const panel = await desktopPanel(page, "Compare Tools")
    await expect(panel).toBeVisible()
    await page.mouse.click(64, 500)
    await expect(panel).toBeHidden()
    await expect(desktopTrigger(page, "Compare Tools")).toHaveAttribute("aria-expanded", "false")
  })

  test("keyboard: Enter opens, Tab reaches submenu items, Escape closes and refocuses the trigger", async ({ page }) => {
    await gotoHome(page)
    const trigger = desktopTrigger(page, "Compare Tools")
    const panel = await desktopPanel(page, "Compare Tools")
    await trigger.focus()
    await page.keyboard.press("Enter")
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await expect(panel).toBeVisible()

    const panelId = await trigger.getAttribute("aria-controls")
    expect(await page.locator(`[id="${panelId}"]`).count()).toBe(1)

    await page.keyboard.press("Tab")
    const first = panel.getByRole("link", { name: "Comparisons" })
    await expect(first).toBeFocused()
    await expect(panel).toBeVisible()

    await page.keyboard.press("Escape")
    await expect(panel).toBeHidden()
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    await expect(trigger).toBeFocused()
  })

  test("hovering a different item closes the previous submenu", async ({ page }) => {
    await gotoHome(page)
    await desktopTrigger(page, "Compare Tools").hover()
    await expect(await desktopPanel(page, "Compare Tools")).toBeVisible()
    await desktopTrigger(page, "Find by Need").hover()
    await expect(await desktopPanel(page, "Compare Tools")).toBeHidden()
    await expect(desktopTrigger(page, "Compare Tools")).toHaveAttribute("aria-expanded", "false")
    await expect(await desktopPanel(page, "Find by Need")).toBeVisible()
  })

  test("hovering away closes the submenu after the grace period", async ({ page }) => {
    await gotoHome(page)
    await desktopTrigger(page, "Compare Tools").hover()
    const panel = await desktopPanel(page, "Compare Tools")
    await expect(panel).toBeVisible()
    await page.mouse.move(640, 600)
    await expect(panel).toBeHidden({ timeout: 2000 })
    await expect(desktopTrigger(page, "Compare Tools")).toHaveAttribute("aria-expanded", "false")
  })
})

test.describe("Mobile navigation", () => {
  test.use({ viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true })

  test("desktop nav is hidden; burger opens and closes the menu", async ({ page }) => {
    await gotoHome(page)
    await expect(page.locator('nav[aria-label="Main navigation"]')).toBeHidden()

    const burger = page.locator('button[aria-controls="mobile-menu"]')
    await expect(burger).toBeVisible()
    await expect(burger).toHaveAttribute("aria-label", "Open menu")
    await burger.tap()
    const menu = page.locator("#mobile-menu")
    await expect(burger).toHaveAttribute("aria-label", "Close menu")
    await expect(menu).toHaveAttribute("aria-hidden", "false")
    await expect(menu).toBeVisible()
    await expect(burger).toHaveAttribute("aria-expanded", "true")

    await page.getByRole("button", { name: "Close menu" }).tap()
    await expect(menu).toHaveAttribute("aria-hidden", "true")
    await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible()
  })

  test("backdrop covers the area below the menu so an outside tap closes it (root-cause guard)", async ({ page }) => {
    await gotoHome(page)
    await page.getByRole("button", { name: "Open menu" }).tap()
    const menu = page.locator("#mobile-menu")
    await expect(menu).toBeVisible()

    const hit = await page.evaluate(() => {
      const el = document.elementFromPoint(5, 400)
      if (!el) return null
      return { cls: el.getAttribute("class") ?? "", ariaHidden: el.getAttribute("aria-hidden") }
    })
    expect(hit).not.toBeNull()
    expect(hit!.cls).toContain("absolute inset-x-0")
    expect(hit!.cls).toContain("h-screen")
    expect(hit!.ariaHidden).toBe("true")

    await page.touchscreen.tap(187, 20)
    await expect(menu).toHaveAttribute("aria-hidden", "true")
    await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible()
  })

  test("Escape closes the open menu", async ({ page }) => {
    await gotoHome(page)
    await page.getByRole("button", { name: "Open menu" }).tap()
    const menu = page.locator("#mobile-menu")
    await expect(menu).toHaveAttribute("aria-hidden", "false")
    await page.keyboard.press("Escape")
    await expect(menu).toHaveAttribute("aria-hidden", "true")
    await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible()
  })

  test("tapping a submenu link navigates exactly once and the menu closes", async ({ page }) => {
    await gotoHome(page)
    await page.getByRole("button", { name: "Open menu" }).tap()
    const menu = page.locator("#mobile-menu")
    await expect(menu).toBeVisible()

    let navigations = 0
    page.on("framenavigated", (frame) => {
      if (frame === page.mainFrame()) navigations++
    })

    await menu.getByRole("link", { name: "Comparisons", exact: true }).tap()
    await page.waitForURL("**/comparisons")
    await expect(page).toHaveURL(/\/comparisons$/)
    await expect(menu).toHaveAttribute("aria-hidden", "true")
    await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible()
    expect(navigations).toBe(1)
  })

  test("menu shows all top-level destinations and exactly one mobile menu instance", async ({ page }) => {
    await gotoHome(page)
    await page.getByRole("button", { name: "Open menu" }).tap()
    const menu = page.locator("#mobile-menu")
    await expect(menu.getByText("Compare Tools", { exact: true })).toBeVisible()
    await expect(menu.getByText("Find by Need", { exact: true })).toBeVisible()
    await expect(menu.getByText("Guides & Research", { exact: true })).toBeVisible()
    await expect(menu.getByRole("link", { name: "Reviews", exact: true })).toBeVisible()
    await expect(page.locator("#mobile-menu")).toHaveCount(1)
  })
})

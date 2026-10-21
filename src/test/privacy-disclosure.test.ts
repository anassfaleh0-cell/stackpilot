import { describe, expect, it } from "vitest"
import fs from "node:fs"
import path from "node:path"

const root = path.join(process.cwd(), "src", "app")

describe("privacy and cookie disclosures", () => {
  it("documents analytics and tag-management integrations used by the consent layer", () => {
    const privacy = fs.readFileSync(path.join(root, "privacy", "page.tsx"), "utf8")
    const cookies = fs.readFileSync(path.join(root, "cookies", "page.tsx"), "utf8")
    const consent = fs.readFileSync(path.join(process.cwd(), "src", "components", "analytics", "cookie-consent.tsx"), "utf8")

    for (const integration of ["Google Analytics", "Microsoft Clarity", "Google Tag Manager", "Google AdSense"]) {
      expect(privacy, `privacy policy should disclose ${integration}`).toContain(integration)
      expect(cookies, `cookie policy should disclose ${integration}`).toContain(integration)
    }

    expect(consent).toContain("injectClarityScript()")
    expect(consent).toContain("injectGAScript()")
    expect(consent).toContain("injectAdSenseScript()")
    expect(consent).toContain("injectGTMScript()")
    expect(consent).toContain("prefs.analytics && prefs.advertising")
  })

  it("does not describe all analytics data as anonymous without qualification", () => {
    const privacy = fs.readFileSync(path.join(root, "privacy", "page.tsx"), "utf8")
    const cookies = fs.readFileSync(path.join(root, "cookies", "page.tsx"), "utf8")
    expect(privacy).not.toContain("These are anonymized and do not identify individual visitors.")
    expect(privacy).toContain("sale or sharing")
    expect(privacy).toContain("turn off advertising consent")
    expect(cookies).toContain("Last updated: October 14, 2026")
    expect(cookies).not.toContain("Collects anonymized page views")
    expect(cookies).toContain("we do not promise that every event or identifier is anonymous")

    const about = fs.readFileSync(path.join(root, "about", "page.tsx"), "utf8")
    const editorial = fs.readFileSync(path.join(root, "editorial-policy", "page.tsx"), "utf8")
    const advertising = fs.readFileSync(path.join(root, "advertising-disclosure", "page.tsx"), "utf8")

    expect(about).toContain("independently operated")
    expect(about).toContain("Some older numeric scores and review-count figures are still undergoing a source audit")
    expect(editorial).toContain("Some older records remain under source audit")
    expect(editorial).not.toContain("Every published figure traces to a source we hold")
    expect(advertising).toContain("Last updated: October 14, 2026")
    expect(advertising).not.toContain("The editorial team does not participate in advertising sales")
  })
})

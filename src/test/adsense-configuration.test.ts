import { describe, it, expect } from "vitest"
import fs from "node:fs"
import path from "node:path"

function read(relativePath: string): string {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8")
}

describe("AdSense configuration consistency", () => {
  it("keeps ads.txt, the account meta tag, and the ad component on the same publisher ID", () => {
    const adsTxt = read("public/ads.txt")
    const layout = read("src/app/layout.tsx")
    const adComponent = read("src/components/ads/AdSense.tsx")
    const publisherId = "ca-pub-6523926892521982"

    expect(adsTxt).toContain("google.com, pub-6523926892521982, DIRECT, f08c47fec0942fa0")
    expect(layout).toContain(`"google-adsense-account": "${publisherId}"`)
    expect(adComponent).toContain(`const AD_CLIENT = "${publisherId}"`)
  })

  it("loads the AdSense script only when advertising consent is granted", () => {
    const consent = read("src/components/analytics/cookie-consent.tsx")
    expect(consent).toMatch(/if\s*\(prefs\.advertising\)\s*\{\s*injectAdSenseScript\(\)/)
    expect(consent).toContain('ad_storage: prefs.advertising ? "granted" : "denied"')
    expect(consent).toContain('ad_user_data: prefs.advertising ? "granted" : "denied"')
    expect(consent).toContain('ad_personalization: prefs.advertising ? "granted" : "denied"')
  })
})

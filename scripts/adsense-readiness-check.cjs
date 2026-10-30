#!/usr/bin/env node
/**
 * Source-level AdSense prerequisites for PilotStack.
 * Checks code ownership signals, publisher disclosures and crawl guidance.
 * Does NOT claim live-site accessibility or Google AdSense approval.
 */
const fs = require("node:fs")
const path = require("node:path")
const root = path.resolve(__dirname, "..")
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8")
const results = []
function check(id, condition, explanation) {
  results.push({ id, status: condition ? "pass" : "fail", explanation })
}
const layout = read("src/app/layout.tsx")
const robots = read("src/app/robots.ts")
const ads = read("public/ads.txt")
const site = read("src/lib/constants.ts")
const team = read("src/app/team/page.tsx")
const about = read("src/app/about/page.tsx")
const footer = read("src/components/layout/footer.tsx")
const cookie = read("src/components/analytics/cookie-consent.tsx")
const policyPages = ["privacy", "terms", "contact", "editorial-policy",
  "affiliate-disclosure", "advertising-disclosure", "methodology"]
check("adsense_owner", /google-adsense-account/.test(layout) && /ca-pub-6523926892521982/.test(layout),
  "Page metadata declares the AdSense publisher account.")
check("ads_txt", /^google\.com,\s*pub-6523926892521982,\s*DIRECT,\s*f08c47fec0942fa0\s*$/m.test(ads),
  "Public ads.txt contains the expected publisher line.")
check("canonical_host", /https:\/\/pilotstack\.online/.test(site) &&
  !/url:\s*["']https:\/\/www\.pilotstack\.online/.test(site),
  "Site metadata uses the canonical non-www host.")
check("crawler_access", /userAgent:\s*"Mediapartners-Google"/.test(robots) &&
  /allow:\s*"\/"/.test(robots) && /sitemap\.xml/.test(robots),
  "Google AdSense crawler and sitemap are allowed in source robots rules.")
check("legal_and_contact_routes", policyPages.every((page) =>
  fs.existsSync(path.join(root, "src/app", page, "page.tsx"))),
  "Essential trust, contact and legal routes exist in source.")
check("contact_email", /contact@pilotstack\.online/.test(read("src/app/contact/page.tsx")) &&
  /contact@pilotstack\.online/.test(about),
  "An active domain contact address is shown in contact and about pages.")
check("publisher_transparency", /publisher byline/i.test(team) &&
  !/hands.on testing for a minimum of two weeks/i.test(team) &&
  /provisional/i.test(about) && /verified only/i.test(read("src/app/methodology/page.tsx")),
  "Publisher byline and provisional-score limitations are disclosed, without invented tests.")
check("privacy_link", /\/privacy/.test(footer) &&
  /\/affiliate-disclosure/.test(footer) && /\/editorial-policy/.test(footer),
  "Visitors can find privacy, affiliate and editorial disclosures from navigation.")
check("consent_gate", /function injectAdSenseScript/.test(cookie) &&
  /if \(prefs\.advertising\)/.test(cookie) &&
  /ad_storage:\s*prefs\.advertising/.test(cookie),
  "Source delays the advertising script until the visitor permits advertising.")
check("no_sitemap_press_overhead",
  !/sitemapRoute\(/.test(read("src/app/press/page.tsx")) &&
  !/sitemapRoute\(/.test(read("src/app/media-kit/page.tsx")),
  "Press and Media Kit do not expand all sitemap pages for decorative counts.")
for (const result of results) {
  console.log("[" + result.status.toUpperCase() + "] " + result.id + " — " + result.explanation)
}
console.log()
console.log("Manual verification still required:")
console.log("- Public HTTP 200 for homepage, robots.txt, ads.txt, legal pages and representative article URLs.")
console.log("- Latest Cloudflare production deployment contains these commits and site is navigable on mobile.")
console.log("- Site status in the publisher's AdSense > Sites account (only Google can approve).")
console.log("- Configure a Google-certified TCF CMP in AdSense Privacy & messaging for EEA/UK/Swiss ad traffic before personalized ads.")
console.log("- Resolve evidence-backed content findings and Google Search Console crawl/index issues.")
const failed = results.filter((r) => r.status === "fail")
if (failed.length) {
  console.error(failed.length + " source-level AdSense prerequisite(s) failed.")
  process.exitCode = 1
}

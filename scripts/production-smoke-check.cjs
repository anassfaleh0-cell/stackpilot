#!/usr/bin/env node

const SITE_URL = (process.env.SITE_URL || "https://pilotstack.online").replace(/\/+$/, "")
const PUBLISHER_ID = "6523926892521982"
const ADS_RECORD = "google.com, pub-" + PUBLISHER_ID + ", DIRECT, f08c47fec0942fa0"

function report(name, ok, detail) {
  console.log((ok ? "PASS" : "FAIL") + " " + name + ": " + detail)
  if (!ok) process.exitCode = 1
}

async function fetchText(pathname) {
  const url = SITE_URL + pathname
  const response = await fetch(url, {
    redirect: "follow",
    headers: { "user-agent": "PilotStack-ProductionSmokeCheck/1.0" },
    signal: AbortSignal.timeout(15000),
  })
  const body = await response.text()
  return { url, finalUrl: response.url, status: response.status, contentType: response.headers.get("content-type") || "", body }
}

async function main() {
  const paths = ["/", "/ads.txt", "/robots.txt", "/sitemap.xml"]
  const results = await Promise.all(paths.map(async (pathname) => {
    try {
      const result = await fetchText(pathname)
      report(pathname, result.status >= 200 && result.status < 300, "HTTP " + result.status + " (" + result.finalUrl + ")")
      return { pathname, ...result }
    } catch (error) {
      report(pathname, false, error instanceof Error ? error.message : String(error))
      return { pathname, error }
    }
  }))

  const byPath = new Map(results.map((result) => [result.pathname, result]))
  const home = byPath.get("/")
  const ads = byPath.get("/ads.txt")
  const robots = byPath.get("/robots.txt")
  const sitemap = byPath.get("/sitemap.xml")

  if (home && !home.error) {
    report("AdSense publisher meta", home.body.includes("ca-pub-" + PUBLISHER_ID), "homepage must advertise the same publisher ID as ads.txt")
  }
  if (ads && !ads.error) {
    report("AdSense ads.txt record", ads.body.split(/\r?\n/).some((line) => line.trim() === ADS_RECORD), "expected publisher record present")
    report("ads.txt content type", /text\/plain/i.test(ads.contentType), ads.contentType || "missing content-type")
  }
  if (robots && !robots.error) {
    report("robots sitemap directive", robots.body.includes(SITE_URL + "/sitemap.xml"), "sitemap URL present")
    for (const privatePath of ["/api/", "/admin/", "/dashboard", "/search"]) {
      report("robots exclusion " + privatePath, robots.body.includes(privatePath), "private/internal path exclusion present")
    }
  }
  if (sitemap && !sitemap.error) {
    report("sitemap XML", /<(?:urlset|sitemapindex)\b/i.test(sitemap.body), "valid sitemap root marker present")
    report("sitemap same-origin URLs", sitemap.body.includes(SITE_URL), "canonical site origin present")
    report("sitemap non-empty", (sitemap.body.match(/<loc>/gi) || []).length > 0, "at least one location entry present")
  }

  if (process.exitCode === 1) {
    console.error("Production endpoint smoke check found failures. This is diagnostic and does not automatically change site configuration.")
  } else {
    console.log("Production endpoint smoke check passed.")
  }
}

main().catch((error) => {
  console.error("Production endpoint smoke check crashed:", error instanceof Error ? error.message : String(error))
  process.exitCode = 1
})

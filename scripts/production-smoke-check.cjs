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
    const hasRoot = /<(?:urlset|sitemapindex)\b/i.test(sitemap.body)
    report("sitemap XML", hasRoot, "valid sitemap root marker present")

    const locValues = [...sitemap.body.matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/gi)]
      .map((match) => match[1].replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim())
      .filter(Boolean)
    report("sitemap non-empty", locValues.length > 0, "at least one location entry present")

    const expectedOrigin = new URL(SITE_URL).origin
    const invalidLocs = []
    const offOriginLocs = []
    const queryOrHashLocs = []
    for (const value of locValues) {
      try {
        const parsed = new URL(value)
        if (parsed.origin !== expectedOrigin) offOriginLocs.push(value)
        if (parsed.search || parsed.hash) queryOrHashLocs.push(value)
      } catch {
        invalidLocs.push(value)
      }
    }
    report("sitemap absolute URLs", invalidLocs.length === 0, invalidLocs.length ? "invalid <loc> values: " + JSON.stringify(invalidLocs.slice(0, 5)) : "all <loc> values are valid absolute URLs")
    report("sitemap same-origin URLs", offOriginLocs.length === 0, offOriginLocs.length ? "off-origin URLs: " + JSON.stringify(offOriginLocs.slice(0, 5)) : "all URLs use " + expectedOrigin)
    report("sitemap canonical URL shape", queryOrHashLocs.length === 0, queryOrHashLocs.length ? "query/hash URLs found: " + JSON.stringify(queryOrHashLocs.slice(0, 5)) : "no query strings or fragments in sitemap locations")

    const normalizedLocs = locValues.map((value) => {
      try {
        const parsed = new URL(value)
        parsed.hash = ""
        return parsed.href
      } catch {
        return value
      }
    })
    const seenLocs = new Set()
    const duplicates = []
    for (const value of normalizedLocs) {
      if (seenLocs.has(value)) duplicates.push(value)
      seenLocs.add(value)
    }
    report("sitemap duplicate URLs", duplicates.length === 0, duplicates.length ? "duplicate locations: " + JSON.stringify([...new Set(duplicates)].slice(0, 5)) : "no duplicate <loc> entries detected")
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

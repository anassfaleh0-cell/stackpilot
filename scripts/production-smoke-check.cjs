#!/usr/bin/env node

const SITE_URL = (process.env.SITE_URL || "https://pilotstack.online").replace(/\/+$/, "")
const PUBLISHER_ID = "6523926892521982"
const ADS_RECORD = "google.com, pub-" + PUBLISHER_ID + ", DIRECT, f08c47fec0942fa0"

function report(name, ok, detail) {
  console.log((ok ? "PASS" : "FAIL") + " " + name + ": " + detail)
  if (!ok) process.exitCode = 1
}

async function fetchWithRetry(url, options, attempts = 4) {
  let lastResponse
  for (let attempt = 1; attempt <= attempts; attempt++) {
    lastResponse = await fetch(url, options)
    if (lastResponse.status !== 429 && lastResponse.status < 500) return lastResponse
    if (attempt < attempts) {
      await lastResponse.body?.cancel()
      await new Promise((resolve) => setTimeout(resolve, attempt * 1500))
    }
  }
  return lastResponse
}

async function fetchText(pathname) {
  const parsedUrl = new URL(SITE_URL + pathname)
  parsedUrl.searchParams.set("__content_check", process.env.GITHUB_SHA || String(Date.now()))
  const url = parsedUrl.toString()
  const response = await fetchWithRetry(url, {
    redirect: "follow",
    headers: { "user-agent": "PilotStack-ProductionSmokeCheck/1.0" },
    signal: AbortSignal.timeout(15000),
  })
  const body = await response.text()
  return { url, finalUrl: response.url, status: response.status, contentType: response.headers.get("content-type") || "", body }
}

async function main() {
  const paths = ["/", "/ads.txt", "/robots.txt", "/sitemap.xml", "/contact", "/reviews/linear", "/statistics/dataprivacy-software"]
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
  const contact = byPath.get("/contact")
  const linear = byPath.get("/reviews/linear")
  const statistics = byPath.get("/statistics/dataprivacy-software")

  if (contact && !contact.error) {
    const emailOnly = contact.body.includes("contact@pilotstack.online") &&
      !/Official Community|Facebook|LinkedIn|Pinterest|Newsletter sign-up is temporarily unavailable|YouTube Reviews|Follow PilotStack/i.test(contact.body)
    report("email-only contact page", emailOnly, "contact email is present; obsolete social/newsletter placeholders are absent")
  }
  if (linear && !linear.error) {
    const noUnsupportedFaq = !/Yes, Linear offers deep GitHub integration|What platforms does Linear support\?/i.test(linear.body)
    const honestScoring = linear.body.includes("An aggregate score is shown only when the underlying category ratings and calculation can be verified") &&
      !linear.body.includes("The displayed overall score is calculated from the recorded category ratings")
    report("review capability claims", noUnsupportedFaq, "unverified integration/platform FAQs are not rendered")
    report("review scoring disclosure", honestScoring, "unverified aggregate-score claims are not rendered")
  }
  if (statistics && !statistics.error) {
    const noUnsourcedNarrativeFigures = !/\$50B\+|26%|4,874\+|27,500 products|8M-professional base/i.test(statistics.body)
    report("statistics narrative provenance", noUnsourcedNarrativeFigures, "unaudited narrative figures are withheld from rendered statistics pages")
  }

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

    // Optional production crawl: CHECK_SITEMAP_URLS=1 fetches every same-origin
    // sitemap target with bounded concurrency and reports stale 404/5xx routes.
    // Keep this opt-in so ordinary smoke checks do not issue thousands of requests.
    if (process.env.CHECK_SITEMAP_URLS === "1") {
      const targets = [...new Set(locValues)].filter((value) => {
        try { return new URL(value).origin === expectedOrigin } catch { return false }
      })
      const failures = []
      let cursor = 0
      const concurrency = Math.min(4, targets.length)
      await Promise.all(Array.from({ length: concurrency }, async () => {
        while (cursor < targets.length) {
          const index = cursor++
          const target = targets[index]
          try {
            const response = await fetchWithRetry(target, {
              redirect: "follow",
              headers: { "user-agent": "PilotStack-SitemapTargetAudit/1.0" },
              signal: AbortSignal.timeout(15000),
            })
            if (response.status >= 400) {
              failures.push({ url: target, status: response.status, finalUrl: response.url })
            }
            await response.body?.cancel()
          } catch (error) {
            failures.push({ url: target, status: "FETCH_ERROR", detail: error instanceof Error ? error.message : String(error) })
          }
        }
      }))
      report(
        "sitemap target HTTP status",
        failures.length === 0,
        failures.length
          ? targets.length + " URLs checked; failing URLs: " + JSON.stringify(failures.slice(0, 25))
          : targets.length + " same-origin URLs returned no 4xx/5xx response"
      )
    }
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

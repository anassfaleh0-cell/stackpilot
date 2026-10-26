#!/usr/bin/env node

const SITE_URL = (process.env.SITE_URL || "http://127.0.0.1:3000").replace(/\/+$/, "")
const IS_LIVE_PRODUCTION = ["pilotstack.online", "www.pilotstack.online"].includes(new URL(SITE_URL).hostname)
if (IS_LIVE_PRODUCTION && process.env.ALLOW_LIVE_AUDIT !== "1") {
  console.error("Refusing production smoke checks without ALLOW_LIVE_AUDIT=1. Run against the local build or a preview URL.")
  process.exit(2)
}
const PUBLISHER_ID = "6523926892521982"
const ADS_RECORD = "google.com, pub-" + PUBLISHER_ID + ", DIRECT, f08c47fec0942fa0"

function report(name, ok, detail) {
  console.log((ok ? "PASS" : "FAIL") + " " + name + ": " + detail)
  if (!ok) process.exitCode = 1
}

async function fetchWithRetry(url, options, attempts = IS_LIVE_PRODUCTION ? 1 : 4) {
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
  // Cache-busting forces Next/OpenNext to render the route in the Worker. On the
  // free Workers plan that can exceed the 10 ms CPU limit; smoke-test canonical URLs.
  const url = new URL(SITE_URL + pathname).toString()
  const response = await fetchWithRetry(url, {
    redirect: "follow",
    headers: { "user-agent": "PilotStack-ProductionSmokeCheck/1.0" },
    signal: AbortSignal.timeout(15000),
  })
  const body = await response.text()
  return { url, finalUrl: response.url, status: response.status, contentType: response.headers.get("content-type") || "", body }
}

async function main() {
  const paths = ["/", "/ads.txt", "/robots.txt", "/sitemap.xml", "/contact", "/reviews/linear", "/statistics/dataprivacy-software", "/guides/how-to-choose-ai-writing-software", "/research/saas-pricing-benchmark-2026"]
  const results = []
  // Keep production probes sequential to avoid creating a burst of Worker invocations.
  for (const pathname of paths) {
    try {
      const result = await fetchText(pathname)
      report(pathname, result.status >= 200 && result.status < 300, "HTTP " + result.status + " (" + result.finalUrl + ")")
      results.push({ pathname, ...result })
    } catch (error) {
      report(pathname, false, error instanceof Error ? error.message : String(error))
      results.push({ pathname, error })
    }
    if (IS_LIVE_PRODUCTION) await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  const byPath = new Map(results.map((result) => [result.pathname, result]))

  // The Search Console export contains both www and apex URLs. Verify that the
  // legacy host consolidates to the configured canonical origin while preserving path/query.
  try {
    // Avoid adding a query string here: unique query parameters can bypass the
    // prerender cache and trigger CPU-heavy Worker rendering on the free plan.
    const legacyUrl = "https://www.pilotstack.online/use-cases/best-seo-for-agencies"
    const legacyResponse = await fetchWithRetry(legacyUrl, {
      redirect: "follow",
      headers: { "user-agent": "PilotStack-ProductionSmokeCheck/1.0" },
      signal: AbortSignal.timeout(15000),
    })
    const finalUrl = new URL(legacyResponse.url)
    const canonicalOrigin = new URL("https://pilotstack.online").origin
    const hostConsolidated = finalUrl.origin === canonicalOrigin &&
      finalUrl.pathname === "/use-cases/best-seo-for-agencies"
    report("www host consolidation", hostConsolidated, "HTTP " + legacyResponse.status + " → " + finalUrl.href)
    await legacyResponse.body?.cancel()
  } catch (error) {
    report("www host consolidation", false, error instanceof Error ? error.message : String(error))
  }
  const home = byPath.get("/")
  const ads = byPath.get("/ads.txt")
  const robots = byPath.get("/robots.txt")
  const sitemap = byPath.get("/sitemap.xml")
  const contact = byPath.get("/contact")
  const linear = byPath.get("/reviews/linear")
  const statistics = byPath.get("/statistics/dataprivacy-software")
  const aiWritingGuide = byPath.get("/guides/how-to-choose-ai-writing-software")
  const pricingResearch = byPath.get("/research/saas-pricing-benchmark-2026")

  if (contact && !contact.error) {
    // Scope this check to the page's main content. Shared navigation/footer links
    // can legitimately mention social channels without making them contact methods.
    const contactMain = contact.body.match(/<main\b[\s\S]*?<\/main>/i)?.[0] || contact.body
    const emailOnly = contactMain.includes("contact@pilotstack.online") &&
      !/Official Community|Facebook|LinkedIn|Pinterest|Newsletter sign-up is temporarily unavailable|YouTube Reviews|Follow PilotStack/i.test(contactMain)
    report("email-only contact page", emailOnly, "contact email is present; obsolete social/newsletter placeholders are absent")
  }
  if (linear && !linear.error) {
    const noUnsupportedFaq = !/Yes, Linear offers deep GitHub integration|What platforms does Linear support\?/i.test(linear.body)
    const hasReviewScorecard = linear.body.includes("Review Claim, Rating &amp; Verdict") &&
      linear.body.includes("Editorial Score")
    const normalizedLinearBody = linear.body.toLowerCase()
    const hasHonestScoreDisclosure =
      normalizedLinearBody.includes("stored score preserved for transparency; its evidence and calculation still need verification") ||
      normalizedLinearBody.includes("retained for transparency, but remains provisional") ||
      normalizedLinearBody.includes("no source-linked rationale or reproducible score breakdown recorded in this profile") ||
      normalizedLinearBody.includes("assessment not yet recorded; no number is invented") ||
      normalizedLinearBody.includes("pending evidence audit")
    const noUnsupportedAggregateClaim =
      !linear.body.includes("The displayed overall score is calculated from the recorded category ratings")
    const honestScoring = hasReviewScorecard && hasHonestScoreDisclosure && noUnsupportedAggregateClaim
    report("review capability claims", noUnsupportedFaq, "unverified integration/platform FAQs are not rendered")
    report("review scoring disclosure", honestScoring, "scorecard=" + hasReviewScorecard + ", accepted provenance disclosure=" + hasHonestScoreDisclosure + ", unsupported aggregate claim absent=" + noUnsupportedAggregateClaim)
  }
  if (aiWritingGuide && !aiWritingGuide.error) {
    const usefulGuide = aiWritingGuide.body.includes("Build a representative test set") &&
      aiWritingGuide.body.includes("Review privacy, ownership, and security terms") &&
      !/Something went wrong|landscape of content creation has been fundamentally transformed|\$20\/month \(Plus\)/i.test(aiWritingGuide.body)
    report("AI writing guide quality", usefulGuide, "decision framework is rendered and stale/generated claims are absent")
  }
  if (pricingResearch && !pricingResearch.error) {
    const transparentResearch = pricingResearch.body.includes("does not publish a verified market-wide average or median") &&
      !/median SaaS starting price is \$19\.99|51% of tools use a freemium model|Real Starting Prices Across 12 Software Categories/i.test(pricingResearch.body)
    report("SaaS pricing research provenance", transparentResearch, "unverified market-wide claims are absent and methodology caveat is visible")
  }

  if (statistics && !statistics.error) {
    const noUnsourcedNarrativeFigures = !/\$50B\+|26%|4,874\+|27,500 products|8M-professional base/i.test(statistics.body)
    report("statistics narrative provenance", noUnsourcedNarrativeFigures, "unaudited narrative figures are withheld from rendered statistics pages")
  }

  // Validate rendered canonical tags against the configured canonical origin.
  // HTTP 200 alone is insufficient when Google sees duplicate host/path variants.
  const canonicalTargets = [
    [home, "/"],
    [contact, "/contact"],
    [linear, "/reviews/linear"],
    [aiWritingGuide, "/guides/how-to-choose-ai-writing-software"],
    [pricingResearch, "/research/saas-pricing-benchmark-2026"],
  ]
  for (const [page, expectedPath] of canonicalTargets) {
    if (!page || page.error) continue
    const canonicalTag = [...page.body.matchAll(/<link\b[^>]*>/gi)]
      .map((match) => match[0])
      .find((tag) => /\brel=["']canonical["']/i.test(tag))
    const canonicalHref = canonicalTag?.match(/\bhref=["']([^"']+)["']/i)?.[1]
    let canonicalOk = false
    let canonicalDetail = "canonical link tag missing"
    if (canonicalHref) {
      try {
        const canonicalUrl = new URL(canonicalHref, SITE_URL)
        canonicalOk = canonicalUrl.origin === new URL(SITE_URL).origin &&
          canonicalUrl.pathname.replace(/\/$/, "") === expectedPath.replace(/\/$/, "") &&
          !canonicalUrl.search && !canonicalUrl.hash
        canonicalDetail = canonicalUrl.href
      } catch {
        canonicalDetail = "canonical href is not a valid URL: " + canonicalHref
      }
    }
    report("canonical " + expectedPath, canonicalOk, canonicalDetail)
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

    // Optional full production crawl. Resolve sitemap indexes recursively before
    // checking page URLs; otherwise a sitemap-index URLset would only test XML files.
    // This stays opt-in because the site has thousands of URLs.
    if (process.env.CHECK_SITEMAP_URLS === "1") {
      const parseLocs = (xml) => [...xml.matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/gi)]
        .map((match) => match[1].replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim())
        .filter(Boolean)
      const cleanUrl = (value) => {
        const parsed = new URL(value)
        parsed.searchParams.delete("__content_check")
        return parsed.href
      }
      const sitemapQueue = [{ url: cleanUrl(sitemap.finalUrl || SITE_URL + "/sitemap.xml"), body: sitemap.body }]
      const visitedSitemaps = new Set()
      const pageTargets = new Set()
      const sitemapFailures = []
      const maxSitemaps = 200
      const maxPages = 15000
      while (sitemapQueue.length > 0 && visitedSitemaps.size < maxSitemaps && pageTargets.size < maxPages) {
        const current = sitemapQueue.shift()
        if (!current || visitedSitemaps.has(current.url)) continue
        visitedSitemaps.add(current.url)
        let xml = current.body
        if (typeof xml !== "string") {
          try {
            const response = await fetchWithRetry(current.url, {
              redirect: "follow",
              headers: { "user-agent": "PilotStack-ProductionSmokeCheck/1.0" },
              signal: AbortSignal.timeout(15000),
            })
            if (!response.ok) {
              sitemapFailures.push({ url: current.url, status: response.status, type: "sitemap" })
              await response.body?.cancel()
              continue
            }
            xml = await response.text()
          } catch (error) {
            sitemapFailures.push({ url: current.url, status: "FETCH_ERROR", type: "sitemap", detail: error instanceof Error ? error.message : String(error) })
            continue
          }
        }
        const children = parseLocs(xml)
        if (/<sitemapindex\b/i.test(xml)) {
          for (const child of children) {
            try {
              const parsed = new URL(child)
              if (parsed.origin === expectedOrigin) sitemapQueue.push({ url: cleanUrl(child) })
            } catch {}
          }
        } else if (/<urlset\b/i.test(xml)) {
          for (const target of children) {
            if (pageTargets.size >= maxPages) break
            try {
              const parsed = new URL(target)
              if (parsed.origin === expectedOrigin) pageTargets.add(cleanUrl(target))
            } catch {}
          }
        } else {
          sitemapFailures.push({ url: current.url, status: "INVALID_SITEMAP_XML", type: "sitemap" })
        }
      }
      const targets = [...pageTargets]
      const pageFailures = []
      let cursor = 0
      const concurrency = Math.min(4, targets.length)
      await Promise.all(Array.from({ length: concurrency }, async () => {
        while (cursor < targets.length) {
          const target = targets[cursor++]
          try {
            const response = await fetchWithRetry(target, {
              redirect: "follow",
              headers: { "user-agent": "PilotStack-ProductionSmokeCheck/1.0" },
              signal: AbortSignal.timeout(15000),
            })
            if (response.status >= 400) pageFailures.push({ url: target, status: response.status, finalUrl: response.url })
            await response.body?.cancel()
          } catch (error) {
            pageFailures.push({ url: target, status: "FETCH_ERROR", detail: error instanceof Error ? error.message : String(error) })
          }
        }
      }))
      // A single 5xx can be a transient Worker/origin response or a stale edge-cached error.
      // Recheck only failed URLs with a cache-busting query before treating them as persistent failures.
      const initialPageFailures = [...pageFailures]
      const recoveredPageFailures = []
      const persistentPageFailures = []
      for (const failure of initialPageFailures) {
        if (!failure.url || !(failure.status === 408 || failure.status === 429 || (typeof failure.status === "number" && failure.status >= 500))) {
          // Do not retry stable client errors (especially 403/404) with cache-busting
          // query strings. That creates needless Worker work and can hide the real cause.
          persistentPageFailures.push(failure)
          continue
        }
        const retryUrl = new URL(failure.url)
        retryUrl.searchParams.set("__route_audit", process.env.GITHUB_SHA || String(Date.now()))
        try {
          const response = await fetchWithRetry(retryUrl.toString(), {
            redirect: "follow",
            headers: {
              "user-agent": "PilotStack-ProductionSmokeCheck/1.0",
              "cache-control": "no-cache",
              pragma: "no-cache",
            },
            signal: AbortSignal.timeout(15000),
          }, 3)
          if (response.status < 400) {
            recoveredPageFailures.push({
              url: failure.url,
              initialStatus: failure.status,
              recheckStatus: response.status,
              finalUrl: response.url,
            })
          } else {
            persistentPageFailures.push({
              ...failure,
              recheckStatus: response.status,
              recheckFinalUrl: response.url,
            })
          }
          await response.body?.cancel()
        } catch (error) {
          persistentPageFailures.push({
            ...failure,
            recheckStatus: "FETCH_ERROR",
            recheckDetail: error instanceof Error ? error.message : String(error),
          })
        }
      }
      pageFailures.splice(0, pageFailures.length, ...persistentPageFailures)
      const limitReached = sitemapQueue.length > 0 || pageTargets.size >= maxPages
      const allFailures = [...sitemapFailures, ...pageFailures]
      if (process.env.AUDIT_OUTPUT_FILE) {
        await require("node:fs/promises").writeFile(
          process.env.AUDIT_OUTPUT_FILE,
          JSON.stringify({
            site: SITE_URL,
            checkedAt: new Date().toISOString(),
            sitemapFilesChecked: visitedSitemaps.size,
            pageUrlsChecked: targets.length,
            sitemapFailures,
            pageFailures,
            recoveredPageFailures,
            limitReached,
          }, null, 2) + "\n",
          "utf8"
        )
      }
      report(
        "sitemap target HTTP status",
        allFailures.length === 0 && !limitReached && targets.length > 0,
        JSON.stringify({
          sitemapFilesChecked: visitedSitemaps.size,
          pageUrlsChecked: targets.length,
          sitemapFailures: sitemapFailures.length,
          pageFailures: pageFailures.length,
          transientPageFailuresRecovered: recoveredPageFailures.length,
          limitReached,
          sampleRecovered: recoveredPageFailures.slice(0, 10),
          sampleFailures: allFailures.slice(0, 25),
        })
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

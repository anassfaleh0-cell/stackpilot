#!/usr/bin/env node
/**
 * Smoke-test the built Next.js app over HTTP.
 * Run after `next build` and `next start`; no third-party dependencies required.
 */
const BASE_URL = (process.env.SMOKE_BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "")
const EXPECTED_ADS_LINE = "google.com, pub-6523926892521982, DIRECT, f08c47fec0942fa0"
const ROUTES = [
  "/",
  "/reviews",
  "/comparisons",
  "/guides",
  "/blog",
  "/glossary",
  "/tools",
  "/about",
  "/team",
  "/contact",
  "/privacy",
  "/terms",
  "/methodology",
  "/reviews/linear",
  "/comparisons/square-vs-xero",
  "/comparisons/zoom-vs-webex",
  "/category/marketing-seo",
  "/category/developer-tools",
  "/use-cases/best-seo-for-agencies",
  "/statistics/marketing-software",
  "/research/saas-churn-benchmarks-2026",
  "/hubs/software-for-healthcare",
  "/industries/healthcare",
]

let failures = 0
let passes = 0

function pass(message) {
  passes++
  console.log(`PASS ${message}`)
}
function fail(message) {
  failures++
  console.error(`FAIL ${message}`)
}

async function fetchText(pathname) {
  const response = await fetch(`${BASE_URL}${pathname}`, {
    redirect: "follow",
    headers: { "user-agent": "PilotStack-Route-Smoke-Check/1.0" },
    signal: AbortSignal.timeout(15000),
  })
  const finalOrigin = new URL(response.url).origin
  const expectedOrigin = new URL(BASE_URL).origin
  if (finalOrigin !== expectedOrigin) {
    throw new Error(`request escaped smoke-test origin: expected ${expectedOrigin}, received ${finalOrigin}`)
  }
  return { response, body: await response.text() }
}

async function checkRoute(pathname) {
  try {
    const { response, body } = await fetchText(pathname)
    if (!response.ok) {
      fail(`${pathname} returned HTTP ${response.status}`)
      return
    }
    const contentType = response.headers.get("content-type") || ""
    if (!contentType.includes("text/html")) {
      fail(`${pathname} returned unexpected content-type: ${contentType || "(missing)"}`)
      return
    }
    if (!/<title(?:\s[^>]*)?>[^<]{2,}<\/title>/i.test(body)) {
      fail(`${pathname} has no meaningful HTML title`)
      return
    }
    if (!/<meta\s+[^>]*name=["']description["'][^>]*content=["'][^"']{20,}["']/i.test(body) &&
        !/<meta\s+[^>]*content=["'][^"']{20,}["'][^>]*name=["']description["']/i.test(body)) {
      fail(`${pathname} has no meaningful meta description`)
      return
    }
    const canonicalTag = body.match(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i)?.[0] || ""
    const canonicalHref = canonicalTag.match(/\bhref=["']([^"']+)["']/i)?.[1]
    if (!canonicalHref) {
      fail(`${pathname} has no canonical link with an href`)
      return
    }
    try {
      const canonicalUrl = new URL(canonicalHref, "https://pilotstack.online")
      if (canonicalUrl.origin !== "https://pilotstack.online" || canonicalUrl.pathname !== pathname || canonicalUrl.search) {
        fail(`${pathname} has a non-canonical or mismatched canonical URL: ${canonicalUrl.href}`)
        return
      }
    } catch {
      fail(`${pathname} has an invalid canonical URL: ${canonicalHref}`)
      return
    }
    const robotsMeta = body.match(/<meta\b(?=[^>]*\bname=["']robots["'])[^>]*>/i)?.[0] || ""
    if (/\bcontent=["'][^"']*\bnoindex\b/i.test(robotsMeta)) {
      fail(`${pathname} is unexpectedly noindex in the built app`)
      return
    }
    pass(`${pathname} HTTP ${response.status}, title/description/canonical present`)
  } catch (error) {
    fail(`${pathname} request failed: ${error instanceof Error ? error.message : String(error)}`)
  }
}

async function main() {
  console.log(`PilotStack route smoke check: ${BASE_URL}`)

  try {
    const { response, body } = await fetchText("/ads.txt")
    if (!response.ok) fail(`/ads.txt returned HTTP ${response.status}`)
    else if (!body.split(/\r?\n/).some((line) => line.trim() === EXPECTED_ADS_LINE)) {
      fail("/ads.txt does not contain the expected publisher record")
    } else pass("/ads.txt contains the expected AdSense publisher record")
  } catch (error) {
    fail(`/ads.txt request failed: ${error instanceof Error ? error.message : String(error)}`)
  }

  try {
    const { response, body } = await fetchText("/robots.txt")
    if (!response.ok) fail(`/robots.txt returned HTTP ${response.status}`)
    else if (!body.includes("/sitemap.xml") || !body.includes("Disallow: /api/")) {
      fail("/robots.txt is missing sitemap reference or API exclusion")
    } else pass("/robots.txt exposes sitemap and keeps API paths disallowed")
  } catch (error) {
    fail(`/robots.txt request failed: ${error instanceof Error ? error.message : String(error)}`)
  }

  try {
    const { response, body } = await fetchText("/sitemap.xml")
    if (!response.ok) fail(`/sitemap.xml returned HTTP ${response.status}`)
    else {
      const locations = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim())
      if (!body.includes("<urlset") || locations.length === 0) {
        fail("/sitemap.xml is not a non-empty URL sitemap")
      } else {
        const requiredSitemapPaths = [
          "/reviews/linear",
          "/comparisons/square-vs-xero",
          "/comparisons/zoom-vs-webex",
          "/category/marketing-seo",
          "/category/developer-tools",
          "/use-cases/best-seo-for-agencies",
          "/statistics/marketing-software",
          "/research/saas-churn-benchmarks-2026",
          "/hubs/software-for-healthcare",
          "/industries/healthcare",
        ]
        const missingRequired = requiredSitemapPaths.filter((pathname) => !locations.includes(`https://pilotstack.online${pathname}`))
        if (missingRequired.length) fail(`/sitemap.xml is missing known landing routes: ${missingRequired.join(", ")}`)
        else pass("Known GSC landing routes are included in the sitemap")

        const duplicates = locations.filter((url, index) => locations.indexOf(url) !== index)
        const invalid = locations.filter((url) => {
          try {
            const parsed = new URL(url)
            return parsed.protocol !== "https:" || parsed.hostname !== "pilotstack.online"
          } catch {
            return true
          }
        })
        if (duplicates.length) fail(`/sitemap.xml contains ${duplicates.length} duplicate URL(s)`)
        else pass(`/sitemap.xml contains ${locations.length} unique URL(s)`)
        if (invalid.length) fail(`/sitemap.xml contains ${invalid.length} non-canonical-host or invalid URL(s); sample: ${invalid.slice(0, 3).join(", ")}`)
        else pass("/sitemap.xml URLs use the canonical HTTPS host")
      }
    }
  } catch (error) {
    fail(`/sitemap.xml request failed: ${error instanceof Error ? error.message : String(error)}`)
  }

  for (const route of ROUTES) await checkRoute(route)

  // Validate every sitemap URL with bounded concurrency, not just top-level routes.
  try {
    const { response, body } = await fetchText("/sitemap.xml")
    if (response.ok) {
      const urls = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim())
      const paths = [...new Set(urls.flatMap((url) => {
        try {
          const parsed = new URL(url)
          return parsed.protocol === "https:" && parsed.hostname === "pilotstack.online" ? [parsed.pathname] : []
        } catch {
          return []
        }
      }))].filter((pathname) => !ROUTES.includes(pathname) && !/\.(?:xml|txt|json|pdf)$/i.test(pathname))
      let cursor = 0
      const workerCount = Math.min(12, paths.length)
      await Promise.all(Array.from({ length: workerCount }, async () => {
        while (cursor < paths.length) {
          const pathname = paths[cursor++]
          await checkRoute(pathname)
        }
      }))
      pass(`Completed sitemap route crawl for ${paths.length} additional unique paths`)
    }
  } catch (error) {
    fail(`sitemap route crawl failed: ${error instanceof Error ? error.message : String(error)}`)
  }

  console.log(`\nSummary: ${passes} passed, ${failures} failed`)
  if (failures) process.exitCode = 1
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

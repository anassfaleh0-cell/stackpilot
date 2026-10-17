#!/usr/bin/env node
/**
 * Live technical readiness audit for PilotStack's AdSense review.
 *
 * This is a diagnostic only: passing checks cannot guarantee Google AdSense
 * approval. It intentionally checks public endpoints without credentials and
 * never changes production.
 *
 * Run: node scripts/audit-live-readiness.js
 */

const BASE_URL = "https://pilotstack.online"
const EXPECTED_ADS_LINE = "google.com, pub-6523926892521982, DIRECT, f08c47fec0942fa0"
const TIMEOUT_MS = 15000

let failures = 0
let warnings = 0
let passes = 0

function report(level, message) {
  const labels = { pass: "PASS", warn: "WARN", fail: "FAIL", info: "INFO" }
  console.log(`[${labels[level]}] ${message}`)
  if (level === "pass") passes++
  if (level === "warn") warnings++
  if (level === "fail") failures++
}

async function get(pathname) {
  const url = new URL(pathname, BASE_URL)
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { "user-agent": "PilotStack-Live-Readiness-Audit/1.0" },
    })
    const body = await response.text()
    return {
      requestedUrl: url.href,
      finalUrl: response.url,
      status: response.status,
      contentType: response.headers.get("content-type") || "",
      body,
    }
  } catch (error) {
    report("fail", `${pathname}: request failed (${error instanceof Error ? error.message : String(error)})`)
    return null
  }
}

async function checkPage(pathname) {
  const result = await get(pathname)
  if (!result) return null
  if (result.status >= 200 && result.status < 300) {
    report("pass", `${pathname} returns HTTP ${result.status}`)
  } else {
    report("fail", `${pathname} returns HTTP ${result.status}`)
  }
  if (!result.finalUrl.startsWith("https://pilotstack.online/") && result.finalUrl !== BASE_URL) {
    report("warn", `${pathname} redirects to unexpected final URL: ${result.finalUrl}`)
  }
  return result
}

async function main() {
  console.log(`PilotStack live technical readiness audit — ${BASE_URL}`)
  console.log("Read-only checks; no production changes will be made.\n")

  const [home, ads, robots, sitemap] = await Promise.all([
    checkPage("/"),
    checkPage("/ads.txt"),
    checkPage("/robots.txt"),
    checkPage("/sitemap.xml"),
  ])

  if (home) {
    if (/<!doctype html|<html[\s>]/i.test(home.body) && /<title[^>]*>\s*[^<]{3,}/i.test(home.body)) {
      report("pass", "Homepage response contains HTML and a non-empty title")
    } else {
      report("warn", "Homepage response did not clearly expose a non-empty HTML title; inspect rendered HTML")
    }
    if (/noindex/i.test(home.body)) {
      report("warn", "Homepage HTML contains the text 'noindex'; verify whether it is actual robots metadata or unrelated content")
    }
  }

  if (ads) {
    const normalized = ads.body.replace(/^\uFEFF/, "").trim()
    if (normalized.split(/\r?\n/).some((line) => line.trim() === EXPECTED_ADS_LINE)) {
      report("pass", "ads.txt contains the exact expected Google publisher record")
    } else {
      report("fail", "ads.txt does not contain the exact expected Google publisher record")
      report("info", `Expected record: ${EXPECTED_ADS_LINE}`)
    }
    if (/text\/plain/i.test(ads.contentType)) {
      report("pass", `ads.txt Content-Type is ${ads.contentType}`)
    } else {
      report("warn", `ads.txt Content-Type is ${ads.contentType || "(missing)"}; Google must be able to read it as a plain-text file`)
    }
    if (/<html|<!doctype/i.test(normalized)) {
      report("fail", "ads.txt returned HTML instead of a plain-text ads.txt file")
    }
  }

  if (robots) {
    if (/^\s*sitemap:\s*https:\/\/pilotstack\.online\/sitemap\.xml\s*$/im.test(robots.body)) {
      report("pass", "robots.txt declares the canonical sitemap URL")
    } else {
      report("fail", "robots.txt does not declare https://pilotstack.online/sitemap.xml")
    }
    if (/^\s*disallow:\s*\/\s*$/im.test(robots.body)) {
      report("fail", "robots.txt contains a site-wide Disallow: / rule")
    }
  }

  if (sitemap) {
    const xml = sitemap.body.trim()
    if (/<(?:\w+:)?(?:urlset|sitemapindex)(?:\s|>)/i.test(xml) && /<\/?(?:\w+:)?(?:urlset|sitemapindex)(?:\s|>)/i.test(xml)) {
      report("pass", "sitemap.xml has a recognizable sitemap XML root")
    } else {
      report("fail", "sitemap.xml does not look like a sitemap index or URL set")
    }
    if (/<loc>\s*https?:\/\//i.test(xml)) {
      report("pass", "sitemap.xml contains absolute loc URLs")
    } else {
      report("fail", "sitemap.xml has no absolute loc URL in the response body")
    }
    const locations = xml.match(/<loc>/gi) || []
    report("info", `Sitemap response contains ${locations.length} <loc> element(s) in the returned document`)
  }

  const trustPages = [
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/methodology",
    "/editorial-policy",
    "/affiliate-disclosure",
  ]
  const trustResults = await Promise.all(trustPages.map(checkPage))
  const badTrustPages = trustResults.filter((result) => !result || result.status < 200 || result.status >= 300)
  if (badTrustPages.length) {
    report("warn", `${badTrustPages.length} trust/transparency page(s) did not return 2xx; inspect redirects and route availability`)
  }

  console.log("\nSummary")
  console.log(`PASS: ${passes} | WARN: ${warnings} | FAIL: ${failures}`)
  console.log("A clean technical audit is not an AdSense approval guarantee; review site quality, original value, policy compliance, and the exact AdSense diagnostic separately.")
  if (failures > 0) process.exitCode = 1
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

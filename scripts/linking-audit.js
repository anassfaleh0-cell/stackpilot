#!/usr/bin/env node
/**
 * Rendered internal-link audit.
 *
 * Reads the live sitemap and crawls rendered HTML instead of inferring links from
 * raw JSON. The old implementation missed links created by shared React components
 * and incorrectly reported hundreds of pages as orphaned.
 *
 * Run: npm run seo:links
 * Override target: SITE_URL=https://preview.example.vercel.app npm run seo:links
 */
const SITE_URL = (process.env.SITE_URL || "https://pilotstack.online").replace(/\/+$/, "")
const SITE_ORIGIN = new URL(SITE_URL).origin
const CONCURRENCY = Math.max(1, Math.min(16, Number(process.env.LINK_AUDIT_CONCURRENCY) || 10))
const REQUEST_TIMEOUT_MS = 20000

function normalizePath(pathname) {
  if (!pathname || pathname === "/") return "/"
  return decodeURI(pathname).replace(/\/+$/, "")
}

function extractSitemapUrls(xml) {
  return [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)]
    .map((match) => match[1].replace(/&amp;/g, "&").trim())
    .filter(Boolean)
}

function extractInternalLinks(html, pageUrl) {
  const paths = new Set()
  for (const match of html.matchAll(/<a\b[^>]*?href\s*=\s*["']([^"']+)["'][^>]*>/gi)) {
    const rawHref = match[1].replace(/&amp;/g, "&").trim()
    if (!rawHref || /^(?:mailto:|tel:|javascript:|data:)/i.test(rawHref)) continue
    try {
      const target = new URL(rawHref, pageUrl)
      if (target.origin !== SITE_ORIGIN || target.pathname.startsWith("/_next/") || target.pathname.startsWith("/api/")) continue
      if (target.hash && normalizePath(target.pathname) === normalizePath(new URL(pageUrl).pathname) && !target.search) continue
      paths.add(normalizePath(target.pathname))
    } catch {
      // Ignore malformed and non-URL href values; report only verifiable internal URLs.
    }
  }
  return paths
}

async function fetchWithTimeout(url, options = {}) {
  return fetch(url, {
    ...options,
    redirect: "follow",
    headers: { "user-agent": "PilotStack-InternalLinkAudit/1.0", ...(options.headers || {}) },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
}

async function run() {
  const sitemapResponse = await fetchWithTimeout(`${SITE_URL}/sitemap.xml`)
  if (!sitemapResponse.ok) throw new Error(`Sitemap request failed: HTTP ${sitemapResponse.status}`)
  const sitemapUrls = extractSitemapUrls(await sitemapResponse.text())
    .filter((url) => {
      try { return new URL(url).origin === SITE_ORIGIN } catch { return false }
    })
  const uniqueUrls = [...new Map(sitemapUrls.map((url) => [normalizePath(new URL(url).pathname), url])).values()]
  if (uniqueUrls.length === 0) throw new Error("Sitemap contained no same-origin URLs")

  const sitemapPaths = new Set(uniqueUrls.map((url) => normalizePath(new URL(url).pathname)))
  const incoming = new Map([...sitemapPaths].map((pathname) => [pathname, 0]))
  const nonSitemapTargets = new Set()
  const failedPages = []
  let cursor = 0
  let completed = 0

  async function worker() {
    while (cursor < uniqueUrls.length) {
      const url = uniqueUrls[cursor++]
      try {
        const response = await fetchWithTimeout(url)
        if (!response.ok) {
          failedPages.push({ url, status: response.status })
          continue
        }
        const contentType = response.headers.get("content-type") || ""
        if (!contentType.includes("text/html")) continue
        const html = await response.text()
        for (const pathname of extractInternalLinks(html, url)) {
          if (incoming.has(pathname)) incoming.set(pathname, incoming.get(pathname) + 1)
          else if (pathname !== "/rss.xml") nonSitemapTargets.add(pathname)
        }
      } catch (error) {
        failedPages.push({ url, error: error instanceof Error ? error.message : String(error) })
      }
      completed++
      if (completed % 250 === 0) console.log(`Crawled ${completed}/${uniqueUrls.length} sitemap pages`)
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker))

  const orphanPages = [...incoming].filter(([, count]) => count === 0).map(([pathname]) => pathname)
  const weakPages = [...incoming]
    .filter(([, count]) => count > 0 && count < 3)
    .sort((left, right) => left[1] - right[1] || left[0].localeCompare(right[0]))
  const targetPaths = [...nonSitemapTargets]
  const brokenInternalTargets = []
  let targetCursor = 0
  async function targetWorker() {
    while (targetCursor < targetPaths.length) {
      const pathname = targetPaths[targetCursor++]
      try {
        const response = await fetchWithTimeout(`${SITE_URL}${pathname}`, { method: "HEAD" })
        if (response.status === 404 || response.status === 410) {
          brokenInternalTargets.push({ pathname, status: response.status })
        }
      } catch (error) {
        brokenInternalTargets.push({ pathname, error: error instanceof Error ? error.message : String(error) })
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, targetWorker))

  const byPrefix = {}
  for (const pathname of sitemapPaths) {
    const prefix = pathname.split("/")[1] || "home"
    byPrefix[prefix] = (byPrefix[prefix] || 0) + 1
  }

  console.log("[internal-link-audit] Rendered HTML crawl; shared component links are included.")
  console.log("Sitemap URLs:", uniqueUrls.length)
  console.log("Failed sitemap pages:", failedPages.length, JSON.stringify(failedPages.slice(0, 30)))
  console.log("Orphan sitemap pages:", orphanPages.length, JSON.stringify(orphanPages.slice(0, 80)))
  console.log("Pages with only 1-2 incoming links:", weakPages.length, JSON.stringify(weakPages.slice(0, 80)))
  console.log("Internal targets absent from sitemap:", nonSitemapTargets.size, JSON.stringify([...nonSitemapTargets].sort().slice(0, 80)))
  console.log("Broken internal targets absent from sitemap:", brokenInternalTargets.length, JSON.stringify(brokenInternalTargets.slice(0, 80)))
  console.log("Page counts by prefix:", JSON.stringify(byPrefix))

  if (failedPages.length > 0 || brokenInternalTargets.length > 0) process.exitCode = 1
}

run().catch((error) => {
  console.error("[internal-link-audit] Failed:", error instanceof Error ? error.message : error)
  process.exitCode = 1
})

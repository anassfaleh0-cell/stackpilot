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
// Never crawl production by default: a full rendered audit can request thousands of
// URLs and retry transient 5xx responses. Local/build-time checks are the safe default.
const SITE_URL = (process.env.SITE_URL || "http://127.0.0.1:3000").replace(/\/+$/, "")
const SITE_ORIGIN = new URL(SITE_URL).origin
const IS_LIVE_PRODUCTION = ["pilotstack.online", "www.pilotstack.online"].includes(new URL(SITE_URL).hostname)
if (IS_LIVE_PRODUCTION && process.env.ALLOW_LIVE_AUDIT !== "1") {
  console.error("Refusing to crawl production without ALLOW_LIVE_AUDIT=1. Prefer a local build or preview URL.")
  process.exit(2)
}
const CONCURRENCY = IS_LIVE_PRODUCTION ? 1 : Math.max(1, Math.min(4, Number(process.env.LINK_AUDIT_CONCURRENCY) || 2))
const REQUEST_TIMEOUT_MS = 25000
const MAX_TRANSIENT_RETRIES = IS_LIVE_PRODUCTION ? 0 : 2
const LIVE_REQUEST_DELAY_MS = IS_LIVE_PRODUCTION ? Math.max(1000, Number(process.env.LIVE_AUDIT_DELAY_MS) || 1000) : 0
const CACHE_BUSTER = process.env.LINK_AUDIT_CACHE_BUSTER || String(Date.now())
const TRANSIENT_STATUSES = new Set([429, 500, 502, 503, 504])

function normalizePath(pathname) {
  if (!pathname || pathname === "/") return "/"
  // A malformed percent-escape in one URL must not crash the entire site-wide audit.
  try {
    return decodeURI(pathname).replace(/\/+$/, "")
  } catch {
    return pathname.replace(/\/+$/, "") || "/"
  }
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
      target.hash = ""
      paths.add(`${target.origin}${normalizePath(target.pathname)}${target.search}`)
    } catch {
      // Ignore malformed and non-URL href values; report only verifiable internal URLs.
    }
  }
  return paths
}

function isPaginationUrl(target) {
  const page = Number(target.searchParams.get("page"))
  return target.searchParams.has("page") && Number.isInteger(page) && page > 1 && page <= 100
}

async function fetchWithTimeout(url, options = {}) {
  let lastError
  const requestUrl = new URL(url)
  // Unique query strings bypass prerender/edge cache and can force expensive SSR.
  // Never add them to live production requests.
  if (requestUrl.origin === SITE_ORIGIN && !IS_LIVE_PRODUCTION) {
    requestUrl.searchParams.set("__link_audit", CACHE_BUSTER)
  }
  for (let attempt = 0; attempt <= MAX_TRANSIENT_RETRIES; attempt++) {
    try {
      if (LIVE_REQUEST_DELAY_MS) await new Promise((resolve) => setTimeout(resolve, LIVE_REQUEST_DELAY_MS))
      const response = await fetch(requestUrl.toString(), {
        ...options,
        redirect: options.redirect ?? "follow",
        headers: { "user-agent": "PilotStack-InternalLinkAudit/1.0", ...(options.headers || {}) },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
      if (!TRANSIENT_STATUSES.has(response.status) || attempt === MAX_TRANSIENT_RETRIES) return response
      // Release the transient response before retrying to avoid holding sockets while the
      // edge recovers from short bursts of sitemap-crawl traffic.
      await response.body?.cancel().catch(() => {})
    } catch (error) {
      lastError = error
      if (attempt === MAX_TRANSIENT_RETRIES) throw error
    }
    await new Promise((resolve) => setTimeout(resolve, 800 * (2 ** attempt)))
  }
  throw lastError ?? new Error(`Request failed after retries: ${url}`)
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
  const paginationTargets = new Set()
  const failedPages = []
  let cursor = 0
  let completed = 0

  async function worker() {
    while (cursor < uniqueUrls.length) {
      const url = uniqueUrls[cursor++]
      try {
        const response = await fetchWithTimeout(url, { redirect: "manual" })
        if (response.status >= 300 && response.status < 400) {
          failedPages.push({ url, status: response.status, redirect: response.headers.get("location") || "(missing Location)" })
          continue
        }
        if (!response.ok) {
          failedPages.push({ url, status: response.status })
          continue
        }
        const contentType = response.headers.get("content-type") || ""
        if (!contentType.includes("text/html")) continue
        const html = await response.text()
        for (const href of extractInternalLinks(html, url)) {
          const target = new URL(href)
          const pathname = normalizePath(target.pathname)
          if (incoming.has(pathname)) incoming.set(pathname, incoming.get(pathname) + 1)
          if (isPaginationUrl(target)) {
            paginationTargets.add(target.href)
            continue
          }
          if (!incoming.has(pathname) && pathname !== "/rss.xml") nonSitemapTargets.add(pathname)
        }
      } catch (error) {
        failedPages.push({ url, error: error instanceof Error ? error.message : String(error) })
      }
      completed++
      if (completed % 250 === 0) console.log(`Crawled ${completed}/${uniqueUrls.length} sitemap pages`)
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker))

  // Pagination URLs are intentionally excluded from the sitemap, but they still
  // expose links to later pages in each directory. Crawl page=N variants so the
  // incoming-link audit does not mislabel paginated content as weak or orphaned.
  const paginationQueue = [...paginationTargets]
  const visitedPagination = new Set()
  let paginationCursor = 0
  async function paginationWorker() {
    while (paginationCursor < paginationQueue.length) {
      const url = paginationQueue[paginationCursor++]
      if (visitedPagination.has(url)) continue
      visitedPagination.add(url)
      try {
        const response = await fetchWithTimeout(url)
        if (!response.ok) {
          failedPages.push({ url, status: response.status })
          continue
        }
        const contentType = response.headers.get("content-type") || ""
        if (!contentType.includes("text/html")) continue
        const html = await response.text()
        for (const href of extractInternalLinks(html, url)) {
          const target = new URL(href)
          const pathname = normalizePath(target.pathname)
          if (incoming.has(pathname)) incoming.set(pathname, incoming.get(pathname) + 1)
          if (isPaginationUrl(target)) {
            if (!visitedPagination.has(target.href)) paginationQueue.push(target.href)
            continue
          }
          if (!incoming.has(pathname) && pathname !== "/rss.xml") nonSitemapTargets.add(pathname)
        }
      } catch (error) {
        failedPages.push({ url, error: error instanceof Error ? error.message : String(error) })
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, paginationWorker))

  // A page can still return a transient 5xx after its per-request retries when the
  // edge is busy serving a large sitemap crawl. Retry transient failures once more
  // after the crawl has finished, when request pressure is lower, before failing CI.
  const recoveredTransientPages = []
  for (const failed of [...failedPages]) {
    if (!TRANSIENT_STATUSES.has(failed.status) && !failed.error) continue
    try {
      const response = await fetchWithTimeout(failed.url, { redirect: "manual" })
      if (!response.ok) {
        failed.status = response.status
        continue
      }
      const failedIndex = failedPages.indexOf(failed)
      if (failedIndex >= 0) failedPages.splice(failedIndex, 1)
      recoveredTransientPages.push(failed.url)
      const contentType = response.headers.get("content-type") || ""
      if (!contentType.includes("text/html")) continue
      const html = await response.text()
      for (const href of extractInternalLinks(html, failed.url)) {
        const target = new URL(href)
        const pathname = normalizePath(target.pathname)
        if (incoming.has(pathname)) incoming.set(pathname, incoming.get(pathname) + 1)
        if (isPaginationUrl(target)) {
          if (!paginationTargets.has(target.href)) paginationTargets.add(target.href)
          continue
        }
        if (!incoming.has(pathname) && pathname !== "/rss.xml") nonSitemapTargets.add(pathname)
      }
    } catch (error) {
      failed.error = error instanceof Error ? error.message : String(error)
    }
  }
  console.log("Recovered transient sitemap pages after crawl:", recoveredTransientPages.length, JSON.stringify(recoveredTransientPages.slice(0, 20)))

  const orphanPages = [...incoming].filter(([, count]) => count === 0).map(([pathname]) => pathname)
  const weakPages = [...incoming]
    .filter(([, count]) => count > 0 && count < 3)
    .sort((left, right) => left[1] - right[1] || left[0].localeCompare(right[0]))
  const targetPaths = [...nonSitemapTargets]
  const brokenInternalTargets = []
  const redirectingInternalTargets = []
  let targetCursor = 0
  async function targetWorker() {
    while (targetCursor < targetPaths.length) {
      const pathname = targetPaths[targetCursor++]
      try {
        const response = await fetchWithTimeout(`${SITE_URL}${pathname}`, { method: "HEAD", redirect: "manual" })
        if (response.status >= 300 && response.status < 400) {
          redirectingInternalTargets.push({
            pathname,
            status: response.status,
            location: response.headers.get("location") || "(missing Location)",
          })
        } else if (response.status === 404 || response.status === 410) {
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
  console.log("Pagination pages crawled:", visitedPagination.size)
  console.log("Failed sitemap pages:", failedPages.length, JSON.stringify(failedPages.slice(0, 30)))
  console.log("Orphan sitemap pages:", orphanPages.length, JSON.stringify(orphanPages.slice(0, 80)))
  console.log("Pages with only 1-2 incoming links:", weakPages.length, JSON.stringify(weakPages.slice(0, 80)))
  console.log("Internal targets absent from sitemap:", nonSitemapTargets.size, JSON.stringify([...nonSitemapTargets].sort().slice(0, 80)))
  console.log("Broken internal targets absent from sitemap:", brokenInternalTargets.length, JSON.stringify(brokenInternalTargets.slice(0, 80)))
  console.log("Internal targets that redirect (should link directly to final URL):", redirectingInternalTargets.length, JSON.stringify(redirectingInternalTargets.slice(0, 80)))
  console.log("Page counts by prefix:", JSON.stringify(byPrefix))

  if (failedPages.length > 0 || brokenInternalTargets.length > 0 || redirectingInternalTargets.length > 0) process.exitCode = 1
}

run().catch((error) => {
  console.error("[internal-link-audit] Failed:", error instanceof Error ? error.message : error)
  process.exitCode = 1
})

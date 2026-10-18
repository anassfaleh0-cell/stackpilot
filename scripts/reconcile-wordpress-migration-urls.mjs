#!/usr/bin/env node
/**
 * Compare a local XML sitemap URL set with a WordPress migration inventory report.
 *
 * Usage:
 *   node scripts/reconcile-wordpress-migration-urls.mjs --sitemap /tmp/sitemap.xml --inventory /tmp/inventory.json
 *
 * Read-only: does not fetch URLs, contact WordPress, or modify input files.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

function argument(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

const sitemapFile = argument("--sitemap");
const inventoryFile = argument("--inventory");
if (!sitemapFile || !inventoryFile) {
  process.stderr.write("Usage: node scripts/reconcile-wordpress-migration-urls.mjs --sitemap <urlset.xml> --inventory <inventory.json>\n");
  process.exit(2);
}

function decodeXml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function normalizeUrl(value, base) {
  const url = new URL(value, base);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error(`Unsupported URL protocol: ${url.protocol}`);
  const pathname = decodeURIComponent(url.pathname).replace(/\\/g, "/").replace(/\/{2,}/g, "/");
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : "/";
}

const sitemapText = await readFile(path.resolve(sitemapFile), "utf8");
if (/<sitemapindex\b/i.test(sitemapText)) {
  throw new Error("Input is a sitemap index, not a urlset. Expand its child sitemaps to local URL-set XML files before reconciling.");
}
if (!/<urlset\b/i.test(sitemapText)) {
  throw new Error("Input does not look like a sitemap <urlset> XML document.");
}
const rawUrls = [...sitemapText.matchAll(/<loc\b[^>]*>([\s\S]*?)<\/loc>/gi)]
  .map((match) => decodeXml(match[1].trim()))
  .filter(Boolean);
const sitemapPaths = new Set();
const invalidSitemapUrls = [];
for (const url of rawUrls) {
  try {
    sitemapPaths.add(normalizeUrl(url));
  } catch (error) {
    invalidSitemapUrls.push({ url, error: error instanceof Error ? error.message : String(error) });
  }
}

const inventory = JSON.parse(await readFile(path.resolve(inventoryFile), "utf8"));
if (!inventory || !Array.isArray(inventory.records)) {
  throw new Error("Inventory JSON must contain a records array from wordpress-migration-inventory.mjs.");
}
const candidates = new Map();
const unmappedCollections = new Map();
for (const record of inventory.records) {
  if (typeof record.proposedPath === "string" && record.proposedPath.startsWith("/")) {
    let normalized;
    try {
      normalized = normalizeUrl(record.proposedPath, "https://pilotstack.online");
    } catch {
      continue;
    }
    if (!candidates.has(normalized)) candidates.set(normalized, []);
    candidates.get(normalized).push(record.sourceFile || record.slug || "unknown");
  } else if (record.collection) {
    unmappedCollections.set(record.collection, (unmappedCollections.get(record.collection) || 0) + 1);
  }
}

const candidatePaths = new Set(candidates.keys());
const matched = [...candidatePaths].filter((url) => sitemapPaths.has(url)).sort();
const contentOnly = [...candidatePaths].filter((url) => !sitemapPaths.has(url)).sort();
const sitemapOnly = [...sitemapPaths].filter((url) => !candidatePaths.has(url)).sort();
const duplicateCandidates = [...candidates.entries()]
  .filter(([, sources]) => sources.length > 1)
  .map(([url, sources]) => ({ url, sources }))
  .sort((a, b) => a.url.localeCompare(b.url));

const report = {
  generatedAt: new Date().toISOString(),
  mode: "local read-only comparison; candidate paths are not verified route mappings",
  sitemapFile: path.resolve(sitemapFile),
  inventoryFile: path.resolve(inventoryFile),
  sitemapUrlCount: rawUrls.length,
  uniqueSitemapPathCount: sitemapPaths.size,
  uniqueCandidatePathCount: candidatePaths.size,
  matchedCandidatePathCount: matched.length,
  contentCandidateNotInSitemapCount: contentOnly.length,
  sitemapPathWithoutContentCandidateCount: sitemapOnly.length,
  invalidSitemapUrlCount: invalidSitemapUrls.length,
  duplicateCandidatePathCount: duplicateCandidates.length,
  unmappedCollectionRecordCount: [...unmappedCollections.values()].reduce((sum, count) => sum + count, 0),
  matched,
  contentOnly,
  sitemapOnly,
  duplicateCandidates,
  unmappedCollections: Object.fromEntries([...unmappedCollections.entries()].sort(([a], [b]) => a.localeCompare(b))),
  invalidSitemapUrls,
};
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

#!/usr/bin/env node
/**
 * Read-only inventory helper for a future PilotStack -> WordPress migration.
 *
 * Run from the repository root:
 *   node scripts/wordpress-migration-inventory.mjs
 *
 * Reads content/**/*.json and prints a JSON report to stdout. It does not
 * modify source files, create WordPress records, or contact any remote service.
 */
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const contentRoot = path.join(root, "content");
const publicRouteByCollection = {
  reviews: "reviews",
  comparisons: "comparisons",
  guides: "guides",
  blog: "blog",
  glossary: "glossary",
  alternatives: "alternatives",
  best: "best",
  "use-cases": "use-cases",
  industries: "industries",
  research: "research",
  statistics: "statistics",
  hubs: "hubs",
  categories: "category",
  // Provenance records are audit metadata, not public landing pages.
  provenance: null,
};

const expectedFields = {
  reviews: ["slug", "name", "description"],
  comparisons: ["slug", "title", "description", "tool1", "tool2"],
  guides: ["slug", "title", "description"],
  blog: ["slug", "title", "description"],
  glossary: ["slug", "title", "description"],
  alternatives: ["slug"],
  best: ["slug", "title"],
  "use-cases": ["slug", "title"],
  industries: ["slug", "title"],
  research: ["slug", "title"],
  statistics: ["slug", "title"],
  hubs: ["slug", "title"],
};

async function walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error && error.code === "ENOENT") return [];
    throw error;
  }

  const found = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await walk(fullPath)));
    else if (entry.isFile() && entry.name.endsWith(".json")) found.push(fullPath);
  }
  return found;
}

function asRelative(file) {
  return path.relative(root, file).split(path.sep).join("/");
}

function isSafeSlug(slug) {
  return Boolean(slug) &&
    !slug.startsWith("/") &&
    !slug.includes("\\\\") &&
    !slug.split("/").some((part) => part === "." || part === "..");
}

const files = (await walk(contentRoot)).sort();
const collections = new Map();
const duplicateSlugs = [];
const invalidJson = [];
const invalidRecords = [];
const missingFields = [];
const records = [];
let totalBytes = 0;

for (const file of files) {
  const relativePath = asRelative(file);
  const parts = relativePath.split("/");
  const collection = parts[1] || "root";
  const entry = collections.get(collection) || {
    count: 0,
    bytes: 0,
    missingSlug: 0,
    duplicateSlugCount: 0,
  };

  const fileStats = await stat(file);
  totalBytes += fileStats.size;
  entry.count += 1;
  entry.bytes += fileStats.size;
  collections.set(collection, entry);

  let data;
  try {
    data = JSON.parse(await readFile(file, "utf8"));
  } catch (error) {
    invalidJson.push({
      file: relativePath,
      error: error instanceof Error ? error.message : String(error),
    });
    continue;
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    invalidRecords.push({ file: relativePath, reason: "Expected a JSON object at the top level" });
    continue;
  }

  const rawSlug = data.slug;
  const slug = typeof rawSlug === "string" ? rawSlug.trim() : "";
  if (rawSlug !== undefined && typeof rawSlug !== "string") {
    invalidRecords.push({ file: relativePath, reason: "Field slug exists but is not a string" });
  }
  if (slug && !isSafeSlug(slug)) {
    invalidRecords.push({ file: relativePath, reason: "Slug contains path syntax; review before import" });
  }
  if (!slug && collection !== "provenance") {
    entry.missingSlug += 1;
    missingFields.push({ file: relativePath, fields: ["slug"] });
  }

  const required = (expectedFields[collection] || ["slug"]).filter((field) => field !== "slug");
  const absent = required.filter((field) => {
    const value = data[field];
    return value === undefined || value === null || (typeof value === "string" && value.trim() === "");
  });
  if (absent.length) {
    missingFields.push({ file: relativePath, fields: absent });
  }

  records.push({
    collection,
    slug,
    sourceFile: relativePath,
    // This is a proposed path mapping only; it does not guarantee that the
    // current site publishes every source file at this exact route.
    // Only collections with a known App Router route receive a candidate URL.
    // Provenance and unknown collections are deliberately not treated as pages.
    proposedPath:
      slug && isSafeSlug(slug) && publicRouteByCollection[collection]
        ? "/" + publicRouteByCollection[collection] + "/" + slug
        : null,
    title:
      typeof data.title === "string"
        ? data.title
        : typeof data.name === "string"
          ? data.name
          : null,
    bytes: fileStats.size,
  });
}

const seen = new Map();
for (const record of records) {
  if (!record.slug) continue;
  const key = `${record.collection}:${record.slug}`;
  if (seen.has(key)) {
    duplicateSlugs.push({
      collection: record.collection,
      slug: record.slug,
      firstFile: seen.get(key),
      duplicateFile: record.sourceFile,
    });
    const entry = collections.get(record.collection);
    if (entry) entry.duplicateSlugCount += 1;
  } else {
    seen.set(key, record.sourceFile);
  }
}

const summary = {
  generatedAt: new Date().toISOString(),
  mode: "read-only; no remote calls or source mutations",
  contentRoot: "content/",
  totalJsonFiles: files.length,
  parsedRecords: records.length,
  totalBytes,
  collectionCount: collections.size,
  invalidJsonCount: invalidJson.length,
  invalidRecordCount: invalidRecords.length,
  missingFieldIssueCount: missingFields.length,
  duplicateSlugCount: duplicateSlugs.length,
  collections: Object.fromEntries(
    [...collections.entries()].sort(([a], [b]) => a.localeCompare(b)),
  ),
  invalidJson,
  invalidRecords,
  missingFields,
  duplicateSlugs,
  records,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);

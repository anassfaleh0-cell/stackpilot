#!/usr/bin/env node
/** Fixture regression tests for sitemap/inventory reconciliation. */
import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const scriptPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "reconcile-wordpress-migration-urls.mjs");
const root = await mkdtemp(path.join(os.tmpdir(), "pilotstack-url-reconcile-"));
async function put(name, content) {
  const file = path.join(root, name);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, content, "utf8");
}
try {
  await put("sitemap.xml", `<?xml version="1.0"?><urlset>
    <url><loc>https://pilotstack.online/reviews/good-tool/</loc></url>
    <url><loc>https://pilotstack.online/about?from=sitemap&amp;v=1</loc></url>
    <url><loc>https://pilotstack.online/reviews/good-tool</loc></url>
  </urlset>`);
  await put("inventory.json", JSON.stringify({ records: [
    { collection: "reviews", slug: "good-tool", sourceFile: "content/reviews/good.json", proposedPath: "/reviews/good-tool" },
    { collection: "blog", slug: "new-post", sourceFile: "content/blog/new.json", proposedPath: "/blog/new-post" },
    { collection: "provenance", slug: "", sourceFile: "content/provenance/source.json", proposedPath: null },
    { collection: "unknown", slug: "x", sourceFile: "content/unknown/x.json", proposedPath: null }
  ] }));
  const result = spawnSync(process.execPath, [scriptPath, "--sitemap", path.join(root, "sitemap.xml"), "--inventory", path.join(root, "inventory.json")], { encoding: "utf8", timeout: 10000 });
  assert.equal(result.status, 0, result.stderr || "reconciliation script exited non-zero");
  const report = JSON.parse(result.stdout);
  assert.equal(report.sitemapUrlCount, 3);
  assert.equal(report.uniqueSitemapPathCount, 2);
  assert.equal(report.uniqueCandidatePathCount, 2);
  assert.equal(report.matchedCandidatePathCount, 1);
  assert.equal(report.contentCandidateNotInSitemapCount, 1);
  assert.equal(report.sitemapPathWithoutContentCandidateCount, 1);
  assert.equal(report.duplicateCandidatePathCount, 0);
  assert.equal(report.unmappedCollections.provenance, 1);
  assert.equal(report.unmappedCollections.unknown, 1);
  process.stdout.write("PASS: sitemap/inventory reconciliation regression checks\n");
} finally {
  await rm(root, { recursive: true, force: true });
}

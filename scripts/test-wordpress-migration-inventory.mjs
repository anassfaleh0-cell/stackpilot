#!/usr/bin/env node
/**
 * Fixture-based regression test for the read-only WordPress inventory script.
 * Run from the repository root: node scripts/test-wordpress-migration-inventory.mjs
 */
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const scriptPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "wordpress-migration-inventory.mjs");
const fixtureRoot = await mkdtemp(path.join(os.tmpdir(), "pilotstack-wp-inventory-"));

async function put(relativePath, value) {
  const target = path.join(fixtureRoot, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, value, "utf8");
}

try {
  await put("content/reviews/good.json", JSON.stringify({ slug: "good-tool", name: "Good Tool", description: "A valid fixture." }));
  await put("content/reviews/duplicate.json", JSON.stringify({ slug: "good-tool", name: "Another record", description: "Duplicate slug." }));
  await put("content/reviews/unsafe.json", JSON.stringify({ slug: "../outside", name: "Unsafe", description: "Path traversal fixture." }));
  await put("content/reviews/backslash.json", JSON.stringify({ slug: "bad\\slug", name: "Backslash", description: "Backslash path fixture." }));
  await put("content/comparisons/missing-fields.json", JSON.stringify({ slug: "needs-fields", title: "Needs fields", description: " ", tool1: "A" }));
  await put("content/reviews/malformed.json", "{ this is not JSON ");
  await put("content/reviews/array.json", JSON.stringify([{ slug: "not-a-record" }]));
  await put("content/provenance/sources.json", JSON.stringify({ generatedAt: "2026-01-01", sources: [] }));

  const result = spawnSync(process.execPath, [scriptPath], {
    cwd: fixtureRoot,
    encoding: "utf8",
    timeout: 10000,
  });
  assert.equal(result.status, 0, result.stderr || "inventory script exited non-zero");
  const report = JSON.parse(result.stdout);

  assert.equal(report.totalJsonFiles, 8);
  assert.equal(report.invalidJsonCount, 1);
  assert.equal(report.invalidRecordCount, 2);
  assert.equal(report.duplicateSlugCount, 1);
  assert.equal(report.collections.reviews.count, 6);
  assert.equal(report.collections.provenance.missingSlug, 0);
  assert.ok(report.missingFields.some((item) => item.file.endsWith("missing-fields.json") && item.fields.includes("tool2")));
  assert.ok(report.invalidRecords.some((item) => item.file.endsWith("unsafe.json")));
  const unsafe = report.records.find((item) => item.sourceFile.endsWith("unsafe.json"));
  assert.equal(unsafe.proposedPath, null);
  const backslash = report.records.find((item) => item.sourceFile.endsWith("backslash.json"));
  assert.equal(backslash.proposedPath, null);
  assert.ok(report.records.find((item) => item.sourceFile.endsWith("good.json")).proposedPath === "/reviews/good-tool");

  process.stdout.write("PASS: inventory script fixture regression checks\n");
} finally {
  await rm(fixtureRoot, { recursive: true, force: true });
}

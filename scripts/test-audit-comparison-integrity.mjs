#!/usr/bin/env node
/** Fixture tests for the read-only comparison integrity audit. */
import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), "audit-comparison-integrity.mjs");
const root = await mkdtemp(path.join(os.tmpdir(), "pilotstack-comparison-audit-"));
try {
  const dir = path.join(root, "content", "comparisons");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "bad.json"), JSON.stringify({
    slug: "shopify-vs-xero", published: false, category: "Finance & Accounting", tool1: "Shopify", tool2: "Xero",
    title: "Square vs Xero",
    description: "Incomplete description, Xero.",
    winner: "Shopify",
    verdict: "After thorough evaluation, Square emerges as our recommendation.",
    features: [{ name: "User Rating", tool1: true, tool2: false }],
    faqs: [{ question: "Which is better?", answer: "Based on the recorded comparison criteria, Square edges ahead." }]
  }), "utf8");
  await writeFile(path.join(dir, "good.json"), JSON.stringify({
    slug: "asana-vs-clickup", title: "Asana vs ClickUp",
    description: "Compare plan limits and workflow needs.",
    tool1: "Asana", tool2: "ClickUp", winner: null,
    verdict: "Choose by the work your team must complete.",
    features: [{ name: "Free plan team size", tool1: "2 users", tool2: "Unlimited members", tool1Detail: "Source A", tool2Detail: "Source B" }]
  }), "utf8");
  const result = spawnSync(process.execPath, [script, "--root", root], { encoding: "utf8", timeout: 10000 });
  assert.equal(result.status, 0, result.stderr || "audit script exited non-zero");
  const report = JSON.parse(result.stdout);
  assert.equal(report.filesScanned, 2);
  assert.equal(report.publishedFalseCount, 1);
  assert.ok(report.issueCount >= 3, JSON.stringify(report.counts));
  assert.ok(report.counts.template_verdict >= 1);
  assert.ok(report.counts.truncated_description >= 1, JSON.stringify(report.counts));
  assert.ok(report.counts.boolean_only_feature_table >= 1);
  assert.ok(report.counts.marked_unpublished >= 1);
  assert.ok(report.counts.possible_category_tool_mismatch >= 1, JSON.stringify(report.counts));
  process.stdout.write("PASS: comparison integrity audit fixture checks\\n");
} finally {
  await rm(root, { recursive: true, force: true });
}

#!/usr/bin/env node
/**
 * Read-only integrity scan for comparison records.
 * Usage: node scripts/audit-comparison-integrity.mjs [--root <repo-root>]
 * Reports suspicious template output; it does not rewrite content or assert facts.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : null;
}
const root = path.resolve(arg("--root") || process.cwd());
const contentRoot = path.join(root, "content", "comparisons");
async function walk(dir) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); }
  catch (error) { if (error?.code === "ENOENT") return []; throw error; }
  const result = [];
  for (const entry of entries) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await walk(file));
    else if (entry.isFile() && entry.name.endsWith(".json")) result.push(file);
  }
  return result;
}
const rules = [
  ["template_verdict", /after thorough evaluation|based on the recorded comparison criteria|recorded comparison criteria/i],
  ["self_referential_product_copy", /excels at\s+[A-Z][\w.-]*\s+is a|stronger for\s+[A-Z][\w.-]*\s+is a/i],
  ["generic_faq", /the best choice depends on your team|both platforms offer strong features|check our detailed review for support comparisons/i],
  ["truncated_description", /(?:,\\s*[A-Z][\\w.-]*\\.)(?:\\n|$)|(?:from\\s+\\$?[\\d.]+(?:–|-)\\$?[\\d.]+\\s*(?:\\/mo)?\\s*(?:\\+ fees)?[,]?\\s*[A-Z][\\w.-]*\\.)(?:\\n|$)/i],
  ["placeholder_or_unverified_claim", /our thorough evaluation|our hands-on testing|we tested both tools/i],
];
const files = (await walk(contentRoot)).sort();
const issues = [];
const invalidJson = [];
for (const file of files) {
  const relative = path.relative(root, file).split(path.sep).join("/");
  let data;
  try { data = JSON.parse(await readFile(file, "utf8")); }
  catch (error) { invalidJson.push({ file: relative, error: error.message }); continue; }
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    issues.push({ file: relative, slug: null, rule: "invalid_record", detail: "Expected a JSON object" });
    continue;
  }
  const text = [data.title, data.description, data.verdict, ...(Array.isArray(data.faqs) ? data.faqs.flatMap(x => [x?.question, x?.answer]) : [])]
    .filter(x => typeof x === "string").join("\n");
  for (const [rule, pattern] of rules) {
    if (pattern.test(text)) issues.push({ file: relative, slug: data.slug || null, rule, detail: rule });
  }
  if (Array.isArray(data.features) && data.features.length > 0 &&
      data.features.every(row => row && typeof row.tool1 === "boolean" && typeof row.tool2 === "boolean" &&
        !("tool1Detail" in row) && !("tool2Detail" in row))) {
    issues.push({ file: relative, slug: data.slug || null, rule: "boolean_only_feature_table", detail: "Feature rows contain only true/false values without supporting details" });
  }
  if (typeof data.tool1 === "string" && typeof data.tool2 === "string" &&
      typeof data.winner === "string" && ![data.tool1, data.tool2].some(name => name.toLowerCase().replace(/[^a-z0-9]/g, "") === data.winner.toLowerCase().replace(/[^a-z0-9]/g, ""))) {
    issues.push({ file: relative, slug: data.slug || null, rule: "winner_not_matching_tool", detail: "Winner slug does not normalize to either tool name; verify mapping" });
  }
}
const counts = Object.fromEntries([...new Set(issues.map(x => x.rule))].sort().map(rule => [rule, issues.filter(x => x.rule === rule).length]));
const report = {
  mode: "read-only heuristic; flags require human review and do not prove a factual error",
  filesScanned: files.length,
  invalidJsonCount: invalidJson.length,
  issueCount: issues.length,
  counts,
  sampleIssues: issues.slice(0, 40),
  invalidJson: invalidJson.slice(0, 20),
};
process.stdout.write(JSON.stringify(report, null, 2) + "\n");

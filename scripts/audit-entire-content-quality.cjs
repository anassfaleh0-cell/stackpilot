#!/usr/bin/env node
// Report-only cross-corpus quality audit. Never deletes, noindexes or rewrites content.
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "../content");
const groups = ["reviews","comparisons","guides","best","alternatives","use-cases","industries","blog","glossary","research","statistics","hubs"];
const findings = [];
const counts = {};
const normalize = s => String(s || "").replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim();
const words = s => normalize(s).split(/\s+/).filter(Boolean).length;
const patterns = [
  ["placeholder", /\b(?:lorem ipsum|test x|confirm with vendor|insert (?:text|content) here|coming soon|tbd)\b/i],
  ["unsupported-guarantee", /\b(?:guaranteed roi|guaranteed results|100% guaranteed)\b/i],
  ["broken-copy", /\b(?:undefined|null|\[object Object\])\b/i]
];
for (const group of groups) {
  const dir = path.join(root, group);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".json")).sort();
  counts[group] = files.length;
  for (const file of files) {
    let data;
    try { data = JSON.parse(fs.readFileSync(path.join(dir,file),"utf8")); }
    catch(e) { findings.push({group,file,issue:"invalid-json",detail:e.message}); continue; }
    const slug = data.slug || file.slice(0,-5);
    const fields = [];
    function walk(obj, key = "") {
      if (typeof obj === "string") { if (!/^(website|url|href|slug|image|icon|sourceUrl|link)$/i.test(key)) fields.push(obj); }
      else if (Array.isArray(obj)) obj.forEach(v => walk(v,key));
      else if (obj && typeof obj === "object") Object.entries(obj).forEach(([k,v]) => walk(v,k));
    }
    walk(data);
    const fullText = fields.join(" ");
    for (const [issue,re] of patterns) if (re.test(fullText)) findings.push({group,slug,issue});
    if (!normalize(data.title || data.name)) findings.push({group,slug,issue:"missing-title"});
    if (!normalize(data.description)) findings.push({group,slug,issue:"missing-description"});
    if (words(fullText) < 150) findings.push({group,slug,issue:"very-low-text-volume",words:words(fullText)});
    if (group === "reviews") {
      if (!(typeof data.rating === "number" && data.rating > 0 && data.rating <= 5)) findings.push({group,slug,issue:"missing-or-invalid-rating"});
      if (!Array.isArray(data.pros) || !data.pros.length || !Array.isArray(data.cons) || !data.cons.length) findings.push({group,slug,issue:"incomplete-pros-cons"});
      if (!Array.isArray(data.content) || !data.content.length) findings.push({group,slug,issue:"missing-review-body"});
    }
    if (group === "comparisons") {
      if (!normalize(data.verdict)) findings.push({group,slug,issue:"missing-verdict"});
      if (!normalize(data.winner)) findings.push({group,slug,issue:"missing-winner"});
      if (!Array.isArray(data.features) || data.features.length < 3) findings.push({group,slug,issue:"weak-feature-comparison"});
    }
  }
}
const byIssue = {};
for (const f of findings) byIssue[f.issue] = (byIssue[f.issue] || 0) + 1;
const report = {generatedAt:new Date().toISOString(),mode:"report-only",counts,byIssue,findings};
const output = process.argv[2];
if (output) fs.writeFileSync(output,JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify({counts,byIssue,totalFindings:findings.length,samples:findings.slice(0,35)},null,2));

#!/usr/bin/env node
// Report-only risk triage. No automatic rewrite, noindex, deletion or publication changes.
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "../content");
const groups = ["reviews","comparisons","guides","best","alternatives","use-cases","industries","hubs","blog","glossary","research","statistics"];
const findings = [];
const totals = {};
const check = (group, slug, issue, detail) => findings.push({group,slug,issue,detail});
const strip = value => String(value || "").replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim();
const count = value => strip(value).split(" ").filter(Boolean).length;
const suspicious = [
  ["unsupported-outcome-percentage", /\b(?:reduce[ds]?|saves?|improv(?:es|ed)|increas(?:es|ed)|achiev(?:es|ed))\b[^.!?]{0,100}\b\d+(?:\.\d+)?\s*%/i],
  ["unverified-speed-benchmark", /\b(?:load(?:s|ing)?|response|latency|api|dashboard)\b[^.!?]{0,100}\b\d+(?:[-–]\d+)?\s*(?:ms|seconds?|milliseconds?)\b/i],
  ["unsupported-review-methodology", /\b(?:tested \d+\+?|verified user reviews|independent audits show|based on hands-on testing)\b/i],
  ["malformed-amount", /(?:\bover\s{1,3}million\b|\bstarts? at\s*\.\d+|\bfrom\s+to\b)/i],
  ["generated-echo", /\bbest for \w+ is (?:best suited|ideal) for\b/i],
];
for (const group of groups) {
  const dir = path.join(root,group);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(x => x.endsWith(".json")).sort();
  totals[group] = files.length;
  for (const file of files) {
    let record;
    try { record=JSON.parse(fs.readFileSync(path.join(dir,file),"utf8")); }
    catch(e) { check(group,file,"invalid-json",String(e.message)); continue; }
    const slug=record.slug || file.slice(0,-5);
    const publishedFields=[record.description,record.tagline,record.verdict,record.pricingSummary,record.definition,record.extendedDefinition];
    if (Array.isArray(record.content)) publishedFields.push(...record.content.map(s=>s.body||""));
    if (Array.isArray(record.sections)) publishedFields.push(...record.sections.map(s=>s.body||""));
    if (Array.isArray(record.faqs)) publishedFields.push(...record.faqs.map(f=>f.answer||""));
    if (Array.isArray(record.pros)) publishedFields.push(...record.pros);
    if (Array.isArray(record.cons)) publishedFields.push(...record.cons);
    if (group === "best") {
      const picks=Array.isArray(record.picks)?record.picks:[];
      publishedFields.push(...picks.flatMap(p=>[p.bestFor,...(p.pros||[]),...(p.cons||[])]));
      // Only reviewed editorial text can be displayed; legacy body stays in source.
      if (typeof record.reviewedBody === "string") publishedFields.push(record.reviewedBody);
      else if (typeof record.body === "string") check(group,slug,"legacy-long-form-unreviewed","Long-form body exists but is not approved for rendering");
      if (!picks.length) check(group,slug,"empty-shortlist","");
      if (picks.some(p=>p.ratingVerified!==true && Number.isFinite(p.rating))) check(group,slug,"provisional-ranking","Stored numeric scores need evidence and visible provenance");
      if (!record.reviewedBody || count(record.reviewedBody)<250) check(group,slug,"long-form-review-needed","Add a substantively reviewed article before enabling legacy body rendering");
    }
    if (group === "reviews") {
      const sections=record.content||[];
      const titles=sections.map(s=>strip(s.title).toLowerCase()).filter(Boolean);
      if (titles.length!==new Set(titles).size) check(group,slug,"duplicate-section-headings","");
      if (!record.scoreBasis && Number.isFinite(record.rating)) check(group,slug,"score-provenance-missing","");
      if (record.ratingVerified!==true && Number.isFinite(record.rating)) check(group,slug,"rating-evidence-pending","");
    }
    if (group==="comparisons") {
      if (!strip(record.verdict)) check(group,slug,"missing-verdict","");
      if (!strip(record.winner)) check(group,slug,"missing-winner","");
    }
    const visible=publishedFields.filter(x=>typeof x==="string").join(" ");
    for (const [issue,pattern] of suspicious) if (pattern.test(visible)) check(group,slug,issue,"Review the precise claim and add dated primary evidence or replace with reproducible guidance");
    if (group!=="glossary" && !strip(record.description)) check(group,slug,"missing-description","");
    if (!strip(record.title || record.name || record.term)) check(group,slug,"missing-title","");
  }
}
const priority={"invalid-json":0,"missing-title":1,"missing-description":1,"missing-verdict":1,"unsupported-review-methodology":2,"unverified-speed-benchmark":2,"unsupported-outcome-percentage":2,"malformed-amount":2,"generated-echo":2,"legacy-long-form-unreviewed":3,"long-form-review-needed":3,"duplicate-section-headings":4};
findings.sort((a,b)=>(priority[a.issue]??8)-(priority[b.issue]??8)||a.group.localeCompare(b.group)||a.slug.localeCompare(b.slug));
const issueCounts={};for(const f of findings)issueCounts[f.issue]=(issueCounts[f.issue]||0)+1;
const report={generatedAt:new Date().toISOString(),reportOnly:true,totals,issueCounts,findings};
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify({totals,issueCounts,findings:findings.slice(0,50)},null,2));

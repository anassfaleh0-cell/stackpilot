const fs = require('fs');
const path = require('path');

const dirs = ['reviews', 'comparisons', 'guides', 'blog', 'glossary'];

const allContent = {};
for (const dir of dirs) {
  allContent[dir] = fs.readdirSync(path.join('content', dir))
    .filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join('content', dir, f), 'utf-8')));
}

const slugToName = {};
allContent['reviews'].forEach(r => slugToName[r.slug] = r.name);
allContent['comparisons'].forEach(c => slugToName[c.slug] = c.title);
allContent['guides'].forEach(g => slugToName[g.slug] = g.title);
allContent['blog'].forEach(b => slugToName[b.slug] = b.title);
allContent['glossary'].forEach(g => slugToName[g.slug] = g.term);

const incomingCounts = {};
const outgoingCounts = {};

for (const dir of dirs) {
  allContent[dir].forEach(item => {
    const slug = item.slug || (item.term ? item.term.toLowerCase().replace(/\s+/g, '-') : '');
    const key = dir + '::' + slug;
    outgoingCounts[key] = 0;

    const body = JSON.stringify(item).toLowerCase();

    for (const otherDir of dirs) {
      allContent[otherDir].forEach(other => {
        const otherSlug = other.slug || (other.term ? other.term.toLowerCase().replace(/\s+/g, '-') : '');
        if (slug === otherSlug && dir === otherDir) return;

        if (body.includes(otherSlug)) {
          const otherKey = otherDir + '::' + otherSlug;
          incomingCounts[otherKey] = (incomingCounts[otherKey] || 0) + 1;
          outgoingCounts[key] = (outgoingCounts[key] || 0) + 1;
        }
      });
    }
  });
}

console.log("=== PAGES WITH NO INCOMING INTERNAL LINKS (ORPHANS) ===");
const orphans = [];
for (const dir of dirs) {
  allContent[dir].forEach(item => {
    const slug = item.slug || (item.term ? item.term.toLowerCase().replace(/\s+/g, '-') : '');
    const key = dir + '::' + slug;
    const incoming = incomingCounts[key] || 0;
    if (incoming === 0) {
      const name = slugToName[slug] || slug;
      console.log('  ' + dir + '/' + slug + ' (' + name + ')');
      orphans.push({dir, slug, name});
    }
  });
}
if (orphans.length === 0) console.log("  (none found)");

console.log("\n=== PAGES WITH FEWEST INCOMING LINKS (< 3) ===");
for (const dir of dirs) {
  allContent[dir].forEach(item => {
    const slug = item.slug || (item.term ? item.term.toLowerCase().replace(/\s+/g, '-') : '');
    const key = dir + '::' + slug;
    const incoming = incomingCounts[key] || 0;
    if (incoming > 0 && incoming < 3) {
      const name = slugToName[slug] || slug;
      console.log('  ' + dir + '/' + slug + ' (' + name + '): ' + incoming + ' incoming links');
    }
  });
}

console.log("\n=== PAGES LINKING TO PRICING REPORT ===");
for (const dir of dirs) {
  allContent[dir].forEach(item => {
    const body = JSON.stringify(item).toLowerCase();
    if (body.includes('saas-pricing-report-2026')) {
      const name = slugToName[item.slug] || item.slug;
      console.log('  ' + dir + '/' + item.slug + ' (' + name + ')');
    }
  });
}

console.log("\n=== PRICING REPORT LINKS TO REVIEWS ===");
const report = allContent['blog'].find(b => b.slug === 'saas-pricing-report-2026');
if (report) {
  const body = JSON.stringify(report).toLowerCase();
  allContent['reviews'].forEach(r => {
    if (body.includes(r.slug)) {
      console.log('  ' + r.name);
    }
  });
}

console.log("\nDone.");

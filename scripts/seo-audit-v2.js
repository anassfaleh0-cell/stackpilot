const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.resolve('content');

function loadAll() {
  const dirs = [
    { name: 'reviews', type: 'review' },
    { name: 'comparisons', type: 'comparison' },
    { name: 'guides', type: 'guide' },
    { name: 'blog', type: 'blog' },
    { name: 'glossary', type: 'glossary' },
  ];
  const all = [];
  for (const { name, type } of dirs) {
    const dirPath = path.join(CONTENT_DIR, name);
    if (!fs.existsSync(dirPath)) continue;
    for (const file of fs.readdirSync(dirPath).filter(f => f.endsWith('.json'))) {
      const data = JSON.parse(fs.readFileSync(path.join(dirPath, file), 'utf-8'));
      all.push({ type, file: name + '/' + file, data });
    }
  }
  return all;
}

const pages = loadAll();
let issues = [];

// 1. Title audit — check actual titles from meta
console.log('=== TITLE QUALITY ===');
for (const page of pages) {
  const { data, type } = page;
  let title = '';
  if (type === 'review') title = data.name + ' Review 2026: Pricing, Features, Pros & Cons';
  else if (type === 'comparison') title = data.title + ' Comparison';
  else if (type === 'guide') title = data.title;
  else if (type === 'blog') title = data.title;
  else if (type === 'glossary') title = data.term + ' Definition & Best Practices';

  if (title.length > 65) issues.push({ sev: 'medium', msg: 'Title >65 chars: ' + page.file + ' (' + title.length + ' chars)' });
  if (title.length < 25 && type !== 'glossary') issues.push({ sev: 'high', msg: 'Title too short: ' + page.file + ': "' + title + '"' });
}

// 2. Description audit
console.log('\n=== DESCRIPTION QUALITY ===');
for (const page of pages) {
  const desc = page.data.description || page.data.definition || '';
  if (!desc) {
    issues.push({ sev: 'high', msg: 'MISSING description: ' + page.file });
    continue;
  }
  if (desc.length < 50) issues.push({ sev: 'medium', msg: 'Description too short (' + desc.length + ' chars): ' + page.file });
  if (desc.length > 165) issues.push({ sev: 'low', msg: 'Description >165 chars (' + desc.length + '): ' + page.file });
}

// 3. Category pages
console.log('\n=== CATEGORY PAGES ===');
const cats = {};
for (const page of pages) {
  if (page.data.category) {
    cats[page.data.category] = cats[page.data.category] || [];
    cats[page.data.category].push(page.type);
  }
}
console.log('Categories found: ' + Object.keys(cats).length);

// 4. Check for missing related content patterns
console.log('\n=== RELATED CONTENT GAPS ===');
const reviewNames = new Set(pages.filter(p => p.type === 'review').map(p => p.data.name.toLowerCase()));
const compSlugs = new Set(pages.filter(p => p.type === 'comparison').map(p => p.data.slug));

for (const page of pages) {
  const body = JSON.stringify(page.data).toLowerCase();
  // Check if review name mentioned in body but no relatedComparison link
  if (page.type === 'review') {
    const reviewName = page.data.name.toLowerCase();
    // Check if comparisons exist that reference this tool
    for (const comp of pages) {
      if (comp.type === 'comparison') {
        const compName = comp.data.title.toLowerCase();
        if (compName.includes(reviewName)) {
          const hasLink = (page.data.relatedComparisons || []).includes(comp.data.slug);
          if (!hasLink) {
            issues.push({ sev: 'medium', msg: 'Review "' + page.data.name + '" missing relatedComparison link to "' + comp.data.title + '"' });
          }
        }
      }
    }
  }
}

// 5. Duplicate meta detection
console.log('\n=== DUPLICATE METADATA ===');
const titlesSeen = {};
const descsSeen = {};
for (const page of pages) {
  let title = '';
  if (page.type === 'review') title = page.data.name + ' Review 2026: Pricing, Features, Pros & Cons';
  else if (page.type === 'comparison') title = page.data.title + ' Comparison';
  else if (page.type === 'guide') title = page.data.title;
  else if (page.type === 'blog') title = page.data.title;
  else if (page.type === 'glossary') title = page.data.term + ' Definition & Best Practices';

  const tLower = title.toLowerCase();
  if (titlesSeen[tLower]) {
    issues.push({ sev: 'high', msg: 'DUPLICATE TITLE: "' + title + '" in ' + page.file + ' and ' + titlesSeen[tLower] });
  }
  titlesSeen[tLower] = page.file;

  const desc = (page.data.description || page.data.definition || '').toLowerCase().trim();
  if (desc && desc.length > 20) {
    if (descsSeen[desc]) {
      issues.push({ sev: 'high', msg: 'DUPLICATE DESCRIPTION: "' + desc.slice(0, 60) + '..." in ' + page.file + ' and ' + descsSeen[desc] });
    }
    descsSeen[desc] = page.file;
  }
}

// 6. Cannibalization check
console.log('\n=== CANNIBALIZATION ===');
const toolPages = {};
for (const page of pages) {
  if (page.type === 'review') {
    const name = page.data.name.toLowerCase();
    toolPages[name] = toolPages[name] || [];
    toolPages[name].push({ type: 'review', file: page.file });
  }
}
for (const page of pages) {
  if (page.type === 'comparison' || page.type === 'guide' || page.type === 'blog') {
    const title = (page.data.title || '').toLowerCase();
    const body = JSON.stringify(page.data).toLowerCase();
    for (const [toolName, refs] of Object.entries(toolPages)) {
      if (title.includes(toolName) || (body.includes(toolName) && page.type !== 'blog')) {
        // Check if the comparison/blog has different intent from the review
        const isReview = refs.some(r => r.type === 'review');
        if (isReview && (page.type === 'comparison' || page.type === 'guide')) {
          const isDiff = page.data.description && page.data.description.length > 80;
          if (!isDiff) {
            issues.push({ sev: 'low', msg: 'Possible cannibalization: ' + page.file + ' may compete with review of "' + toolName + '"' });
          }
        }
      }
    }
  }
}

// Print issues sorted by severity
console.log('\n\n========== ALL ISSUES FOUND ==========');
const order = { high: 0, medium: 1, low: 2 };
issues.sort((a, b) => order[a.sev] - order[b.sev]);

const counts = { high: 0, medium: 0, low: 0 };
for (const issue of issues) {
  counts[issue.sev]++;
  console.log('[' + issue.sev.toUpperCase() + '] ' + issue.msg);
}

console.log('\n========== SUMMARY ==========');
console.log('High severity: ' + counts.high);
console.log('Medium severity: ' + counts.medium);
console.log('Low severity: ' + counts.low);
console.log('Total: ' + issues.length);

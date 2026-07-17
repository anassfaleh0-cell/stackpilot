const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.resolve('content');

// Phase 1: Extract all metadata from every content file
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
      all.push({ type, file, data });
    }
  }
  return all;
}

const pages = loadAll();

// Phase 2: Title audit
console.log('\n========== TITLE AUDIT ==========');
const titles = {};
const titleIssues = [];

for (const page of pages) {
  let title = '';
  const { data, type, file } = page;

  if (type === 'review') title = data.name + ' Review 2026: Pricing, Features, Pros & Cons';
  else if (type === 'comparison') title = data.title;
  else if (type === 'guide') title = data.title;
  else if (type === 'blog') title = data.title;
  else if (type === 'glossary') title = 'What Is ' + data.term + '? Definition, Examples & Best Practices';

  page.title = title;

  // Check for duplicates
  const lower = title.toLowerCase();
  if (titles[lower]) {
    titleIssues.push({ issue: 'DUPLICATE_TITLE', file, title, conflict: titles[lower] });
  }
  titles[lower] = file + ' (' + type + ')';

  // Check length
  if (title.length > 60) titleIssues.push({ issue: 'TITLE_TOO_LONG (>60 chars)', file, title, length: title.length });
  if (title.length < 20) titleIssues.push({ issue: 'TITLE_TOO_SHORT (<20 chars)', file, title, length: title.length });

  // Check keyword stuffing (repeating same word 3+ times)
  const words = title.toLowerCase().split(/\s+/);
  const freq = {};
  for (const w of words) {
    freq[w] = (freq[w] || 0) + 1;
  }
  for (const [word, count] of Object.entries(freq)) {
    if (word.length > 3 && count >= 3) {
      titleIssues.push({ issue: 'KEYWORD_STUFFING', file, title, word, count });
    }
  }
}

for (const issue of titleIssues) {
  console.log(`  [${issue.issue}] ${issue.file}: "${issue.title}"`);
}

console.log(`\nTitle issues: ${titleIssues.length}`);

// Phase 3: Description audit
console.log('\n========== DESCRIPTION AUDIT ==========');
const descIssues = [];
const descriptions = {};

for (const page of pages) {
  const desc = (page.data.description || '').trim();
  page.description = desc;

  if (!desc) {
    descIssues.push({ issue: 'MISSING_DESCRIPTION', file: page.file, type: page.type });
    continue;
  }

  const lower = desc.toLowerCase();
  if (descriptions[lower]) {
    descIssues.push({ issue: 'DUPLICATE_DESCRIPTION', file: page.file, type: page.type, desc: desc.slice(0, 80) });
  }
  descriptions[lower] = page.file;

  if (desc.length < 50) descIssues.push({ issue: 'DESCRIPTION_TOO_SHORT', file: page.file, length: desc.length });
  if (desc.length > 200) descIssues.push({ issue: 'DESCRIPTION_TOO_LONG', file: page.file, length: desc.length });

  // Check for generic starts
  const genericStarts = ['welcome to', 'learn about', 'discover how', 'find the best', 'a comprehensive'];
  for (const gs of genericStarts) {
    if (desc.toLowerCase().startsWith(gs)) {
      descIssues.push({ issue: 'GENERIC_DESCRIPTION_START', file: page.file, start: gs });
    }
  }
}

for (const issue of descIssues) {
  console.log(`  [${issue.issue}] ${issue.file}: ${issue.desc || '(empty)'}`);
}
console.log(`\nDescription issues: ${descIssues.length}`);

// Phase 4: Keyword cannibalization detection
console.log('\n========== CANNIBALIZATION AUDIT (by intent) ==========');
const cannibalIssues = [];

// Group pages by intent keyword
const intentKeywords = {
  'best': ['best', 'top', 'leading'],
  'review': ['review'],
  'vs': ['vs', 'versus', 'alternative'],
  'guide': ['guide', 'buyer', 'buyers', 'checklist'],
  'pricing': ['pricing', 'price', 'cost', 'affordable'],
  'what is': ['what is', 'definition'],
  'comparison': ['comparison', 'compared', 'compare'],
  '2026': ['2026'],
};

// Check for competing pages on similar tool names
const toolNameMap = {};
for (const page of pages) {
  if (page.type === 'review') {
    const name = page.data.name.toLowerCase();
    toolNameMap[name] = toolNameMap[name] || [];
    toolNameMap[name].push({ type: page.type, file: page.file, title: page.title, slug: page.data.slug });
  }
}

// Find review + comparison + guide combinations for the same tool
for (const page of pages) {
  if (page.type === 'review' || page.type === 'comparison' || page.type === 'guide') {
    const title = page.title.toLowerCase();
    const body = JSON.stringify(page.data).toLowerCase();

    // Check for 'vs' pages that compete
    for (const other of pages) {
      if (other.file === page.file) continue;
      const otherTitle = other.title.toLowerCase();

      // Same tool reviewed and compared
      if (page.type === 'review' && other.type === 'comparison') {
        const reviewTool = page.data.name.toLowerCase();
        if (otherTitle.includes(reviewTool)) {
          cannibalIssues.push({
            issue: 'REVIEW + COMPARISON COMPETE',
            file1: page.file + ' (' + page.type + ')',
            file2: other.file + ' (' + other.type + ')',
            topic: reviewTool
          });
        }
      }
    }
  }
}

// Check for duplicate intent by category
const intentGroups = {};
for (const page of pages) {
  const title = page.title.toLowerCase();
  const body = JSON.stringify(page.data).toLowerCase();

  for (const [intent, keywords] of Object.entries(intentKeywords)) {
    for (const kw of keywords) {
      if (title.includes(kw) || (intent === '2026' && body.includes('2026'))) {
        intentGroups[intent] = intentGroups[intent] || [];
        intentGroups[intent].push({ file: page.file, type: page.type, title: page.title });
        break;
      }
    }
  }
}

// Filter duplicate intent
for (const [intent, items] of Object.entries(intentGroups)) {
  // Group by category
  const byCategory = {};
  for (const item of items) {
    const cat = item.title.split(':')[0].toLowerCase().replace(/^(best|top|the)\s+/g, '').trim() || item.title;
    byCategory[cat] = byCategory[cat] || [];
    byCategory[cat].push(item);
  }

  for (const [cat, catItems] of Object.entries(byCategory)) {
    const types = [...new Set(catItems.map(i => i.type))];
    if (catItems.length >= 2 && types.length >= 2) {
      // Check if they're about the same general topic
      console.log(`  [COMPETING_${intent.toUpperCase()}] ${cat}: ${catItems.map(i => i.file + '(' + i.type + ')').join(', ')}`);
    }
  }
}

// Phase 5: Check page templates for heading structure
console.log('\n========== PAGE TEMPLATE HEADING AUDIT ==========');
const templateDir = path.resolve('src/app');
function walkDir(dir, depth = 0) {
  if (depth > 3) return;
  try {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (entry.name.startsWith('[') || entry.name === 'components' || entry.name === 'ui' || entry.name === 'seo' || entry.name === 'content') continue;
        walkDir(path.join(dir, entry.name), depth + 1);
      } else if (entry.name === 'page.tsx') {
        const content = fs.readFileSync(path.join(dir, entry.name), 'utf-8');
        const headingLevels = content.match(/<h[1-6]/g);
        if (headingLevels) {
          const dirName = path.relative(templateDir, dir);
          console.log(`  ${dirName}: used headings: ${headingLevels.join(', ')}`);
        }
      }
    }
  } catch {}
}
walkDir(templateDir);

// Phase 6: Summary
console.log('\n========== AUDIT SUMMARY ==========');
console.log(`Total pages analyzed: ${pages.length}`);
console.log(`  Reviews: ${pages.filter(p => p.type === 'review').length}`);
console.log(`  Comparisons: ${pages.filter(p => p.type === 'comparison').length}`);
console.log(`  Guides: ${pages.filter(p => p.type === 'guide').length}`);
console.log(`  Blog: ${pages.filter(p => p.type === 'blog').length}`);
console.log(`  Glossary: ${pages.filter(p => p.type === 'glossary').length}`);

// Extract all description lengths
const descLengths = pages.filter(p => p.description).map(p => p.description.length);
const avgDesc = descLengths.length ? Math.round(descLengths.reduce((a, b) => a + b, 0) / descLengths.length) : 0;
console.log(`\nDescription stats: avg=${avgDesc} chars, min=${Math.min(...descLengths)}, max=${Math.max(...descLengths)}`);

// Extract all title issues
const titleLenIssues = titleIssues.filter(i => i.issue.startsWith('TITLE'));
const descLenIssues = descIssues.filter(i => i.issue.startsWith('DESCRIPTION'));
console.log(`\nIssues found:`);
console.log(`  Title issues: ${titleIssues.length} (${titleLenIssues.length} length, ${titleIssues.filter(i => i.issue === 'DUPLICATE_TITLE').length} duplicate)`);
console.log(`  Description issues: ${descIssues.length} (${descLenIssues.length} length, ${descIssues.filter(i => i.issue === 'DUPLICATE_DESCRIPTION').length} duplicate)`);
console.log(`  Cannibalization: check output above`);

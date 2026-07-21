const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, 'content/comparisons');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

const boilerplate = [];
const unique = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), 'utf-8');
  let desc;
  try {
    const json = JSON.parse(content);
    desc = json.description || '';
  } catch {
    desc = '<PARSE ERROR>';
  }
  const slug = file.replace(/\.json$/, '');
  const isBoilerplate = /^Comprehensive \w+ vs \w+ comparison for 2026/.test(desc);
  if (isBoilerplate) {
    boilerplate.push({ slug, description: desc });
  } else {
    unique.push({ slug, description: desc });
  }
}

console.log('========================================');
console.log('BOILERPLATE DESCRIPTIONS (starts with "Comprehensive ... vs ... comparison for 2026")');
console.log(`Count: ${boilerplate.length}`);
console.log('========================================');
boilerplate.forEach(({ slug, description }) => {
  console.log(`\n[${slug}]`);
  console.log(`  ${description}`);
});

console.log('\n\n');
console.log('========================================');
console.log('UNIQUE / MANUAL DESCRIPTIONS');
console.log(`Count: ${unique.length}`);
console.log('========================================');
unique.forEach(({ slug, description }) => {
  console.log(`\n[${slug}]`);
  console.log(`  ${description}`);
});

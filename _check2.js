const fs = require('fs');
const d = fs.readFileSync('_gen-enterprise.js', 'utf8');
const lines = d.split('\n');

// Let's extract line 147 and check it character by character
const raw = lines[146]; // 0-indexed
console.log('Line length:', raw.length);
// Count braces
const opens = (raw.match(/\{/g) || []).length;
const closes = (raw.match(/\}/g) || []).length;
console.log('{ :', opens, '} :', closes);
const btOpen = (raw.match(/\`/g) || []).length;
console.log('backticks:', btOpen);
const parOpen = (raw.match(/\(/g) || []).length;
const parClose = (raw.match(/\)/g) || []).length;
console.log('( :', parOpen, ') :', parClose);
const brackOpen = (raw.match(/\[/g) || []).length;
const brackClose = (raw.match(/\]/g) || []).length;
console.log('[ :', brackOpen, '] :', brackClose);

// Check which character positions have issues
// Find all occurrences of ${ and } and track nesting

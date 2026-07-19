const fs = require('fs');
const d = fs.readFileSync('_gen-enterprise.js', 'utf8');
const lines = d.split('\n');

// Extract the genRS function body (lines 134-183)
const genRSLines = lines.slice(134, 184);  // 0-indexed
// Try to syntax check each section one by one
let current = genRSLines[0];
for (let i = 1; i < genRSLines.length; i++) {
  current += '\n' + genRSLines[i];
  try {
    new Function(current + '\nreturn genRS;');
  } catch(e) {
    console.log('Syntax error at line ' + (135 + i) + ': ' + e.message);
    break;
  }
}
console.log('All lines in genRS OK');

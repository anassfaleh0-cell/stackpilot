const fs = require('fs');
let d = fs.readFileSync('_gen-enterprise.js', 'utf8');

// Replace all broken patterns
// Pattern 1: lk(NUM,E2) -> lk(NUM),E2
d = d.replace(/lk\((\d+),E2\)/g, 'lk($1),E2)');
// Pattern 2: lk(NUM),E2} -> lk(NUM),E2)
d = d.replace(/lk\((\d+)\),E2\}/g, 'lk($1),E2)}');
// Pattern 3: E2} (without exp close paren) -> E2) }  (but this is too broad)
// Better approach: find all exp( calls and fix their closing
// Let me find all lines with E2 that should be E2)
const lines = d.split('\n');
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  if (l.includes('E2') && !l.includes('const E2=')) {
    // Check if E2 is at the end of exp() call
    // If followed by } or , without ), fix it
    lines[i] = l.replace(/E2(\s*[},])/g, 'E2)$1');
  }
}
d = lines.join('\n');

// Now remove the extra ) that might have been added
// Also clean up any doubled ))
d = d.replace(/E2\)\)/g, 'E2)');

fs.writeFileSync('_gen-enterprise.js', d);
console.log('Fixed E2 patterns');

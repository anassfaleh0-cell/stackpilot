const fs = require('fs');
let d = fs.readFileSync('_gen-enterprise.js', 'utf8');
// Fix pattern: lk(NUMBER,E2) -> lk(NUMBER),E2)
let count=0;
d = d.replace(/lk\((\d+),E2\)/g, (m, n) => { count++; return 'lk('+n+'),E2)'; });
console.log('Fixed', count, 'lk calls');
// Also fix any remaining ),E2) that's actually ,E2) (the ), was already consumed)
fs.writeFileSync('_gen-enterprise.js', d);

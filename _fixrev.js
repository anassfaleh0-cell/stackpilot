const fs = require('fs');
let d = fs.readFileSync('_gen-enterprise.js', 'utf8');

// Remove E from genRS exp() calls: ),E) at end of exp() arguments where second arg is lk(N)
// Pattern: ],lk(N),E) -> ],lk(N))
let count = 0;
d = d.replace(/\],lk\(\d+\),E\)/g, (m) => { count++; return m.replace(',E', ''); });
console.log('Fixed', count, 'exp() calls in genRS');

// Also fix the genRS E array - remove it since it's no longer needed there
// Actually genRS still defines E but nothing uses it. Clean up.
d = d.replace(/  const E=\[.*?\n  \]/, (m) => { return '  /* E array removed */'; });

fs.writeFileSync('_gen-enterprise.js', d);
console.log('Done');

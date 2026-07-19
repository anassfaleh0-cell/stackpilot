const fs = require('fs');
try {
  require('child_process').execSync('node --check _gen-enterprise.js 2>&1', {encoding:'utf8', stdio:'pipe'});
} catch(e) {
  const lines = e.stderr.split('\n');
  lines.forEach(l => {
    if (l.includes('SyntaxError') || l.includes('^')) console.log(l);
  });
  // Find the line mentioned
  for (const l of lines) {
    if (l.includes('_gen-enterprise.js:')) {
      const match = l.match(/:(\d+)/);
      if (match) {
        const lineNum = parseInt(match[1]);
        const content = fs.readFileSync('_gen-enterprise.js', 'utf8').split('\n');
        console.log('LINE ' + lineNum + ': ' + content[lineNum - 1]);
      }
    }
  }
}

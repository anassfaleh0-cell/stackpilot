const fs = require('fs');
let d = fs.readFileSync('_gen-enterprise.js', 'utf8');

// In genBest/genIndustry/genUseCase, rename const E= to const E2=
// Find the pattern: after function genBest/Industry/UseCase and before const sections=
// Replace const E=... with const E2=... only in those functions
const funcs = ['genBest', 'genIndustry', 'genUseCase'];
for (const f of funcs) {
  const start = d.indexOf('function ' + f + '(');
  const endMarker = f === 'genBest' ? '// INDUSTRY' : f === 'genIndustry' ? '// USE CASE' : '// EXECUTION';
  const end = d.indexOf(endMarker, start);
  const funcBody = d.slice(start, end);
  const newFuncBody = funcBody.replace(/const E=/g, 'const E2=');
  d = d.slice(0, start) + newFuncBody + d.slice(end);
}

fs.writeFileSync('_gen-enterprise.js', d);
console.log('Renamed E to E2 in genBest/genIndustry/genUseCase');

const d=require('fs').readFileSync('_gen-enterprise.js','utf8');
console.log('Has 4500:', d.includes('4500+ words'));
console.log('Has 250 links:', d.includes(',250,t.slug)'));
console.log('Has Enterprise deployments:', d.includes('Enterprise deployments'));
const lines=d.split('\n');
console.log('Line 232:', lines[231].trim().slice(0,60));
console.log('Line 242:', lines[241].trim().slice(0,60));

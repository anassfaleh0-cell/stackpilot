const d=require('fs').readFileSync('_gen-enterprise.js','utf8');
// Find exp() calls in genBest
const gb=d.indexOf('function genBest');
const gi=d.indexOf('function genIndustry');
const section=d.slice(gb, gi);
// Find all exp( calls
const calls=section.match(/exp\([^)]+\)/g)||[];
calls.forEach((c,i)=>console.log(i+': '+c.slice(0,80)));
console.log('Total exp calls in genBest:', calls.length);

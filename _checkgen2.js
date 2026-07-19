const d=require('fs').readFileSync('_gen-enterprise.js','utf8');
console.log('Count of function genBest:', (d.match(/function genBest/g)||[]).length);
console.log('Count of function genIndustry:', (d.match(/function genIndustry/g)||[]).length);
console.log('Count of function genUseCase:', (d.match(/function genUseCase/g)||[]).length);
console.log('Count of 250 links:', (d.match(/,250,t\.slug\)/g)||[]).length);
console.log('Count of 180 links:', (d.match(/,180,t\.slug\)/g)||[]).length);
console.log('Count of const E=', (d.match(/const E=/g)||[]).length);

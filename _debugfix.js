const fs = require('fs');
let d = fs.readFileSync('_gen-enterprise.js', 'utf8');

const gbStart = d.indexOf('// BEST PAGE GENERATOR (6000+ words)');
const gbEnd = d.indexOf('// INDUSTRY PAGE GENERATOR (4500-6000 words)');

console.log('gbStart:', gbStart);
console.log('gbEnd:', gbEnd);
console.log('Section length:', gbEnd - gbStart);
console.log('Before replace, char at gbStart:', d.charCodeAt(gbStart));
console.log('Before replace, char at gbEnd-1:', d.charCodeAt(gbEnd-1));
console.log('First line:', d.slice(gbStart, gbStart+100));
console.log('Last line before gbEnd:', d.slice(gbEnd-100, gbEnd));

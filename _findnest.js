const d=require('fs').readFileSync('_gen-enterprise.js','utf8');
const lines=d.split('\n');
lines.forEach((l,i)=>{
  if(!l.includes('`')||!l.includes('${'))return;
  const opens=(l.match(/\$\{/g)||[]).length;
  const backticks=(l.match(/`/g)||[]).length;
  if(opens>2) console.log((i+1)+': opens='+opens+' bt='+backticks+' '+l.trim().slice(0,100));
});

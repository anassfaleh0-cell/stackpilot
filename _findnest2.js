const d=require('fs').readFileSync('_gen-enterprise.js','utf8');
const lines=d.split('\n');
lines.forEach((l,i)=>{
  // Find lines where a template literal `${...}` contains a "..." string which itself contains `${`
  const bt=l.split('`');
  if(bt.length<3) return;
  // Check if any "..." between two ` characters contains ${
  let inTmpl=false;
  for(let j=0;j<bt.length;j++){
    if(!inTmpl){inTmpl=true;continue}
    const section=bt[j];
    // section is between two backticks
    // Find ${...} groups and check if they contain "${" inside
    const exprs=section.split('${');
    for(let k=1;k<exprs.length;k++){
      let expr=exprs[k];
      // Find matching }
      let depth=1;
      let pos=0;
      while(depth>0&&pos<expr.length){
        if(expr[pos]==='{') depth++;
        else if(expr[pos]==='}') depth--;
        pos++;
      }
      if(depth===0){
        const inner=expr.slice(0,pos-1);
        if(inner.includes('"${')){
          console.log('LINE '+(i+1)+': nested ${ in string: '+inner.slice(0,80));
        }
      }
    }
    inTmpl=false;
  }
});

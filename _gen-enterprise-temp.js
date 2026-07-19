// Link builder
function blinks(cat,slug,n,seed) {
  const l=[], u=new Set()
  const cr=CAT.R.filter(r=>r.cat===cat&&r.slug!==slug)
  for(const r of pickN(cr,Math.ceil(n*0.25),seed+"-r")){if(u.size>=n)break;u.add(r.slug);l.push('<a href="/reviews/'+r.slug+'">'+r.name+'</a>')}
  for(const r of pickN(CAT.R.filter(r=>r.cat!==cat&&r.slug!==slug),Math.ceil(n*0.1),seed+"-or")){if(u.size>=n)break;u.add(r.slug);l.push('<a href="/reviews/'+r.slug+'">'+r.name+'</a>')}
  const tc=CAT.C.filter(c=>c.slug.includes(slug)||c.slug.includes(slug.replace(/-/g,"")))
  for(const c of pickN(tc,Math.ceil(n*0.1),seed+"-c")){if(u.size>=n)break;u.add(c.slug);l.push('<a href="/comparisons/'+c.slug+'">comparison</a>')}
  for(const b of pickN(CAT.B.filter(b=>b.cat===cat),Math.ceil(n*0.08),seed+"-b")){if(u.size>=n)break;u.add(b.slug);l.push('<a href="/best/'+b.slug+'">best '+cat.toLowerCase()+'</a>')}
  for(const b of pickN(CAT.B.filter(b=>b.cat!==cat),Math.ceil(n*0.05),seed+"-ob")){if(u.size>=n)break;u.add(b.slug);l.push('<a href="/best/'+b.slug+'">guide</a>')}
  for(const i of pickN(CAT.I,Math.ceil(n*0.08),seed+"-i")){if(u.size>=n)break;u.add(i.slug);l.push('<a href="/industries/'+i.slug+'">'+i.name+' software</a>')}
  const cu=CAT.U.filter(u=>u.cat===cat)
  for(const uu of pickN(cu,Math.ceil(n*0.05),seed+"-u")){if(u.size>=n)break;u.add(uu.slug);l.push('<a href="/use-cases/'+uu.slug+'">use case</a>')}
  for(const g of pickN(CAT.G,Math.ceil(n*0.05),seed+"-g")){if(u.size>=n)break;u.add(g.slug);l.push('<a href="/guides/'+g.slug+'">guide</a>')}
  const cs=CAT.S.filter(s=>cat.includes(s.cat)||s.cat.includes(cat))
  for(const s of pickN(cs,Math.ceil(n*0.05),seed+"-s")){if(u.size>=n)break;u.add(s.slug);l.push('<a href="/statistics/'+s.slug+'">statistics</a>')}
  for(const g of pickN(CAT.GL,Math.ceil(n*0.03),seed+"-gl")){if(u.size>=n)break;u.add(g.slug);l.push('<a href="/glossary/'+g.slug+'">glossary</a>')}
  return l
}
function sec(paras,links) {
  let idx=0;const h=crypto.createHash("md5")
  return paras.map(p=>{
    const n=2+Math.abs(h.update(p).digest().readUInt32BE(0))%3;let t=p
    for(let i=0;i<n&&idx<links.length;i++){
      const pos=30+Math.abs(crypto.createHash("md5").update(t+idx).digest().readUInt32BE(0))%Math.min(70,Math.max(10,t.length-50))
      t=t.slice(0,pos)+". "+links[idx]+". "+t.slice(pos);idx++
    }return t
  }).join(" ")
}

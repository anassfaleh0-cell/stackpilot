const fs=require('fs'),p=require('path'),CD=p.resolve('content');
const slugs=['claude','gemini','perplexity','copilot','discord','google-meet','adobe-xd','adobe-express','bitbucket','podman','cloudflare-pages','appwrite','logrocket','datadog','sourceforge','containerd','matomo','fullstory','freshdesk','sage','square','paypal','woocommerce','bigcommerce','moz','convertkit','activecampaign','cal-com','jotform','acuity','n8n','lastpass','dashlane','wordpress','wix','vimeo-record','vidyard','webex','integromat'];
let rwc=0;
slugs.forEach(s=>{
  try{
    const j=JSON.parse(fs.readFileSync(p.join(CD,'reviews',s+'.json'),'utf8'));
    rwc+=j.body?j.body.split(/\s+/).length:0;
  }catch(e){}
});
console.log('39 reviews avg: '+Math.round(rwc/slugs.length)+' words');

// All best/industries/use-cases
['best','industries','use-cases'].forEach(d=>{
  let w=0,c=0;
  fs.readdirSync(p.join(CD,d)).filter(f=>f.endsWith('.json')).forEach(fn=>{
    const j=JSON.parse(fs.readFileSync(p.join(CD,d,fn),'utf8'));
    w+=j.body?j.body.split(/\s+/).length:0;c++;
  });
  console.log(d+': '+c+' files, avg '+Math.round(w/c)+' words');
});

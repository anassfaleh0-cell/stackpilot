const x = "test";
const c = "category";
const slug = "test-slug";
// Test nested template inside string inside template expression
const r = `${true ? "hello ${c} world" : "no"} ${slug}`;
console.log(r);

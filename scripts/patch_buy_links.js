const fs = require('fs');
const path = require('path');
const exts = new Set(['.tsx','.ts','.jsx','.js','.mdx']);

function walk(dir, out=[]) {
  for (const e of fs.readdirSync(dir, {withFileTypes:true})) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['node_modules','.next','.vercel','.git'].includes(e.name)) continue;
      walk(p, out);
    } else if (exts.has(path.extname(e.name))) out.push(p);
  }
  return out;
}

const files = walk(process.cwd());
let changed = 0;

for (const f of files) {
  let s = fs.readFileSync(f,'utf8');
  const o = s;

  // /products/<slug> -> /api/checkout?slug=<slug>
  s = s.replace(/href="\/products\/([a-z0-9\-]+)"/gi, 'href="/api/checkout?slug=$1"');
  s = s.replace(/href=\{["']\/products\/([a-z0-9\-]+)["']\}/gi, 'href={`/api/checkout?slug=$1`}');
  s = s.replace(/href=\{`\/products\/\$\{([^}]+)\}`\}/g, 'href={`\/api\/checkout?slug=\${$1}` }');

  // any legacy embedded/buy endpoints on anchors
  s = s.replace(/href="\/api\/embedded-checkout[^"]*"/g, 'href="/api/checkout?slug=10-quick-codes"');

  if (s !== o) { fs.writeFileSync(f,s); console.log('patched:', f); changed++; }
}
console.log(`Done. Patched ${changed} file(s).`);

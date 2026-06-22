#!/usr/bin/env node

// Checa links internos (base path /gb-kb) no site já buildado em dist/.
// Roda DEPOIS de `npm run build`. Ignora links externos, âncoras e mailto.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, '../dist');
const BASE = '/gb-kb';

if (!fs.existsSync(DIST)) {
  console.error('❌ dist/ não encontrado. Rode `npm run build` antes.');
  process.exit(1);
}

function walk(dir, acc = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, acc);
    else if (f.endsWith('.html')) acc.push(p);
  }
  return acc;
}

// Mapeia um href /gb-kb/... para o arquivo esperado dentro de dist/
function resolveTarget(href) {
  let rel = href.slice(BASE.length).split('#')[0].split('?')[0];
  rel = rel.replace(/^\//, '');
  if (rel === '') return path.join(DIST, 'index.html');
  const candidate = path.join(DIST, rel);
  // Link com extensão (asset) → arquivo direto; senão, link de diretório → index.html
  return path.extname(rel) ? candidate : path.join(candidate, 'index.html');
}

const htmlFiles = walk(DIST);
const hrefRe = /(?:href|src)="([^"]+)"/g;
const broken = [];

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf-8');
  let m;
  while ((m = hrefRe.exec(html)) !== null) {
    const href = m[1];
    if (!href.startsWith(BASE)) continue; // só links internos do site
    const target = resolveTarget(href);
    if (!fs.existsSync(target)) {
      broken.push({
        from: path.relative(DIST, file),
        href,
        expected: path.relative(DIST, target),
      });
    }
  }
}

console.log(`🔗 Checando links internos em ${htmlFiles.length} páginas...\n`);

if (broken.length > 0) {
  console.log(`❌ ${broken.length} link(s) interno(s) quebrado(s):\n`);
  for (const b of broken) {
    console.log(`   ${b.from}\n      → ${b.href}  (esperado: ${b.expected})`);
  }
  process.exit(1);
}

console.log('✅ Todos os links internos resolvem.');

// Checks the built site against the brief's measurable rules.
// Run after `npm run build`:  npm run check
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { readTokens } from '../src/lib/tokens.mjs';

const dist = new URL('../dist/', import.meta.url).pathname;
const only = process.argv[2]; // optional: words | scripts | links | contrast
const pages = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.html')) pages.push(p);
  }
})(dist);
const rel = (p) => '/' + p.slice(dist.length).replace(/index\.html$/, '');
let problems = 0;

if (!only || only === 'words') {
  console.log('\n# words not in the vocabulary (project, blog, post, article, case study)');
  for (const p of pages) {
    const html = readFileSync(p, 'utf8');
    // visible text, plus text people meet in attributes (descriptions, labels, titles)
    const attrs = [...html.matchAll(/(?:content|aria-label|alt|title)="([^"]*)"/g)].map((m) => m[1]).join(' . ');
    const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/g, ' ') + ' . ' + attrs;
    const hits = text.match(/[^.]{0,40}\b(projects?|blog|posts?|articles?|case stud(y|ies))\b[^.]{0,30}/gi);
    if (hits) for (const h of hits) console.log(`  ${rel(p)}: ...${h.trim().replace(/\s+/g, ' ')}...`);
  }
}

if (!only || only === 'scripts') {
  console.log('\n# client script tags per page (only the map may have one)');
  for (const p of pages) {
    const n = (readFileSync(p, 'utf8').match(/<script\b(?![^>]*type="application\/ld\+json")/g) || []).length;
    const ok = rel(p) === '/' ? n <= 1 : n === 0;
    if (!ok) problems++;
    console.log(`  ${ok ? 'ok ' : 'BAD'} ${rel(p)}: ${n}`);
  }
}

if (!only || only === 'links') {
  console.log('\n# internal links that lead nowhere');
  const seen = new Set();
  for (const p of pages) {
    for (const [, href] of readFileSync(p, 'utf8').matchAll(/href="(\/[^"#?]*)/g)) {
      if (seen.has(href)) continue;
      seen.add(href);
      const target = join(dist, href);
      const found = existsSync(target) && (statSync(target).isFile() || existsSync(join(target, 'index.html')));
      if (!found) {
        console.log(`  missing: ${href}  (first seen on ${rel(p)})`);
        if (href !== '/resume.pdf') problems++;
      }
    }
  }
}

if (!only || only === 'blanks') {
  console.log('\n# visible blanks left for the owner, per page');
  for (const p of pages) {
    const text = readFileSync(p, 'utf8').replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/g, ' ');
    const blanks = text.match(/\[[A-Z][A-Z0-9 ,:'.\-]{2,}[^\]]*\]/g) || [];
    if (blanks.length) console.log(`  ${rel(p)}: ${blanks.length}  ${[...new Set(blanks)].slice(0, 4).join(' ')}${blanks.length > 4 ? ' ...' : ''}`);
  }
  console.log('\n# entries marked written that still hold blanks');
  const dir = new URL('../src/content/entries/', import.meta.url).pathname;
  for (const f of readdirSync(dir)) {
    const src = readFileSync(join(dir, f), 'utf8');
    if (/\nstate:\s*written/.test(src) && /\[[A-Z]{2,}/.test(src)) console.log(`  ${f} is marked written but still has blanks`);
  }
}

if (!only || only === 'contrast') {
  console.log('\n# contrast of each text colour on each ground (need 4.5, or 3 for large text)');
  const tok = readTokens(new URL('..', import.meta.url).pathname);
  const lum = (hex) => {
    const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
  for (const bg of ['ground', 'ground-raised']) {
    for (const fg of ['text', 'text-soft', 'text-quiet', 'accent', 'seed', 'entry', 'link', 'link-seed', 'link-entry', 'link-hover', 'principle-ink', 'margin-ink', 'focus']) {
      if (!/^#[0-9A-Fa-f]{6}$/.test(tok[fg] ?? '')) { problems++; console.log(`  ??? ${fg} is not a plain colour: ${tok[fg]}`); continue; }
      const r = ratio(tok[fg], tok[bg]);
      if (r < 4.5) problems++;
      console.log(`  ${r >= 4.5 ? 'ok ' : 'LOW'} ${fg} on ${bg}: ${r.toFixed(2)}`);
    }
  }
}

if (process.env.CHECK_DEPLOY) {
  console.log('\n# address');
  const local = pages.filter((p) => readFileSync(p, 'utf8').includes('localhost'));
  if (local.length) { problems++; console.log(`  BAD SITE_URL is unset: ${local.length} page(s) point at localhost`); } else console.log('  ok');
}

console.log(problems ? `\n${problems} problem(s).` : '\nAll checks pass.');
process.exit(problems ? 1 : 0);

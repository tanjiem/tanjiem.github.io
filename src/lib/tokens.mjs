// Reads colour tokens from src/styles/tokens.css at build time, following
// var() aliases, so things drawn outside CSS (share images, the favicon, the
// browser's theme colour, the contrast check) use the same one-line values.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export function readTokens(root = process.cwd()) {
  const css = readFileSync(join(root, 'src/styles/tokens.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const raw = Object.fromEntries([...css.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
  const resolve = (name, depth = 0) => {
    const v = raw[name];
    if (v === undefined || depth > 10) return undefined;
    const alias = v.match(/^var\(--([\w-]+)\)$/);
    return alias ? resolve(alias[1], depth + 1) : v;
  };
  return Object.fromEntries(Object.keys(raw).map((k) => [k, resolve(k)]));
}

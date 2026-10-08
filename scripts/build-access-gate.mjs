/**
 * Build the access gate: minify, hash, stamp.
 *
 * The readable source lives at assets/src/access-gate.js. This writes the minified file
 * to assets/access-gate.js and rewrites every page's ?v= query with its content hash,
 * because Cloudflare serves these with max-age=14400 - an unversioned edit stays
 * invisible to browsers for four hours.
 *
 * Run it after ANY edit to the source:  node scripts/build-access-gate.mjs
 *
 * This repo has no node_modules of its own, so esbuild is borrowed from the sibling
 * xauusdrobot checkout; set ESBUILD_FROM to override.
 */
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'assets', 'src', 'access-gate.js');
const OUT = path.join(ROOT, 'assets', 'access-gate.js');

const host = process.env.ESBUILD_FROM
  || path.resolve(ROOT, '..', 'xauusdrobot', 'package.json');
let buildSync;
try {
  ({ buildSync } = createRequire(host)('esbuild'));
} catch {
  console.error('esbuild not found. Point ESBUILD_FROM at a package.json that has it,\n'
    + 'for example:  ESBUILD_FROM="../xauusdrobot/package.json" node scripts/build-access-gate.mjs');
  process.exit(1);
}

buildSync({ entryPoints: [SRC], outfile: OUT, minify: true, target: 'es2017', legalComments: 'none' });

const bytes = fs.readFileSync(OUT);
const hash = createHash('md5').update(bytes).digest('hex').slice(0, 8);
console.log(`minified ${fs.statSync(SRC).size} -> ${bytes.length} bytes, hash ${hash}`);

const pages = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '.git' || e.name === 'images' || e.name === 'src') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) pages.push(p);
  }
};
walk(ROOT);

let stamped = 0;
for (const p of pages) {
  const s = fs.readFileSync(p, 'utf8');
  const out = s.replace(/\/assets\/access-gate\.js(\?v=[0-9a-f]+)?/g, `/assets/access-gate.js?v=${hash}`);
  if (out !== s) {
    fs.writeFileSync(p, out);
    stamped++;
  }
}
console.log(`stamped ${stamped} pages with ?v=${hash}`);

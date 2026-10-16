/**
 * Build and version every mutable asset, then stamp the references site-wide.
 *
 * Cloudflare serves /assets/* with max-age=14400. redesign.css, redesign.js and
 * motion.js were referenced with no ?v= at all on all 63 inner pages, so any edit to
 * them stayed invisible to returning visitors for four hours - and there was no way to
 * push one out short of renaming the file. The hash in the query makes a deploy land
 * the moment it ships.
 *
 * Run it after ANY edit to an asset listed in STAMP:  node scripts/build-assets.mjs
 *
 * access-gate.js has its own script (build-access-gate.mjs) because it is built from
 * assets/src and stamped the same way; this one leaves it alone.
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
const ASSETS = path.join(ROOT, 'assets');

// built from a readable source before hashing
const BUILD = [{ src: path.join(ASSETS, 'src', 'obsidian.js'), out: path.join(ASSETS, 'obsidian.js') }];
// hashed and stamped wherever they are referenced
const STAMP = ['obsidian.css', 'obsidian.js', 'redesign.css', 'redesign.js', 'motion.js', 'motion.css', 'lower.css'];

const host = process.env.ESBUILD_FROM || path.resolve(ROOT, '..', 'xauusdrobot', 'package.json');
let buildSync;
try {
  ({ buildSync } = createRequire(host)('esbuild'));
} catch {
  console.error('esbuild not found. Point ESBUILD_FROM at a package.json that has it,\n'
    + 'for example:  ESBUILD_FROM="../xauusdrobot/package.json" node scripts/build-assets.mjs');
  process.exit(1);
}

for (const { src, out } of BUILD) {
  if (!fs.existsSync(src)) continue;
  buildSync({ entryPoints: [src], outfile: out, minify: true, target: 'es2017', legalComments: 'none' });
  console.log(`built ${path.basename(out)}: ${fs.statSync(src).size} -> ${fs.statSync(out).size} bytes`);
}

const hashes = {};
for (const name of STAMP) {
  const p = path.join(ASSETS, name);
  if (!fs.existsSync(p)) continue;
  hashes[name] = createHash('md5').update(fs.readFileSync(p)).digest('hex').slice(0, 8);
}

const pages = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'assets', 'images', 'scripts', 'node_modules'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) pages.push(p);
  }
};
walk(ROOT);

const touched = {};
let stamped = 0;
for (const p of pages) {
  const before = fs.readFileSync(p, 'utf8');
  let s = before;
  for (const [name, hash] of Object.entries(hashes)) {
    const re = new RegExp(`/assets/${name.replace('.', '\\.')}(\\?v=[0-9a-f]+)?`, 'g');
    s = s.replace(re, () => {
      touched[name] = (touched[name] || 0) + 1;
      return `/assets/${name}?v=${hash}`;
    });
  }
  if (s !== before) {
    fs.writeFileSync(p, s);
    stamped++;
  }
}

for (const [name, hash] of Object.entries(hashes)) {
  console.log(`  ${name.padEnd(14)} v=${hash}  ${touched[name] || 0} references`);
}
console.log(`stamped ${stamped} of ${pages.length} pages`);

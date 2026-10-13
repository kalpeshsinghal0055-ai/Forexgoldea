/**
 * Build the homepage assets: minify obsidian.js, hash it and obsidian.css, stamp index.html.
 *
 * The readable source lives at assets/src/obsidian.js. Cloudflare serves these with
 * max-age=14400, so an edit without a fresh ?v= stays invisible to browsers for four
 * hours - the hash is what makes a deploy land immediately.
 *
 * Run it after ANY edit to obsidian.js or obsidian.css:  node scripts/build-home.mjs
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
const SRC = path.join(ROOT, 'assets', 'src', 'obsidian.js');
const JS = path.join(ROOT, 'assets', 'obsidian.js');
const CSS = path.join(ROOT, 'assets', 'obsidian.css');
const PAGE = path.join(ROOT, 'index.html');

const host = process.env.ESBUILD_FROM
  || path.resolve(ROOT, '..', 'xauusdrobot', 'package.json');
let buildSync;
try {
  ({ buildSync } = createRequire(host)('esbuild'));
} catch {
  console.error('esbuild not found. Point ESBUILD_FROM at a package.json that has it,\n'
    + 'for example:  ESBUILD_FROM="../xauusdrobot/package.json" node scripts/build-home.mjs');
  process.exit(1);
}

buildSync({ entryPoints: [SRC], outfile: JS, minify: true, target: 'es2017', legalComments: 'none' });

const hash = (p) => createHash('md5').update(fs.readFileSync(p)).digest('hex').slice(0, 8);
const jsHash = hash(JS);
const cssHash = hash(CSS);
console.log(`obsidian.js  ${fs.statSync(SRC).size} -> ${fs.statSync(JS).size} bytes, hash ${jsHash}`);
console.log(`obsidian.css ${fs.statSync(CSS).size} bytes, hash ${cssHash}`);

let s = fs.readFileSync(PAGE, 'utf8');
const before = s;
s = s.replace(/\/assets\/obsidian\.js(\?v=[0-9a-f]+)?/g, `/assets/obsidian.js?v=${jsHash}`);
s = s.replace(/\/assets\/obsidian\.css(\?v=[0-9a-f]+)?/g, `/assets/obsidian.css?v=${cssHash}`);
if (s !== before) {
  fs.writeFileSync(PAGE, s);
  console.log('stamped index.html');
} else {
  console.log('index.html already current');
}

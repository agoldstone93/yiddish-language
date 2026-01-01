#!/usr/bin/env node

import { build } from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = resolve(__dirname, '..');

async function buildGrammar() {
  try {
    await build({
      entryPoints: [resolve(rootDir, 'src/lib/grammar/browser.ts')],
      bundle: true,
      outfile: resolve(rootDir, 'public/admin/js/grammar.js'),
      platform: 'browser',
      target: 'es2020',
      format: 'iife',
      sourcemap: true,
      tsconfig: resolve(rootDir, 'tsconfig.json'),
      loader: { '.ts': 'ts' },
    });
    console.log('✓ Grammar bundle built successfully');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildGrammar();

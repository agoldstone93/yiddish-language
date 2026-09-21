#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { load } from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const verbsDir = path.join(rootDir, 'content/verbs');
const outFile = path.join(rootDir, 'public/search-index.json');

function buildIndex() {
  const files = fs.readdirSync(verbsDir).filter((f) => f.endsWith('.yml'));

  const entries = files.map((file) => {
    const verb = load(fs.readFileSync(path.join(verbsDir, file), 'utf8'));

    const english = [
      ...(verb.senses ?? []).map((sense) => sense.english),
      ...(verb.search?.english ?? []),
    ].filter(Boolean);

    const searchTerms = [
      verb.lemma.yiddish,
      verb.lemma.transliteration,
      ...english,
      ...(verb.search?.yiddish ?? []),
      ...(verb.search?.transliteration ?? []),
    ].filter(Boolean);

    return {
      id: verb.id,
      href: '/verbs/' + verb.id,
      yiddish: verb.lemma.yiddish,
      transliteration: verb.lemma.transliteration,
      english,
      searchTerms,
    };
  });

  fs.writeFileSync(outFile, JSON.stringify(entries));
  console.log(`✓ Search index built (${entries.length} entries)`);
}

buildIndex();
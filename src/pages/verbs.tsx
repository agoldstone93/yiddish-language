import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import Link from 'next/link';
import { InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import type { Verb } from '@/types/verb';

export const getStaticProps = async () => {
  const verbsDir = path.join(process.cwd(), 'content/verbs');
  const files = fs.readdirSync(verbsDir);

  const verbs: Verb[] = files.map(file => {
    const content = yaml.load(fs.readFileSync(path.join(verbsDir, file), 'utf8')) as Verb;

    return content;
  });

  verbs.sort((a, b) => a.lemma.yiddish.localeCompare(b.lemma.yiddish, 'yi'));

  return { props: { verbs } };
};

export default function VerbsPage({ verbs }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>All Verbs - LoshnLab</title>
        <meta name="description" content="Browse all Yiddish verbs in the LoshnLab conjugator" />
        <meta property="og:title" content="LoshnLab - All Yiddish Verbs" />
        <meta property="og:description" content="Browse all Yiddish verbs in the LoshnLab conjugator" />
        <meta property="og:url" content="https://loshnlab.com/verbs" />
      </Head>
      <div className="page-shell space-y-6">
        <div className="space-y-2">
          <h1>Yiddish Verbs</h1>
          <p className="text-text-secondary">Browse all {verbs.length} verbs</p>
        </div>
        <ul className="space-y-3">
          {verbs.map((verb) => (
            <li key={verb.id} className="group">
            <Link
              href={`/verbs/${verb.id}`}
              className="text-lg font-semibold underline underline-offset-2 hover:no-underline flex justify-between"
            >
              <span>{verb.senses?.[0]?.english}</span>
              <span>{verb.lemma.yiddish}</span>
            </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

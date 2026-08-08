import fs from 'fs';
import path from 'path';
import { load } from 'js-yaml';
import Link from 'next/link';
import { InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import type { Verb } from '@/types/verb';
import { formatVerbMeanings } from '@/lib/verbSenses';

export const getStaticProps = async () => {
  const verbsDir = path.join(process.cwd(), 'content/verbs');
  const files = fs.readdirSync(verbsDir);

  const verbs: Verb[] = files.map(file => {
    const content = load(fs.readFileSync(path.join(verbsDir, file), 'utf8')) as Verb;
    return content;
  });

  verbs.sort((a, b) => a.lemma.yiddish.localeCompare(b.lemma.yiddish, 'yi'));

  return { props: { verbs } };
};

export default function VerbsPage({ verbs }: InferGetStaticPropsType<typeof getStaticProps>) {
  const normalizeLetter = (raw: string) => {
    if (raw === 'װ') return 'ו'; // treat װ as same bucket as ו
    return raw;
  };

  const grouped = verbs.reduce<Record<string, Verb[]>>((acc, verb) => {
    const firstChar = verb.lemma.yiddish?.trim()?.charAt(0) || '#';
    const letter = normalizeLetter(firstChar);
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(verb);
    return acc;
  }, {});

  const letters = Object.keys(grouped).sort((a, b) => a.localeCompare(b, 'yi'));

  return (
    <>
      <Head>
        <title>All Verbs - LoshnLab</title>
        <meta name="description" content="Browse all Yiddish verbs in the LoshnLab conjugator" />
        <meta property="og:title" content="LoshnLab - All Yiddish Verbs" />
        <meta property="og:description" content="Browse all Yiddish verbs in the LoshnLab conjugator" />
        <meta property="og:url" content="https://loshnlab.com/verbs" />
      </Head>

      <div className="page-shell space-y-4">
        <h1>List of all {verbs.length} verbs</h1>

        <nav
          aria-label="Jump to letter"
          dir="rtl"
          className="w-full flex flex-wrap justify-start gap-5 text-xl"
        >
          {letters.map(letter => (
            <a
              key={letter}
              href={`#letter-${encodeURIComponent(letter)}`}
              className="underline underline-offset-2 hover:no-underline"
            >
              {letter}
            </a>
          ))}
        </nav>

        <div className="space-y-8">
          {letters.map(letter => (
            <section
              key={letter}
              id={`letter-${encodeURIComponent(letter)}`}
              className="space-y-3 scroll-mt-24"
            >
              <h2 dir="rtl" className="text-2xl font-bold justify-start border-b">{letter}</h2>
              <ul className="space-y-2">
                {grouped[letter].map(verb => (
                  <li key={verb.id} className="group">
                    <Link
                      href={`/verbs/${verb.id}`}
                      className="text-lg font-semibold underline underline-offset-2 hover:no-underline flex justify-between"
                    >
                      <span>{formatVerbMeanings(verb.senses)}</span>
                      <span>{verb.lemma.yiddish}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
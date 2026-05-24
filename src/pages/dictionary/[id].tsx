import Head from "next/head";
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { getAllNouns, getNoun } from "@/lib/nouns";
import { getAllVerbs, getVerb } from "@/lib/verbs";
import type { Noun } from "@/types/noun";
import type { Verb } from "@/types/verb";
import Link from "next/link";

type DictionaryEntryProps = {
  noun: Noun | null;
  verb: Verb | null;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const nounIds = getAllNouns().map((noun) => noun.id);
  const verbIds = getAllVerbs().map((verb) => verb.id);
  const ids = [...new Set([...nounIds, ...verbIds])];

  return {
    paths: ids.map((id) => ({ params: { id } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<DictionaryEntryProps> = async ({ params }) => {
  const id = params?.id as string;
  const noun = getNoun(id);
  const verb = getVerb(id);

  if (!noun && !verb) {
    return { notFound: true };
  }

  return {
    props: { noun, verb },
  };
};

export default function DictionaryEntryPage({
  noun,
  verb,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const lemma = noun?.lemma ?? verb?.lemma;
  const english = noun?.senses?.[0]?.english ?? verb?.senses?.[0]?.english;
  const entryId = noun?.id ?? verb?.id;

  if (!lemma || !entryId) {
    return null;
  }

  const title = `${lemma.yiddish} (${lemma.transliteration})`;
  const description = english
    ? `${lemma.yiddish} (${lemma.transliteration}) means "${english}" in English.`
    : `Dictionary entry for ${lemma.yiddish} (${lemma.transliteration}).`;

  return (
    <>
      <Head>
        <title>{`${title} - LoshnLab Dictionary`}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={`LoshnLab Dictionary - ${title}`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`https://loshnlab.com/dictionary/${entryId}`} />
      </Head>

      <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        {/* Lemma */}
        <h1 className="text-3xl font-bold text-center space-y-0 mb-0">
          {lemma.yiddish}
        </h1>

        <p className="text-center text-gray-600 dark:text-gray-400">
          ({lemma.transliteration})
        </p>

        {noun && (
          <>
            <section className="space-y-2">
              <h2 className="text-xl font-semibold">Noun</h2>
              <div>Gender: {noun.gender}</div>
              <div>Plural: {noun.plural ? `${noun.plural.yiddish} (${noun.plural.transliteration})` : "—"}</div>
              {noun.senses.map((sense, index) => (
                <div key={index}>
                  {index + 1}. {sense.english}
                </div>
              ))}
            </section>
            {noun.notes && noun.notes.length > 0 && (
              <section className="rounded border p-4 shadow-sm">
                <ul className="list-disc list-inside">
                  {noun.notes.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}

        
        {verb && (
          <section className="space-y-2">
            <div className="flex items-baseline gap-2">
              <h2 className="text-xl font-semibold">Verb</h2>
              <span className="text-sm">
                <Link className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100" href={`/verbs/${verb.id}`}>Conjugate</Link>
              </span>
            </div>
            <div>Past participle: {verb.conjugation.past_participle ? verb.conjugation.past_participle.yiddish : "—"}</div>
            {verb.senses.map((sense, index) => (
              <div key={index}>
                {index + 1}. {sense.english}
              </div>
            ))}
          </section>
        )}
      </div>
    </>
  );
}
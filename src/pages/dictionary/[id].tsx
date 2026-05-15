import Head from "next/head";
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { getAllNouns, getNoun } from "@/lib/nouns";
import { getVerb } from "@/lib/verbs";
import type { Noun } from "@/types/noun";
import type { Verb } from "@/types/verb";

type DictionaryEntryProps = {
  noun: Noun;
  verb: Verb | null;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const nouns = getAllNouns();

  return {
    paths: nouns.map((noun) => ({
      params: { id: noun.id },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<DictionaryEntryProps> = async ({ params }) => {
  const id = params?.id as string;
  const noun = getNoun(id);

  if (!noun) {
    return { notFound: true };
  }

  const verb = getVerb(id);

  return {
    props: { noun, verb },
  };
};

export default function DictionaryEntryPage({
  noun,
  verb,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const title = `${noun.lemma.yiddish} (${noun.lemma.transliteration})`;
  const description = noun.meaning?.english
    ? `${noun.lemma.yiddish} (${noun.lemma.transliteration}) means "${noun.meaning.english}" in English.`
    : `Dictionary entry for ${noun.lemma.yiddish} (${noun.lemma.transliteration}).`;

  return (
    <>
      <Head>
        <title>{`${title} - LoshnLab Dictionary`}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={`LoshnLab Dictionary - ${title}`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`https://loshnlab.com/dictionary/${noun.id}`} />
      </Head>

      <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        {/* Lemma */}
        <h1 className="text-3xl font-bold text-center space-y-0 mb-0">
          {noun.lemma.yiddish}
        </h1>

        <p className="text-center text-gray-600 dark:text-gray-400">
          ({noun.lemma.transliteration})
        </p>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Noun</h2>
          <div>{noun.lemma.yiddish} - plural: {noun.plural ? noun.plural.yiddish : "—"}, gender: { noun.gender }</div>
          <div>1. {noun.meaning.english}</div>
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
        
        { verb && (
          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Verb</h2>
            <div>{noun.lemma.yiddish} - past participle: {verb.conjugation.past_participle ? verb.conjugation.past_participle.yiddish : "—"}</div>
            <div>1. {verb.meaning.english}</div>
          </section>
        )}
      </div>
    </>
  );
}
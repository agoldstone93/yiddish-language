import Head from "next/head";
import { VerbSearch } from "@/components/VerbSearch";
import { getAllVerbs } from "@/lib/verbs";
import type { Verb } from "@/types/verb";

export async function getStaticProps() {
  const verbs = getAllVerbs();
  return { props: { verbs } };
}

export default function Home({ verbs }: { verbs: Verb[] }) {
  return (
    <>
      <Head>
        <title>LoshnLab - Yiddish Verb Conjugator</title>
        <meta name="description" content="Free Yiddish verb conjugator with search by Yiddish, transliteration, or English. Explore conjugations, tenses, and examples." />
      </Head>
      <div className="mx-auto flex min-h-[80vh] w-full max-w-3xl flex-col justify-center">
        <div className="space-y-6">
          <div className="space-y-1 text-center text-gray-600 dark:text-gray-400">
            <h1 className="text-3xl font-bold text-center text-foreground">Yiddish Verbs</h1>
            <p className="text-base">Look up a verb to explore its forms.</p>
            <p className="text-sm">Type a Yiddish word, transliteration, or English meaning.</p>
          </div>
          <VerbSearch verbs={verbs} />
        </div>
      </div>
    </>
  );
}

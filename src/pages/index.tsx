import Head from "next/head";
import { VerbSearch } from "@/components/VerbSearch";
import { getVerbSearchIndex } from "@/lib/searchIndex";
import type { SearchEntry } from "@/lib/searchIndex";

export async function getStaticProps() {
  const verbs = getVerbSearchIndex();
  return { props: { verbs } };
}

export default function Home({ verbs }: { verbs: SearchEntry[] }) {
  return (
    <>
      <Head>
        <title>LoshnLab - Yiddish Verb Conjugator</title>
        <meta name="description" content="Free Yiddish verb conjugator with search by Yiddish, transliteration, or English. Explore conjugations, tenses, and examples." />
        <meta property="og:title" content="LoshnLab - Yiddish learning resource and verb conjugator" />
        <meta property="og:description" content="Free Yiddish verb conjugator with search by Yiddish, transliteration, or English. Explore conjugations, tenses, and examples." />
        <meta property="og:url" content="https://loshnlab.com/" />
      </Head>
      <div className="mx-auto flex md:min-h-[75vh] min-h-[30vh] w-full max-w-3xl flex-col justify-center">
        <div className="space-y-6">
          <div className="space-y-1 text-center muted-text">
            <h1 className="text-center text-foreground">Yiddish Verbs</h1>
            <p className="text-base">Look up a verb to explore its forms.</p>
            <p className="text-sm">Type a Yiddish word, transliteration, or English meaning.</p>
          </div>
          <VerbSearch verbs={verbs} />
        </div>
      </div>
    </>
  );
}

import Head from "next/head";
import { VerbSearch } from "@/components/VerbSearch";
import { useSearchIndex } from "@/lib/useSearchIndex";


export default function Home() {
  const verbs = useSearchIndex();
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
        <div className="space-y-6 text-center">
          <div className="space-y-1">
            <h1 className="">Yiddish Verbs</h1>
            <p>Look up a verb to explore its forms.</p>
            <p className="text-sm">Type a Yiddish word, transliteration, or English meaning.</p>
          </div>
        </div>
        <VerbSearch verbs={verbs} className="mt-6" />
      </div>
    </>
  );
}

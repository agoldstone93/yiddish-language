import { VerbSearch } from "@/components/VerbSearch";
import { getAllVerbs } from "@/lib/verbs";
import type { Verb } from "@/types/verb";

export async function getStaticProps() {
  const verbs = getAllVerbs();
  return { props: { verbs } };
}

export default function Home({ verbs }: { verbs: Verb[] }) {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center p-6">
        <div className="space-y-6">
          <div className="space-y-1 text-center text-gray-400">
            <h1 className="text-3xl font-bold text-center text-[var(--foreground)]">Yiddish Verbs</h1>
            <p className="text-base">Look up a verb to explore its forms.</p>
            <p className="text-sm">Type a Yiddish word, transliteration, or English meaning.</p>
          </div>
          <VerbSearch verbs={verbs} />
        </div>
      </div>
    </main>
  );
}

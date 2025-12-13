import { getAllVerbs } from "@/lib/verbs";

export async function getStaticProps() {
  const verbs = getAllVerbs();
  return { props: { verbs } };
}

type Verb = {
  id: string;
  lemma: {
    yiddish: string;
    transliteration: string;
  };
};

export default function Home({ verbs }: { verbs: Verb[] }) {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Yiddish Verbs</h1>

      <ul className="space-y-2">
        {verbs.map((v) => (
          <li key={v.id} className="text-lg">
            {v.lemma.yiddish}{" "}
            <span className="text-gray-500">
              ({v.lemma.transliteration})
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}

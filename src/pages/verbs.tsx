import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import Link from 'next/link';
import { InferGetStaticPropsType } from 'next';

type Verb = {
  id: string;
  lemma: {
    yiddish: string;
    transliteration: string;
  };
  origin: string;
  part_of_speech: string;
  verb_class: string;
  auxiliary: string;
  notes?: string;
};

export const getStaticProps = async () => {
  const verbsDir = path.join(process.cwd(), 'content/verbs');
  const files = fs.readdirSync(verbsDir);

  const verbs: Verb[] = files.map(file => {
    const content = yaml.load(fs.readFileSync(path.join(verbsDir, file), 'utf8')) as Verb;

    // Optional: auto-populate search arrays from lemma
    content['search'] = {
      transliteration: [content.lemma.transliteration],
      yiddish: [content.lemma.yiddish],
    };

    return content;
  });

  return { props: { verbs } };
};

export default function VerbsPage({ verbs }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Yiddish Verbs</h1>
      <ul className="space-y-4">
        {verbs.map((verb) => (
          <li key={verb.id} className="p-4 border rounded shadow-sm hover:shadow-md transition">
            <Link
                href={`/verbs/${verb.id}`}
                className="text-blue-600 hover:underline text-xl font-bold"
                >
                {verb.lemma.yiddish} — {verb.lemma.transliteration}
                </Link>

            <div className="text-sm text-gray-500 mt-1">
              <span className="font-semibold">Class:</span> {verb.verb_class} |{' '}
              <span className="font-semibold">Auxiliary:</span> {verb.auxiliary}
            </div>
            {verb.notes && <div className="mt-2 text-gray-600">{verb.notes}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';

type VerbForm = {
  yiddish: string;
  transliteration: string;
};

type Verb = {
  id: string;
  lemma: {
    yiddish: string;
    transliteration: string;
  };
  origin: string;
  part_of_speech: string;
  auxiliary: string;
  meaning?: {
    english: string;
  };
  conjugation?: Record<string, Record<string, VerbForm>>;
  notes?: string[];
};

// Map person keys to Yiddish
const personMap: Record<string, string> = {
  ich: 'איך',
  du: 'דו',
  er_zi_es: 'ער/זי/עס',
  mir: 'מיר',
  ir: 'איר',
  zey: 'זיי',
};

export const getStaticPaths: GetStaticPaths = async () => {
  const verbsDir = path.join(process.cwd(), 'content/verbs');
  const files = fs.readdirSync(verbsDir);

  const paths = files.map(file => {
    const content = yaml.load(
      fs.readFileSync(path.join(verbsDir, file), 'utf8')
    ) as Verb;
    return { params: { id: content.id } };
  });

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id as string;
  const filePath = path.join(process.cwd(), 'content/verbs', `${id}.yml`);

  const content = yaml.load(
    fs.readFileSync(filePath, 'utf8')
  ) as Verb;

  return { props: { verb: content } };
};

export default function VerbPage({ verb }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Lemma */}
      <h1 className="text-3xl font-bold text-center">
        {verb.lemma.yiddish} — {verb.lemma.transliteration}
      </h1>

      {/* Metadata */}
      <div className="space-y-1 text-center text-gray-700">
        <div><strong>Auxiliary:</strong> {verb.auxiliary}</div>
        {verb.meaning?.english && <div><strong>Meaning:</strong> {verb.meaning.english}</div>}
      </div>

      {/* Conjugation */}
      {verb.conjugation && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(verb.conjugation).map(([tense, forms]) => (
            <div key={tense} className="border rounded p-4 shadow-sm">
              <h3 className="font-semibold text-center mb-2">{tense}</h3>
              {Object.entries(forms as Record<string, VerbForm>).map(([person, form]) => (
                <div key={person} className="text-center text-gray-100">
                  {personMap[person] ?? person} {form.yiddish}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Notes */}
      {verb.notes && verb.notes.length > 0 && (
        <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded text-gray-800">
          <ul className="list-disc list-inside">
            {verb.notes.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

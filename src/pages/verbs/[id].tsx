import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import Head from 'next/head';
import { Verb } from '@/types/verb';
import { getPastForms } from '@/lib/grammar/past';
import { getFutureForms } from '@/lib/grammar/future';
import { getImperativeForms } from '@/lib/grammar/imperative';
import { TenseBox } from '@/components/TenseBox';
import { VerbSearch } from '@/components/VerbSearch';

import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { getCategory, renderCategoryContent } from '@/lib/categories';

export const getStaticPaths: GetStaticPaths = async () => {
  const verbsDir = path.join(process.cwd(), 'content/verbs');
  const files = fs.readdirSync(verbsDir);

  const paths = files.map((file: string) => {
    const content = yaml.load(
      fs.readFileSync(path.join(verbsDir, file), 'utf8')
    ) as Verb;
    return { params: { id: content.id } };
  });

  return { paths, fallback: false };
};

type CategoryData = { name: string; contentHtml: string } | null;

export const getStaticProps: GetStaticProps<{ verb: Verb; verbs: Verb[]; category: CategoryData }> = async ({ params }) => {
  const id = params?.id as string;
  const verbsDir = path.join(process.cwd(), 'content/verbs');
  const filePath = path.join(verbsDir, `${id}.yml`);

  const content = yaml.load(
    fs.readFileSync(filePath, 'utf8')
  ) as Verb;

  const verbs = fs
    .readdirSync(verbsDir)
    .map((file) =>
      yaml.load(fs.readFileSync(path.join(verbsDir, file), 'utf8')) as Verb
    );

  let category: CategoryData = null;
  if (content.categoryId) {
    const cat = getCategory(content.categoryId);
    if (cat) {
      category = {
        name: cat.name,
        contentHtml: renderCategoryContent(cat.content)
      };
    }
  }

  return { props: { verb: content, verbs, category } };
};

export default function VerbPage({ verb, verbs, category }: InferGetStaticPropsType<typeof getStaticProps>) {
  const title = `${verb.lemma.yiddish} (${verb.lemma.transliteration})`;
  const description = verb.meaning?.english 
    ? `Conjugate ${verb.lemma.yiddish} (${verb.lemma.transliteration}) - "${verb.meaning.english}" in Yiddish. View all tenses and forms.`
    : `Conjugate ${verb.lemma.yiddish} (${verb.lemma.transliteration}) in Yiddish. View all tenses and forms.`;

  return (
    <>
      <Head>
        <title>{`${title} - LoshnLab`}</title>
        <meta name="description" content={description} />
      </Head>
      <div className="max-w-3xl mx-auto space-y-6">
        <VerbSearch verbs={verbs} activeVerbId={verb.id}/>

      {/* Lemma */}
      <h1 className="text-3xl font-bold text-center space-y-0 mb-0">
        {verb.lemma.yiddish}
      </h1>

      <p className="text-center text-gray-600 dark:text-gray-400">
        ({verb.lemma.transliteration})
      </p>

      {/* Metadata */}
      <div className="text-center text-gray-600 dark:text-gray-400">
        {verb.meaning?.english && <div><strong>Meaning:</strong> {verb.meaning.english}</div>}
        {verb.categoryId && <div><strong>Category:</strong> {verb.categoryId}</div>}
      </div>

      {/* Category Explainer */}
      {category && (
        <details className="border rounded p-4 shadow-sm">
          <summary className="cursor-pointer font-semibold text-lg">
            About {category.name}
          </summary>
          <div 
            className="mt-4 prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: category.contentHtml }}
          />
        </details>
      )}

      {verb.conjugation && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Present */}
          <TenseBox
            title="Present"
            forms={verb.conjugation.present}
          />

        {/* Past (derived) */}
        {(() => {
          const past = getPastForms(verb);
          return past ? <TenseBox title="Past" forms={past} /> : null;
        })()}

        {/* Future (derived) */}
        {(() => {
          const future = getFutureForms(verb);
          return <TenseBox title="Future" forms={future} />;
        })()}


        {/* Imperative (derived) */}
        {(() => {
          const imp = getImperativeForms(verb);
          return imp ? (
            <TenseBox
              title="Imperative"
              forms={imp}
              labelOverrides={{
                du: <i>singular:</i>,
                ir: <i>plural:</i>,
              }}
            />
          ) : null;
        })()}
        </div>
      )}



      {/* Notes */}
      {verb.notes && verb.notes.length > 0 && (
        <div className="border rounded p-4 shadow-sm">
          <ul className="list-disc list-inside">
            {verb.notes.map((note: string, idx: number) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>
      )}
      </div>
    </>
  );
}

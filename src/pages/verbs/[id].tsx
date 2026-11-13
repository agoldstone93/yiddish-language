import fs from 'fs';
import path from 'path';
import { load } from 'js-yaml';
import Head from 'next/head';
import { Verb } from '@/types/verb';
import { getPastForms } from '@/lib/grammar/past';
import { getFutureForms } from '@/lib/grammar/future';
import { getConditionalForms } from '@/lib/grammar/conditional';
import { getImperativeForms } from '@/lib/grammar/imperative';
import { TenseBox } from '@/components/TenseBox';
import { VerbSearch } from '@/components/VerbSearch';
import { useSearchIndex } from '@/lib/useSearchIndex';
import { formatVerbMeanings } from '@/lib/verbSenses';

import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { getCategory, renderCategoryContent } from '@/lib/categories';
import { useState } from 'react';

export const getStaticPaths: GetStaticPaths = async () => {
  const verbsDir = path.join(process.cwd(), 'content/verbs');
  const files = fs.readdirSync(verbsDir);

  const paths = files.map((file: string) => {
    const content = load(
      fs.readFileSync(path.join(verbsDir, file), 'utf8')
    ) as Verb;
    return { params: { id: content.id } };
  });

  return { paths, fallback: false };
};

type CategoryData = { name: string; contentHtml: string } | null;

export const getStaticProps: GetStaticProps<{
  verb: Verb;
  category: CategoryData
}> = async ({ params }) => {
  const id = params?.id as string;
  const verbsDir = path.join(process.cwd(), 'content/verbs');
  const filePath = path.join(verbsDir, `${id}.yml`);

  const content = load(
    fs.readFileSync(filePath, 'utf8')
  ) as Verb;

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

  return { props: { verb: content, category } };
};

export default function VerbPage({ verb, category }: InferGetStaticPropsType<typeof getStaticProps>) {
  const verbs = useSearchIndex();
  const title = `${verb.lemma.yiddish} (${verb.lemma.transliteration})`;
  const description = verb.senses?.[0]?.english
    ? `Conjugate ${verb.lemma.yiddish} (${verb.lemma.transliteration}) - "${verb.senses[0].english}" in Yiddish. View all tenses and forms.`
    : `Conjugate ${verb.lemma.yiddish} (${verb.lemma.transliteration}) in Yiddish. View all tenses and forms.`;

  const [showNegative, setShowNegative] = useState(false);
  const [showInverted, setShowInverted] = useState(false);

  return (
    <>
      <Head>
        <title dir="ltr">{`${title} - LoshnLab`}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={`LoshnLab - ${title}`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`https://loshnlab.com/verbs/${verb.id}`} />
      </Head>
      <div className="max-w-4xl mx-auto space-y-4">
        <VerbSearch verbs={verbs} activeVerbId={verb.id} />

        <div className="md:relative text-center">
          <div className="flex gap-2 md:absolute md:right-0 md:top-0 mb-4 md:mb-0 md:w-auto w-full">
            <button
              type="button"
              aria-pressed={showNegative}
              onClick={() => setShowNegative((shown) => !shown)}
              title="Show negative forms"
              className="flex-1 md:flex-none px-2 h-8 text-sm border-2 border-foreground aria-pressed:bg-foreground aria-pressed:text-background transition-colors cursor-pointer hover:bg-surface-panel aria-pressed:hover:bg-foreground"
            >
              Negative
            </button>
            <button
              type="button"
              aria-pressed={showInverted}
              onClick={() => setShowInverted((shown) => !shown)}
              title="Show inverted forms"
              className="flex-1 md:flex-none px-2 h-8 text-sm border-2 border-foreground aria-pressed:bg-foreground aria-pressed:text-background transition-colors cursor-pointer hover:bg-surface-panel aria-pressed:hover:bg-foreground"
            >
              Invert
            </button>
          </div>

          {/* Lemma */}
          <h1 className="font-yiddish" dir="rtl">{verb.lemma.yiddish}</h1>

          <p>({verb.lemma.transliteration})</p>

          <br />

          {/* Metadata */}
          {verb.senses?.[0]?.english && <p><strong>Meaning:</strong> {formatVerbMeanings(verb.senses)}</p>}
          {verb.categoryId && <p><strong>Category:</strong> {verb.categoryId}</p>}
        </div>

        {/* Category Explainer */}
        {category && (
          <details className="details-panel">
            <summary>About {category.name}</summary>
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
              negative={showNegative}
              inverted={showInverted}
            />

            {/* Past (derived) */}
            {(() => {
              const past = getPastForms(verb);
              return past ? <TenseBox title="Past" forms={past} negative={showNegative} inverted={showInverted} /> : null;
            })()}

            {/* Future (derived) */}
            {(() => {
              const future = getFutureForms(verb);
              return <TenseBox title="Future" forms={future} negative={showNegative} inverted={showInverted} />;
            })()}


            {/* Conditional (derived) */}
            {(() => {
              const conditional = getConditionalForms(verb);
              return conditional ? (
                <TenseBox
                  title="Conditional"
                  forms={conditional}
                  negative={showNegative}
                  inverted={showInverted}
                />
              ) : null;
            })()}


            {/* Imperative (derived) */}
            {(() => {
              const imp = getImperativeForms(verb);
              return imp ? (
                <TenseBox
                  title="Imperative"
                  imperative
                  forms={imp}
                  negative={showNegative}
                  inverted={showInverted}
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
          <div className="panel">
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

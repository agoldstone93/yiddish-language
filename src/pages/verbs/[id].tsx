import fs from 'fs';
import path from 'path';
import { useEffect, useMemo, useState } from 'react';
import yaml from 'js-yaml';
import { Verb } from '@/types/verb';
import { getPastForms } from '@/lib/grammar/past';
import { getFutureForms } from '@/lib/grammar/future';
import { getImperativeForms } from '@/lib/grammar/imperative';
import { TenseBox } from '@/components/TenseBox';
import { useCombobox } from 'downshift';
import { useRouter } from 'next/router';

import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';

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

export const getStaticProps: GetStaticProps<{ verb: Verb; verbs: Verb[] }> = async ({ params }) => {
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

  return { props: { verb: content, verbs } };
};

export default function VerbPage({ verb, verbs }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const matches = useMemo(() => {
    const needle = inputValue.trim().toLowerCase();
    if (!needle) return [];
    return verbs
      .filter((entry) => {
        const haystack = [
          entry.lemma?.yiddish,
          entry.lemma?.transliteration,
          entry.meaning?.english,
        ].filter((value): value is string => Boolean(value));
        return haystack.some((value) => value.toLowerCase().includes(needle));
      })
      .slice(0, 10);
  }, [inputValue, verbs]);

  const {
    getInputProps,
    getItemProps,
    getMenuProps,
    highlightedIndex,
    isOpen,
  } = useCombobox<Verb>({
    inputValue,
    items: matches,
    onInputValueChange: ({ inputValue }) => setInputValue(inputValue ?? ''),
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        setInputValue('');
        void router.push(`/verbs/${selectedItem.id}`);
      }
    },
    itemToString: (item) =>
      item ? `${item.lemma.yiddish} — ${item.lemma.transliteration}` : '',
  });

  const inputProps = getInputProps({ placeholder: 'Search other verbs…' });
  const menuProps = getMenuProps({}, { suppressRefError: true });

  useEffect(() => {
    setInputValue('');
  }, [verb.id]);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="relative">
        <input className="w-full rounded border px-3 py-2" {...inputProps} />
        <ul
          className="text-gray-100 absolute left-0 right-0 top-full z-20 mt-2 max-h-80 overflow-auto border rounded bg-gray-600 divide-y shadow-lg"
          {...menuProps}
        >
          {isOpen && inputValue && matches.length > 0 &&
            matches.map((entry, index) => (
              <li
                key={entry.id}
                className={`px-3 py-2 hover:bg-gray-500 ${
                  highlightedIndex === index ? 'bg-gray-500' : ''
                }`}
                {...getItemProps({ item: entry, index })}
              >
                <div>{entry.lemma.yiddish} — {entry.lemma.transliteration}</div>
                {entry.meaning?.english && (
                  <div className="text-sm text-gray-800">{entry.meaning.english}</div>
                )}
              </li>
            ))}
          {isOpen && inputValue && matches.length === 0 && (
            <li className="px-3 py-2 text-sm text-gray-100">No matches.</li>
          )}
        </ul>
      </div>

      {/* Lemma */}
      <h1 className="text-3xl font-bold text-center">
        {verb.lemma.yiddish} — {verb.lemma.transliteration}
      </h1>

      {/* Metadata */}
      <div className="space-y-1 text-center text-gray-400">
        {verb.meaning?.english && <div><strong>Meaning:</strong> {verb.meaning.english}</div>}
      </div>

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
          return imp ? <TenseBox title="Imperative" forms={imp} /> : null;
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
  );
}

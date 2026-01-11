import type { ReactNode } from 'react';
import { Person, VerbForm } from '@/types/verb';

const personMap: Record<Person, string> = {
  ikh: 'איך',
  du: 'דו',
  er_zi_es: 'ער/זי/עס',
  mir: 'מיר',
  ir: 'איר',
  zey: 'זיי',
};

export function TenseBox({
  title,
  forms,
  labelOverrides,
}: {
  title: string;
  forms: Partial<Record<Person, VerbForm>>;
  labelOverrides?: Partial<Record<Person, ReactNode>>;
}) {
  const labels: Record<Person, ReactNode> = {
    ...personMap,
    ...(labelOverrides ?? {}),
  };

  return (
    <div className="bg-orange-100 dark:bg-gray-800 p-4">
      <h2 className="font-semibold text-center mb-2">{title}</h2>
      {Object.entries(forms).map(([person, form]) =>
        form ? (
          <div key={person} className="text-center text-gray-600 dark:text-gray-400">
            <span className="text-slate-700 dark:text-slate-300">
              {labels[person as Person]}
            </span>
            {' '}
            <span className="text-gray-900 dark:text-gray-100 font-semibold">
              {form.yiddish}
            </span>
          </div>
        ) : null
      )}
    </div>
  );
}

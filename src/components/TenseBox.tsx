import { Person, VerbForm } from '@/types/verb';

const personMap: Record<Person, string> = {
  ich: 'איך',
  du: 'דו',
  er_zi_es: 'ער/זי/עס',
  mir: 'מיר',
  ir: 'איר',
  zey: 'זיי',
};

export function TenseBox({
  title,
  forms,
}: {
  title: string;
  forms: Partial<Record<Person, VerbForm>>;
}) {
  return (
    <div className="bg-gray-800 p-4 shadow-sm">
      <h3 className="font-semibold text-center mb-2">{title}</h3>
      {Object.entries(forms).map(([person, form]) =>
        form ? (
          <div key={person} className="text-center text-gray-400">
            <span className="text-slate-300">
              {personMap[person as Person]}
            </span>
            {' '}
            <span className="text-gray-100 font-semibold">
              {form.yiddish}
            </span>
          </div>
        ) : null
      )}
    </div>
  );
}

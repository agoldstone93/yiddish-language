import { Verb, Person, VerbForm } from '@/types/verb';

export const voltPresent: Record<Person, VerbForm> = {
  ikh: { yiddish: 'וואָלט', transliteration: 'volt' },
  du: { yiddish: 'וואָלטסט', transliteration: 'voltst' },
  er_zi_es: { yiddish: 'וואָלט', transliteration: 'volt' },
  mir: { yiddish: 'וואָלטן', transliteration: 'voltn' },
  ir: { yiddish: 'וואָלט', transliteration: 'volt' },
  zey: { yiddish: 'וואָלטן', transliteration: 'voltn' },
};

export function getConditionalForms(
  verb: Verb
): Record<Person, VerbForm> | null {
  if (!verb.conjugation) return null;
  const pp = verb.conjugation.past_participle;
  if (!pp) return null;

  const result = {} as Record<Person, VerbForm>;

  (Object.keys(voltPresent) as Person[]).forEach((person) => {
    const yiddishZikh = verb.reflexive ? ' זיך' : '';
    const transliterationZikh = verb.reflexive ? ' zikh' : '';
    const ppYiddish = verb.reflexive
      ? pp.yiddish.replace(/\s?זיך$/, '')
      : pp.yiddish;
    const ppTranslit = verb.reflexive
      ? pp.transliteration.replace(/\s?zikh$/, '')
      : pp.transliteration;

    result[person] = {
      yiddish: `${voltPresent[person].yiddish}${yiddishZikh} ${ppYiddish}`,
      transliteration: `${voltPresent[person].transliteration}${transliterationZikh} ${ppTranslit}`,
    };
  });

  return result;
}

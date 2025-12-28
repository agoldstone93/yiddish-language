import { Verb, Person, VerbForm } from '@/types/verb';
import { auxiliaries } from './auxiliaries';

export function getPastForms(
  verb: Verb
): Record<Person, VerbForm> | null {
  if (!verb.conjugation) return null;
  const pp = verb.conjugation.past_participle;
  if (!pp) return null;

  const aux = auxiliaries[verb.auxiliary];
  const result = {} as Record<Person, VerbForm>;

  (Object.keys(aux) as Person[]).forEach((person) => {
    const yiddishZikh = verb.reflexive ? ' זיך' : '';
    const transliterationZikh = verb.reflexive ? ' zikh' : '';
    const ppYiddish = verb.reflexive
      ? pp.yiddish.replace(/\s?זיך$/, '')
      : pp.yiddish;
    const ppTranslit = verb.reflexive
      ? pp.transliteration.replace(/\s?zikh$/, '')
      : pp.transliteration;
    result[person] = {
      yiddish: `${aux[person].yiddish}${yiddishZikh} ${ppYiddish}`,
      transliteration: `${aux[person].transliteration}${transliterationZikh} ${ppTranslit}`,
    };
  });

  return result;
}

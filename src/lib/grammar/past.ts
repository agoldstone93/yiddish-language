import { Verb, Person, VerbForm } from '@/types/verb';
import { auxiliaries } from './auxiliaries';

export function getPastForms(
  verb: Verb
): Record<Person, VerbForm> | null {
  const pp = verb.conjugation.past_participle;
  if (!pp) return null;

  const aux = auxiliaries[verb.auxiliary];
  const result = {} as Record<Person, VerbForm>;

  (Object.keys(aux) as Person[]).forEach((person) => {
    result[person] = {
      yiddish: `${aux[person].yiddish} ${pp.yiddish}`,
      transliteration: `${aux[person].transliteration} ${pp.transliteration}`,
    };
  });

  return result;
}

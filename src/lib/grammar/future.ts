import { Verb, Person, VerbForm } from '@/types/verb';

const velnPresent: Record<Person, VerbForm> = {
  ich: { yiddish: 'וועל', transliteration: 'vel' },
  du: { yiddish: 'וועסט', transliteration: 'vest' },
  er_zi_es: { yiddish: 'וועט', transliteration: 'vet' },
  mir: { yiddish: 'וועלן', transliteration: 'veln' },
  ir: { yiddish: 'וועט', transliteration: 'vet' },
  zey: { yiddish: 'וועלן', transliteration: 'veln' },
};

export function getFutureForms(
  verb: Verb
): Record<Person, VerbForm> {
  const result = {} as Record<Person, VerbForm>;

  (Object.keys(velnPresent) as Person[]).forEach((person) => {
    result[person] = {
      yiddish: `${velnPresent[person].yiddish} ${verb.lemma.yiddish}`,
      transliteration: `${velnPresent[person].transliteration} ${verb.lemma.transliteration}`,
    };
  });

  return result;
}

import { Verb, Person, VerbForm } from '@/types/verb';

export const velnPresent: Record<Person, VerbForm> = {
  ikh: { yiddish: 'וועל', transliteration: 'vel' },
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
    let lemmaYiddish = verb.lemma.yiddish;
    let lemmaTranslit = verb.lemma.transliteration;
    
    // For reflexive verbs, zikh should come after vel, not at the end of lemma
    if (verb.reflexive && lemmaYiddish.includes(' זיך')) {
      lemmaYiddish = lemmaYiddish.replace(' זיך', '');
      lemmaTranslit = lemmaTranslit.replace(' zikh', '');
    }
    
    const yiddishZikh = verb.reflexive ? ' זיך' : '';
    const transliterationZikh = verb.reflexive ? ' zikh' : '';
    
    result[person] = {
      yiddish: `${velnPresent[person].yiddish}${yiddishZikh} ${lemmaYiddish}`,
      transliteration: `${velnPresent[person].transliteration}${transliterationZikh} ${lemmaTranslit}`,
    };
  });

  return result;
}

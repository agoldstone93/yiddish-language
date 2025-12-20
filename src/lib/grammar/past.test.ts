import { describe, expect, it } from 'vitest';

import { getPastForms } from './past';
import type { Verb } from '@/types/verb';

describe('getPastForms', () => {
  it('returns null when past participle is missing', () => {
    const verb = {
      id: 'lernen',
      lemma: { yiddish: 'לערנען', transliteration: 'lernen' },
      auxiliary: 'hobn',
      conjugation: {
        present: {
          ich: { yiddish: 'לערן', transliteration: 'lern' },
          du: { yiddish: 'לערנסט', transliteration: 'lernst' },
          er_zi_es: { yiddish: 'לערנט', transliteration: 'lernt' },
          mir: { yiddish: 'לערנען', transliteration: 'lernen' },
          ir: { yiddish: 'לערנט', transliteration: 'lernt' },
          zey: { yiddish: 'לערנען', transliteration: 'lernen' },
        },
      },
    } satisfies Verb;

    expect(getPastForms(verb)).toBeNull();
  });

  it('combines auxiliary + past participle for each person', () => {
    const verb = {
      id: 'esen',
      lemma: { yiddish: 'עסן', transliteration: 'esen' },
      auxiliary: 'hobn',
      conjugation: {
        present: {
          ich: { yiddish: 'עס', transliteration: 'es' },
          du: { yiddish: 'עסט', transliteration: 'est' },
          er_zi_es: { yiddish: 'עסט', transliteration: 'est' },
          mir: { yiddish: 'עסן', transliteration: 'esen' },
          ir: { yiddish: 'עסט', transliteration: 'est' },
          zey: { yiddish: 'עסן', transliteration: 'esen' },
        },
        past_participle: { yiddish: 'געגעסן', transliteration: 'gegesen' },
      },
    } satisfies Verb;

    const forms = getPastForms(verb);
    expect(forms).not.toBeNull();

    expect(forms!.ich).toEqual({
      yiddish: 'האָב געגעסן',
      transliteration: 'hob gegesen',
    });
    expect(forms!.er_zi_es).toEqual({
      yiddish: 'האָט געגעסן',
      transliteration: 'hot gegesen',
    });
  });
});

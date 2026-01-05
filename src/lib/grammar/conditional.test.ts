import { describe, expect, it } from 'vitest';

import { getConditionalForms } from './conditional';
import type { Verb } from '@/types/verb';

describe('getConditionalForms', () => {
  it('returns null when past participle is missing', () => {
    const verb = {
      id: 'lernen',
      lemma: { yiddish: 'לערנען', transliteration: 'lernen' },
      meaning: { english: 'to learn' },
      auxiliary: 'hobn',
      reflexive: false,
      conjugation: {
        present: {
          ikh: { yiddish: 'לערן', transliteration: 'lern' },
          du: { yiddish: 'לערנסט', transliteration: 'lernst' },
          er_zi_es: { yiddish: 'לערנט', transliteration: 'lernt' },
          mir: { yiddish: 'לערנען', transliteration: 'lernen' },
          ir: { yiddish: 'לערנט', transliteration: 'lernt' },
          zey: { yiddish: 'לערנען', transliteration: 'lernen' },
        },
      },
    } satisfies Verb;

    expect(getConditionalForms(verb)).toBeNull();
  });

  it('combines volt + past participle for each person', () => {
    const verb = {
      id: 'esen',
      lemma: { yiddish: 'עסן', transliteration: 'esen' },
      meaning: { english: 'to eat' },
      auxiliary: 'hobn',
      reflexive: false,
      conjugation: {
        present: {
          ikh: { yiddish: 'עס', transliteration: 'es' },
          du: { yiddish: 'עסט', transliteration: 'est' },
          er_zi_es: { yiddish: 'עסט', transliteration: 'est' },
          mir: { yiddish: 'עסן', transliteration: 'esen' },
          ir: { yiddish: 'עסט', transliteration: 'est' },
          zey: { yiddish: 'עסן', transliteration: 'esen' },
        },
        past_participle: { yiddish: 'געגעסן', transliteration: 'gegesen' },
      },
    } satisfies Verb;

    const forms = getConditionalForms(verb);
    expect(forms).not.toBeNull();

    expect(forms!.ikh).toEqual({
      yiddish: 'וואָלט געגעסן',
      transliteration: 'volt gegesen',
    });
    expect(forms!.zey).toEqual({
      yiddish: 'וואָלטן געגעסן',
      transliteration: 'voltn gegesen',
    });
  });

  it('places zikh immediately after volt for reflexive verbs', () => {
    const verb = {
      id: 'lernen-zikh',
      lemma: { yiddish: 'לרענען זיך', transliteration: 'lernen zikh' },
      meaning: { english: 'to learn' },
      reflexive: true,
      auxiliary: 'hobn',
      conjugation: {
        present: {
          ikh: { yiddish: 'לערן זיך', transliteration: 'lern zikh' },
          du: { yiddish: 'לערנסט זיך', transliteration: 'lernst zikh' },
          er_zi_es: { yiddish: 'לערנט זיך', transliteration: 'lernt zikh' },
          mir: { yiddish: 'לערנען זיך', transliteration: 'lernen zikh' },
          ir: { yiddish: 'לערנט זיך', transliteration: 'lernt zikh' },
          zey: { yiddish: 'לערנען זיך', transliteration: 'lernen zikh' },
        },
        past_participle: { yiddish: 'געלערנט זיך', transliteration: 'gelernt zikh' },
      },
    } satisfies Verb;

    const forms = getConditionalForms(verb);
    expect(forms).not.toBeNull();

    expect(forms!.du).toEqual({
      yiddish: 'וואָלטסט זיך געלערנט',
      transliteration: 'voltst zikh gelernt',
    });
    expect(forms!.mir).toEqual({
      yiddish: 'וואָלטן זיך געלערנט',
      transliteration: 'voltn zikh gelernt',
    });
  });

  it('supports periphrastic lemmas without duplication', () => {
    const verb = {
      id: 'maskem-zayn',
      lemma: { yiddish: 'מסכּים זײַן', transliteration: 'maskem zayn' },
      meaning: { english: 'to agree' },
      reflexive: false,
      auxiliary: 'hobn',
      conjugation: {
        present: {
          ikh: { yiddish: 'בין מסכּים', transliteration: 'bin maskem' },
          du: { yiddish: 'ביסט מסכּים', transliteration: 'bist maskem' },
          er_zi_es: { yiddish: 'איז מסכּים', transliteration: 'iz maskem' },
          mir: { yiddish: 'זײַנען מסכּים', transliteration: 'zaynen maskem' },
          ir: { yiddish: 'זײַט מסכּים', transliteration: 'zayt maskem' },
          zey: { yiddish: 'זײַנען מסכּים', transliteration: 'zaynen maskem' },
        },
        past_participle: {
          yiddish: 'מסכּים געװען',
          transliteration: 'maskem geven',
        },
      },
    } satisfies Verb;

    const forms = getConditionalForms(verb);
    expect(forms).not.toBeNull();

    expect(forms!.ikh).toEqual({
      yiddish: 'וואָלט מסכּים געװען',
      transliteration: 'volt maskem geven',
    });
    expect(forms!.zey).toEqual({
      yiddish: 'וואָלטן מסכּים געװען',
      transliteration: 'voltn maskem geven',
    });
  });
});

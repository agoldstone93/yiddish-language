import { describe, expect, it } from 'vitest';

import { getFutureForms } from './future';
import type { Verb } from '@/types/verb';

describe('getFutureForms', () => {
  it('prefixes lemma with present-tense veln', () => {
    const verb: Verb = {
      id: 'geyn',
      lemma: { yiddish: 'גיין', transliteration: 'geyn' },
      meaning: { english: 'to go' },
      auxiliary: 'zayn',
      reflexive: false,
      conjugation: {
        present: {
          ich: { yiddish: 'גיי', transliteration: 'gey' },
          du: { yiddish: 'גייסט', transliteration: 'geyst' },
          er_zi_es: { yiddish: 'גייט', transliteration: 'geyt' },
          mir: { yiddish: 'גייען', transliteration: 'geyn' },
          ir: { yiddish: 'גייט', transliteration: 'geyt' },
          zey: { yiddish: 'גייען', transliteration: 'geyn' },
        },
      },
    };

    const forms = getFutureForms(verb);

    expect(forms.ich).toEqual({
      yiddish: 'וועל גיין',
      transliteration: 'vel geyn',
    });
    expect(forms.zey).toEqual({
      yiddish: 'וועלן גיין',
      transliteration: 'veln geyn',
    });
  });

  it('places zikh immediately after vel for reflexive verbs', () => {
    const verb: Verb = {
      id: 'lernen-zikh',
      lemma: { yiddish: 'לרענען זיך', transliteration: 'lernen zikh' },
      meaning: { english: 'to learn' },
      reflexive: true,
      auxiliary: 'hobn',
      conjugation: {
        present: {
          ich: { yiddish: 'לערן זיך', transliteration: 'lern zikh' },
          du: { yiddish: 'לערנסט זיך', transliteration: 'lernst zikh' },
          er_zi_es: { yiddish: 'לערנט זיך', transliteration: 'lernt zikh' },
          mir: { yiddish: 'לערנען זיך', transliteration: 'lernen zikh' },
          ir: { yiddish: 'לערנט זיך', transliteration: 'lernt zikh' },
          zey: { yiddish: 'לערנען זיך', transliteration: 'lernen zikh' },
        },
      },
    };

    const forms = getFutureForms(verb);

    expect(forms.ich).toEqual({
      yiddish: 'וועל זיך לרענען',
      transliteration: 'vel zikh lernen',
    });
    expect(forms.mir).toEqual({
      yiddish: 'וועלן זיך לרענען',
      transliteration: 'veln zikh lernen',
    });
  });
});

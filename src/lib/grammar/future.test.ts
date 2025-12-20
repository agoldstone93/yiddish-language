import { describe, expect, it } from 'vitest';

import { getFutureForms } from './future';
import type { Verb } from '@/types/verb';

describe('getFutureForms', () => {
  it('prefixes lemma with present-tense veln', () => {
    const verb: Verb = {
      id: 'geyn',
      lemma: { yiddish: 'גיין', transliteration: 'geyn' },
      auxiliary: 'zayn',
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
});

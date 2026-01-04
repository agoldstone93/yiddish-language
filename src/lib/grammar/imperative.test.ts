import { describe, expect, it } from 'vitest';

import { getImperativeForms } from './imperative';
import type { Verb } from '@/types/verb';

describe('getImperativeForms', () => {
  it('returns explicit imperative when present', () => {
    const verb = {
      id: 'zayn',
      lemma: { yiddish: 'זײַן', transliteration: 'zayn' },
      auxiliary: 'zayn',
      conjugation: {
        present: {
          ikh: { yiddish: 'בין', transliteration: 'bin' },
          du: { yiddish: 'ביסט', transliteration: 'bist' },
          er_zi_es: { yiddish: 'איז', transliteration: 'iz' },
          mir: { yiddish: 'זײַנען', transliteration: 'zaynen' },
          ir: { yiddish: 'זײַט', transliteration: 'zayt' },
          zey: { yiddish: 'זײַנען', transliteration: 'zaynen' },
        },
        imperative: {
          du: { yiddish: 'זײַ', transliteration: 'zay' },
          ir: { yiddish: 'זײַט', transliteration: 'zayt' },
        },
      },
    } satisfies Verb;

    expect(getImperativeForms(verb)).toEqual({
      du: { yiddish: 'זײַ', transliteration: 'zay' },
      ir: { yiddish: 'זײַט', transliteration: 'zayt' },
    });
  });

  it('defaults to du=ikh and ir=ir from present tense', () => {
    const verb = {
      id: 'lernen',
      lemma: { yiddish: 'לערנען', transliteration: 'lernen' },
      auxiliary: 'hobn',
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

    expect(getImperativeForms(verb)).toEqual({
      du: { yiddish: 'לערן', transliteration: 'lern' },
      ir: { yiddish: 'לערנט', transliteration: 'lernt' },
    });
  });
});

import { describe, expect, it } from 'vitest';

import { getFutureForms } from './future';
import type { Verb } from '@/types/verb';

describe('getFutureForms', () => {
  it('prefixes lemma with present-tense veln', () => {
    const verb: Verb = {
      id: 'geyn',
      lemma: { yiddish: 'גיין', transliteration: 'geyn' },
      senses: [{ english: 'to go' }],
      auxiliary: 'zayn',
      reflexive: false,
      conjugation: {
        present: {
          ikh: { yiddish: 'גיי', transliteration: 'gey' },
          du: { yiddish: 'גייסט', transliteration: 'geyst' },
          er_zi_es: { yiddish: 'גייט', transliteration: 'geyt' },
          mir: { yiddish: 'גייען', transliteration: 'geyn' },
          ir: { yiddish: 'גייט', transliteration: 'geyt' },
          zey: { yiddish: 'גייען', transliteration: 'geyn' },
        },
      },
    };

    const forms = getFutureForms(verb);

    expect(forms.ikh).toEqual({
      yiddish: 'וועל גיין',
      transliteration: 'vel geyn',
    });
    expect(forms.du).toEqual({
      yiddish: 'וועסט גיין',
      transliteration: 'vest geyn',
    });
    expect(forms.er_zi_es).toEqual({
      yiddish: 'וועט גיין',
      transliteration: 'vet geyn',
    });
    expect(forms.mir).toEqual({
      yiddish: 'וועלן גיין',
      transliteration: 'veln geyn',
    });
    expect(forms.ir).toEqual({
      yiddish: 'וועט גיין',
      transliteration: 'vet geyn',
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
      senses: [{ english: 'to learn' }],
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
      },
    };

    const forms = getFutureForms(verb);

    expect(forms.ikh).toEqual({
      yiddish: 'וועל זיך לרענען',
      transliteration: 'vel zikh lernen',
    });
    expect(forms.du).toEqual({
      yiddish: 'וועסט זיך לרענען',
      transliteration: 'vest zikh lernen',
    });
    expect(forms.er_zi_es).toEqual({
      yiddish: 'וועט זיך לרענען',
      transliteration: 'vet zikh lernen',
    });
    expect(forms.mir).toEqual({
      yiddish: 'וועלן זיך לרענען',
      transliteration: 'veln zikh lernen',
    });
    expect(forms.ir).toEqual({
      yiddish: 'וועט זיך לרענען',
      transliteration: 'vet zikh lernen',
    });
    expect(forms.zey).toEqual({
      yiddish: 'וועלן זיך לרענען',
      transliteration: 'veln zikh lernen',
    });
  });

  it('handles periphrastic lemmas without duplicating words', () => {
    const verb: Verb = {
      id: 'maskem-zayn',
      lemma: { yiddish: 'מסכּים זײַן', transliteration: 'maskem zayn' },
      senses: [{ english: 'to agree' }],
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
    };

    const forms = getFutureForms(verb);

    expect(forms.ikh).toEqual({
      yiddish: 'וועל מסכּים זײַן',
      transliteration: 'vel maskem zayn',
    });
    expect(forms.du).toEqual({
      yiddish: 'וועסט מסכּים זײַן',
      transliteration: 'vest maskem zayn',
    });
    expect(forms.er_zi_es).toEqual({
      yiddish: 'וועט מסכּים זײַן',
      transliteration: 'vet maskem zayn',
    });
    expect(forms.mir).toEqual({
      yiddish: 'וועלן מסכּים זײַן',
      transliteration: 'veln maskem zayn',
    });
    expect(forms.ir).toEqual({
      yiddish: 'וועט מסכּים זײַן',
      transliteration: 'vet maskem zayn',
    });
    expect(forms.zey).toEqual({
      yiddish: 'וועלן מסכּים זײַן',
      transliteration: 'veln maskem zayn',
    });
  });
});

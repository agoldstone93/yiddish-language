import { describe, expect, it } from 'vitest';

import { getPastForms } from './past';
import type { Verb } from '@/types/verb';

describe('getPastForms', () => {
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

    expect(getPastForms(verb)).toBeNull();
  });

  it('correctly handles simple verbs with hobn', () => {
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

    const forms = getPastForms(verb);
    expect(forms).not.toBeNull();

    expect(forms!.ikh).toEqual({
      yiddish: 'האָב געגעסן',
      transliteration: 'hob gegesen',
    });
    expect(forms!.du).toEqual({
      yiddish: 'האָסט געגעסן',
      transliteration: 'host gegesen',
    });
    expect(forms!.er_zi_es).toEqual({
      yiddish: 'האָט געגעסן',
      transliteration: 'hot gegesen',
    });
    expect(forms!.mir).toEqual({
      yiddish: 'האָבן געגעסן',
      transliteration: 'hobn gegesen',
    });
    expect(forms!.ir).toEqual({
      yiddish: 'האָט געגעסן',
      transliteration: 'hot gegesen',
    });
    expect(forms!.zey).toEqual({
      yiddish: 'האָבן געגעסן',
      transliteration: 'hobn gegesen',
    });
  });
  
  it('correctly handles simple verbs with zayn', () => {
    const verb = {
      id: 'geyn',
      lemma: { yiddish: 'גיין', transliteration: 'geyn' },
      meaning: { english: 'to go' },
      auxiliary: 'zayn',
      reflexive: false,
      conjugation: {
        present: {
          ikh: { yiddish: 'גיי', transliteration: 'gey' },
          du: { yiddish: 'גייסט', transliteration: 'geyst' },
          er_zi_es: { yiddish: 'גייט', transliteration: 'geyt' },
          mir: { yiddish: 'גייען', transliteration: 'geyen' },
          ir: { yiddish: 'גייט', transliteration: 'geyt' },
          zey: { yiddish: 'גייען', transliteration: 'geyen' },
        },
        past_participle: { yiddish: 'געגאַנגען', transliteration: 'gegangen' },
      },
    } satisfies Verb;

    const forms = getPastForms(verb);
    expect(forms).not.toBeNull();

    expect(forms!.ikh).toEqual({
      yiddish: 'בין געגאַנגען',
      transliteration: 'bin gegangen',
    });
    expect(forms!.du).toEqual({
      yiddish: 'ביסט געגאַנגען',
      transliteration: 'bist gegangen',
    });
    expect(forms!.er_zi_es).toEqual({
      yiddish: 'איז געגאַנגען',
      transliteration: 'iz gegangen',
    });
    expect(forms!.mir).toEqual({
      yiddish: 'זײַנען געגאַנגען',
      transliteration: 'zaynen gegangen',
    });
    expect(forms!.ir).toEqual({
      yiddish: 'זײַט געגאַנגען',
      transliteration: 'zayt gegangen',
    });
    expect(forms!.zey).toEqual({
      yiddish: 'זײַנען געגאַנגען',
      transliteration: 'zaynen gegangen',
    });
  });

  it('correctly handles reflexive verbs', () => {
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

    const forms = getPastForms(verb);
    expect(forms).not.toBeNull();

    expect(forms!.ikh).toEqual({
      yiddish: 'האָב זיך געלערנט',
      transliteration: 'hob zikh gelernt',
    });
    expect(forms!.du).toEqual({
      yiddish: 'האָסט זיך געלערנט',
      transliteration: 'host zikh gelernt',
    });
    expect(forms!.er_zi_es).toEqual({
      yiddish: 'האָט זיך געלערנט',
      transliteration: 'hot zikh gelernt',
    });
    expect(forms!.mir).toEqual({
      yiddish: 'האָבן זיך געלערנט',
      transliteration: 'hobn zikh gelernt',
    });
    expect(forms!.ir).toEqual({
      yiddish: 'האָט זיך געלערנט',
      transliteration: 'hot zikh gelernt',
    });
    expect(forms!.zey).toEqual({
      yiddish: 'האָבן זיך געלערנט',
      transliteration: 'hobn zikh gelernt',
    });
  });

  it('correctly handles periphrastic verbs', () => {
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

    const forms = getPastForms(verb);
    expect(forms).not.toBeNull();

    expect(forms!.ikh).toEqual({
      yiddish: 'האָב מסכּים געװען',
      transliteration: 'hob maskem geven',
    });
    expect(forms!.du).toEqual({
      yiddish: 'האָסט מסכּים געװען',
      transliteration: 'host maskem geven',
    });
    expect(forms!.er_zi_es).toEqual({
      yiddish: 'האָט מסכּים געװען',
      transliteration: 'hot maskem geven',
    });
    expect(forms!.mir).toEqual({
      yiddish: 'האָבן מסכּים געװען',
      transliteration: 'hobn maskem geven',
    });
    expect(forms!.ir).toEqual({
      yiddish: 'האָט מסכּים געװען',
      transliteration: 'hot maskem geven',
    });
    expect(forms!.zey).toEqual({
      yiddish: 'האָבן מסכּים געװען',
      transliteration: 'hobn maskem geven',
    });
  });
  
  it('correctly handles separable-prefix verbs', () => {
    const verb = {
      id: 'aroysnemen',
      lemma: { yiddish: 'אַרױסנעמען', transliteration: 'aroysnemen' },
      meaning: { english: 'to take out' },
      reflexive: false,
      auxiliary: 'hobn',
      conjugation: {
        present: {
          ikh: { yiddish: 'נעם אַרױס', transliteration: 'nem aroys' },
          du: { yiddish: 'נעמסט אַרױס', transliteration: 'nemst aroys' },
          er_zi_es: { yiddish: 'נעמט אַרױס', transliteration: 'nemt aroys' },
          mir: { yiddish: 'נעמען אַרױס', transliteration: 'nemen aroys' },
          ir: { yiddish: 'נעמט אַרױס', transliteration: 'nemt aroys' },
          zey: { yiddish: 'נעמען אַרױס', transliteration: 'nemen aroys' },
        },
        past_participle: {
          yiddish: 'אַרױסגענומען',
          transliteration: 'aroysgenumen',
        },
      },
    } satisfies Verb;

    const forms = getPastForms(verb);
    expect(forms).not.toBeNull();

    expect(forms!.ikh).toEqual({
      yiddish: 'האָב אַרױסגענומען',
      transliteration: 'hob aroysgenumen',
    });
    expect(forms!.du).toEqual({
      yiddish: 'האָסט אַרױסגענומען',
      transliteration: 'host aroysgenumen',
    });
    expect(forms!.er_zi_es).toEqual({
      yiddish: 'האָט אַרױסגענומען',
      transliteration: 'hot aroysgenumen',
    });
    expect(forms!.mir).toEqual({
      yiddish: 'האָבן אַרױסגענומען',
      transliteration: 'hobn aroysgenumen',
    });
    expect(forms!.ir).toEqual({
      yiddish: 'האָט אַרױסגענומען',
      transliteration: 'hot aroysgenumen',
    });
    expect(forms!.zey).toEqual({
      yiddish: 'האָבן אַרױסגענומען',
      transliteration: 'hobn aroysgenumen',
    });
  });
});

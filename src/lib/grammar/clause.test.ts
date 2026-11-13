import { describe, expect, it } from 'vitest';

import {
  formatClause,
  formatClauseSegments,
  formatPersonClause,
  formatPersonClauseSegments,
  type ClauseParts,
} from './clause';

const combinations = [
  {
    name: 'affirmative declarative',
    options: { negative: false, inverted: false },
    yiddish: 'דו קומסט',
    transliteration: 'du kumst',
  },
  {
    name: 'negative declarative',
    options: { negative: true, inverted: false },
    yiddish: 'דו קומסט נישט',
    transliteration: 'du kumst nisht',
  },
  {
    name: 'affirmative inverted',
    options: { negative: false, inverted: true },
    yiddish: 'קומסטו',
    transliteration: 'kumstu',
  },
  {
    name: 'negative inverted',
    options: { negative: true, inverted: true },
    yiddish: 'קומסטו נישט',
    transliteration: 'kumstu nisht',
  },
] as const;

const tenseExamples: { name: string; parts: ClauseParts; expected: string[] }[] = [
  {
    name: 'present',
    parts: {
      subject: { yiddish: 'דו', transliteration: 'du' },
      verbPhrase: { yiddish: 'קומסט', transliteration: 'kumst' },
      invertedSubjectSuffix: { yiddish: 'ו', transliteration: 'u' },
      inversion: 'suffix',
    },
    expected: ['דו קומסט', 'דו קומסט נישט', 'קומסטו', 'קומסטו נישט'],
  },
  {
    name: 'past',
    parts: {
      subject: { yiddish: 'דו', transliteration: 'du' },
      verbPhrase: { yiddish: 'ביסט געקומען', transliteration: 'bist gekumen' },
      invertedSubjectSuffix: { yiddish: 'ו', transliteration: 'u' },
      inversion: 'suffix',
    },
    expected: [
      'דו ביסט געקומען',
      'דו ביסט נישט געקומען',
      'ביסטו געקומען',
      'ביסטו נישט געקומען',
    ],
  },
  {
    name: 'future',
    parts: {
      subject: { yiddish: 'דו', transliteration: 'du' },
      verbPhrase: { yiddish: 'וועסט קומען', transliteration: 'vest kumen' },
      invertedSubjectSuffix: { yiddish: 'ו', transliteration: 'u' },
      inversion: 'suffix',
    },
    expected: [
      'דו וועסט קומען',
      'דו וועסט נישט קומען',
      'וועסטו קומען',
      'וועסטו נישט קומען',
    ],
  },
  {
    name: 'conditional',
    parts: {
      subject: { yiddish: 'איך', transliteration: 'ikh' },
      verbPhrase: { yiddish: 'וואָלט געקומען', transliteration: 'volt gekumen' },
      inversion: 'separate',
    },
    expected: [
      'איך וואָלט געקומען',
      'איך וואָלט נישט געקומען',
      'וואָלט איך געקומען',
      'וואָלט איך נישט געקומען',
    ],
  },
];

describe('formatClause', () => {
  it.each(tenseExamples)('formats all four $name combinations', ({ parts, expected }) => {
    combinations.forEach(({ options }, index) => {
      expect(formatClause(parts, options).yiddish).toBe(expected[index]);
    });

  });

  it.each(combinations)(
    'formats present as $name',
    ({ options, yiddish, transliteration }) => {
      const parts = tenseExamples[0].parts;
      expect(formatClause(parts, options)).toEqual({ yiddish, transliteration });
    },
  );

  it.each([
    {
      name: 'singular',
      parts: {
        verbPhrase: { yiddish: 'קום', transliteration: 'kum' },
        inversion: 'none',
      } satisfies ClauseParts,
      affirmative: { yiddish: 'קום', transliteration: 'kum' },
      negative: { yiddish: 'קום נישט', transliteration: 'kum nisht' },
    },
    {
      name: 'plural',
      parts: {
        verbPhrase: { yiddish: 'קומט', transliteration: 'kumt' },
        inversion: 'none',
      } satisfies ClauseParts,
      affirmative: { yiddish: 'קומט', transliteration: 'kumt' },
      negative: { yiddish: 'קומט נישט', transliteration: 'kumt nisht' },
    },
  ])('does not invert the $name imperative', ({ parts, affirmative, negative }) => {
    for (const inverted of [false, true]) {
      expect(formatClause(parts, { negative: false, inverted })).toEqual(affirmative);
      expect(formatClause(parts, { negative: true, inverted })).toEqual(negative);
    }
  });

  it('does not add a second נישט to a verb phrase that is already negative', () => {
    const parts: ClauseParts = {
      verbPhrase: { yiddish: 'טאָר נישט', transliteration: 'tor nisht' },
      inversion: 'none',
    };

    expect(formatClause(parts, { negative: true, inverted: false })).toEqual({
      yiddish: 'טאָר נישט',
      transliteration: 'tor nisht',
    });
  });
});

describe('formatPersonClause', () => {
  it.each(combinations)(
    'formats the du subject as $name',
    ({ options, yiddish, transliteration }) => {
      expect(formatPersonClause(
        'du',
        { yiddish: 'קומסט', transliteration: 'kumst' },
        options,
      )).toEqual({ yiddish, transliteration });
    },
  );

  it.each([
    ['ikh', 'איך', 'ikh'],
    ['er_zi_es', 'ער/זי/עס', 'er/zi/es'],
    ['mir', 'מיר', 'mir'],
    ['ir', 'איר', 'ir'],
    ['zey', 'זיי', 'zey'],
  ] as const)('places %s after the finite verb', (person, yiddish, transliteration) => {
    expect(formatPersonClause(
      person,
      { yiddish: 'וואָלט געקומען', transliteration: 'volt gekumen' },
      { negative: true, inverted: true },
    )).toEqual({
      yiddish: `וואָלט ${yiddish} נישט געקומען`,
      transliteration: `volt ${transliteration} nisht gekumen`,
    });
  });

  it('suffixes du to the auxiliary rather than the whole verb phrase', () => {
    expect(formatPersonClause(
      'du',
      { yiddish: 'ביסט געקומען', transliteration: 'bist gekumen' },
      { negative: true, inverted: true },
    )).toEqual({
      yiddish: 'ביסטו נישט געקומען',
      transliteration: 'bistu nisht gekumen',
    });
  });

  it('labels the attached pronoun separately without introducing a space', () => {
    expect(formatPersonClauseSegments(
      'du',
      { yiddish: 'ביסט געקומען', transliteration: 'bist gekumen' },
      { negative: true, inverted: true },
    )).toEqual([
      { role: 'verb', text: 'ביסט', spaceBefore: false },
      { role: 'pronoun', text: 'ו', spaceBefore: false },
      { role: 'negation', text: 'נישט', spaceBefore: true },
      { role: 'verb', text: 'געקומען', spaceBefore: true },
    ]);
  });

  it('labels reflexive pronouns and existing negation within the phrase', () => {
    expect(formatClauseSegments(
      {
        verbPhrase: { yiddish: 'שעם זיך נישט', transliteration: 'shem zikh nisht' },
        inversion: 'none',
      },
      { negative: true, inverted: false },
    )).toEqual([
      { role: 'verb', text: 'שעם', spaceBefore: false },
      { role: 'verb', text: 'זיך', spaceBefore: true },
      { role: 'negation', text: 'נישט', spaceBefore: true },
    ]);
  });

  it('places zikh after subject in inverted reflexive verb phrases', () => {
    expect(formatPersonClause(
      'ikh',
      { yiddish: 'וועל זיך טרעפֿן', transliteration: 'vel zikh trefn' },
      { negative: true, inverted: true },
    )).toEqual({
      yiddish: 'וועל איך זיך נישט טרעפֿן',
      transliteration: 'vel ikh zikh nisht trefn',
    });
  });
});
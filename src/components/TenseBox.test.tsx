import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { TenseBox } from './TenseBox';

describe('TenseBox inversion', () => {
  it.each([
    { inverted: false, negative: false, expected: 'דו קומסט' },
    { inverted: false, negative: true, expected: 'דו קומסט נישט' },
    { inverted: true, negative: false, expected: 'קומסטו' },
    { inverted: true, negative: true, expected: 'קומסטו נישט' },
  ])('renders $expected', ({ inverted, negative, expected }) => {
    const markup = renderToStaticMarkup(createElement(TenseBox, {
      title: 'Present',
      forms: { du: { yiddish: 'קומסט', transliteration: 'kumst' } },
      inverted,
      negative,
    }));
    const container = document.createElement('div');
    container.innerHTML = markup;

    expect(container.querySelector('h2')?.nextElementSibling?.textContent).toBe(expected);
    expect(container.querySelector('.clause-verb')?.textContent?.trim())
      .toBe(inverted ? 'קומסטו' : 'קומסט');
    expect(container.querySelector('.clause-pronoun')?.textContent ?? null)
      .toBe(inverted ? null : 'דו');
  });

  it('keeps imperative labels and does not add a subject when inverted', () => {
    const markup = renderToStaticMarkup(createElement(TenseBox, {
      title: 'Imperative',
      forms: { du: { yiddish: 'קום', transliteration: 'kum' } },
      imperative: true,
      inverted: true,
      negative: true,
      labelOverrides: { du: 'singular:' },
    }));
    const container = document.createElement('div');
    container.innerHTML = markup;

    expect(container.querySelector('h2')?.nextElementSibling?.textContent)
      .toBe('singular: קום נישט');
  });

  it('styles the joined word as a verb and keeps negation separate', () => {
    const markup = renderToStaticMarkup(createElement(TenseBox, {
      title: 'Past',
      forms: { du: { yiddish: 'ביסט געקומען', transliteration: 'bist gekumen' } },
      inverted: true,
      negative: true,
    }));
    const container = document.createElement('div');
    container.innerHTML = markup;
    const clause = container.querySelector('[lang="yi"]');

    expect(clause?.getAttribute('dir')).toBe('rtl');
    expect(clause?.textContent).toBe('ביסטו נישט געקומען');
    expect(clause?.querySelector('.clause-pronoun')).toBeNull();
    expect(clause?.querySelector('.clause-negation')?.textContent).toBe(' נישט');
    expect(Array.from(clause?.querySelectorAll('.clause-verb') ?? [])
      .map((element) => element.textContent?.trim())).toEqual(['ביסטו', 'געקומען']);
  });
});

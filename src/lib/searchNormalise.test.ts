import { describe, expect, it } from 'vitest';
import { normaliseForSearch } from './searchNormalise';

describe('normaliseForSearch', () => {
  it('normalizes ײַ to יי', () => {
    expect(normaliseForSearch('ווײַזן')).toBe('ווייזנ');
  });

  it('normalizes ײ to יי', () => {
    expect(normaliseForSearch('ווײזן')).toBe('ווייזנ');
  });

  it('normalizes װ to וו', () => {
    expect(normaliseForSearch('װייזן')).toBe('ווייזנ');
  });

  it('all three variants normalize to the same string', () => {
    const variants = ['ווײַזן', 'ווײזן', 'ווייזן', 'װייזן', 'װײזן', 'װײַזן'];
    const normalized = variants.map(normaliseForSearch);
    expect(new Set(normalized).size).toBe(1);
  });

  it('strips niqqud', () => {
    expect(normaliseForSearch('מײַנע')).toBe('מיינע');
  });

  it('maps final forms', () => {
    expect(normaliseForSearch('ךםןףץ')).toBe('כמנפצ');
  });

  it('lowercases Latin text', () => {
    expect(normaliseForSearch('Vayzn')).toBe('vayzn');
  });

  it('strips Latin diacritics', () => {
    expect(normaliseForSearch('shtúbn')).toBe('shtubn');
  });

  it('returns empty string for null/undefined/empty', () => {
    expect(normaliseForSearch(null)).toBe('');
    expect(normaliseForSearch(undefined)).toBe('');
    expect(normaliseForSearch('')).toBe('');
  });
});
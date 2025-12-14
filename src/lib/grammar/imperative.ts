import { Verb, VerbForm } from '@/types/verb';

export function getImperativeForms(
  verb: Verb
): Partial<Record<'du' | 'ir', VerbForm>> | null {
  // Explicit imperative (only זayn)
  if (verb.conjugation.imperative) {
    return verb.conjugation.imperative;
  }

  const { present } = verb.conjugation;
  if (!present?.ich || !present.ir) return null;

  return {
    du: present.ich,
    ir: present.ir,
  };
}

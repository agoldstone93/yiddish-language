import type { Verb } from "@/types/verb";
import { getAllVerbs } from "@/lib/verbs";

export type SearchEntry = {
  id: string;
  href: string;
  yiddish: string;
  transliteration: string;
  english: string[];
  searchTerms: string[];
};

export function buildVerbSearchIndex(verbs: Verb[]): SearchEntry[] {
  return verbs.map((verb) => {
    const english = [
      ...(verb.senses ?? []).map((sense) => sense.english),
      ...(verb.search?.english ?? []),
    ].filter((value): value is string => Boolean(value));

    const searchTerms = [
      verb.lemma.yiddish,
      verb.lemma.transliteration,
      ...english,
      ...(verb.search?.yiddish ?? []),
      ...(verb.search?.transliteration ?? []),
    ].filter((value): value is string => Boolean(value));

    return {
      id: verb.id,
      href: "/verbs/" + verb.id,
      yiddish: verb.lemma.yiddish,
      transliteration: verb.lemma.transliteration,
      english,
      searchTerms,
    };
  });
}

export function getVerbSearchIndex(): SearchEntry[] {
  return buildVerbSearchIndex(getAllVerbs());
}
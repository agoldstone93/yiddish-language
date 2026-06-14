type NounSense = {
  english: string;
  number?: "countable" | "uncountable" | "invariant" | "plural-only" | "collective";
  plural?: {
    yiddish: string;
    transliteration: string;
  };
  notes?: string[];
};

export type Noun = {
  id: string;
  lemma: {
    yiddish: string;
    transliteration: string;
  };
  gender: "masculine" | "feminine" | "neuter";
  number: "countable" | "uncountable" | "invariant" | "plural-only" | "collective";
  plural?: {
    yiddish: string;
    transliteration: string;
  };
  senses: NounSense[];
  search?: {
    yiddish?: string[];
    transliteration?: string[];
    english?: string[];
  };
  notes?: string[];
};
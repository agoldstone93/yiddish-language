export type Noun = {
  id: string;
  lemma: {
    yiddish: string;
    transliteration: string;
  };
  meaning: {
    english: string;
  };
  gender: "masculine" | "feminine" | "neuter";
  plural?: {
    yiddish: string;
    transliteration: string;
  };
  search?: {
    yiddish?: string[];
    transliteration?: string[];
    english?: string[];
  };
  notes?: string[];
};
// types/verb.ts

export type Person =
  | 'ich'
  | 'du'
  | 'er_zi_es'
  | 'mir'
  | 'ir'
  | 'zey';

export type VerbForm = {
  yiddish: string;
  transliteration: string;
};

export type Conjugation = {
  present: Record<Person, VerbForm>;
  past_participle?: VerbForm;
  imperative?: Partial<Record<'du' | 'ir', VerbForm>>;
};

export type Verb = {
  id: string;
  lemma: {
    yiddish: string;
    transliteration: string;
  };
  auxiliary: 'zayn' | 'hobn';
  meaning?: {
    english: string;
  };
  reflexive?: boolean;
  conjugation: Conjugation;
  notes?: string[];
};

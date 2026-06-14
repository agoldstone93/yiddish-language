// types/verb.ts

export type Person =
  | 'ikh'
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

type VerbSense = {
  english: string;
  notes?: string[];
}


export type Verb = {
  id: string;
  lemma: {
    yiddish: string;
    transliteration: string;
  };
  auxiliary: 'zayn' | 'hobn';
  senses: VerbSense[];
  reflexive: boolean;
  categoryId?: string;
  search?: {
    yiddish?: string[];
    transliteration?: string[];
    english?: string[];
  };
  conjugation: Conjugation;
  notes?: string[];
};

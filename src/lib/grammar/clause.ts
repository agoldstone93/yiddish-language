import type { Person, VerbForm } from '@/types/verb';

const subjects: Record<Person, VerbForm> = {
  ikh: { yiddish: 'איך', transliteration: 'ikh' },
  du: { yiddish: 'דו', transliteration: 'du' },
  er_zi_es: { yiddish: 'ער/זי/עס', transliteration: 'er/zi/es' },
  mir: { yiddish: 'מיר', transliteration: 'mir' },
  ir: { yiddish: 'איר', transliteration: 'ir' },
  zey: { yiddish: 'זיי', transliteration: 'zey' },
};

type ClauseBase = {
  verbPhrase: VerbForm;
};

export type ClauseParts =
  | (ClauseBase & {
      subject: VerbForm;
      invertedSubjectSuffix: VerbForm;
      inversion: 'suffix';
    })
  | (ClauseBase & {
      subject: VerbForm;
      inversion: 'separate';
    })
  | (ClauseBase & {
      subject?: VerbForm;
      inversion: 'none';
    });

export type ClauseOptions = {
  negative: boolean;
  inverted: boolean;
};

export type ClauseSegment = {
  role: 'pronoun' | 'verb' | 'negation';
  text: string;
  spaceBefore: boolean;
};

function getPersonClauseParts(
  person: Person,
  verbPhrase: VerbForm,
): ClauseParts {
  const subject = subjects[person];
  const parts: ClauseParts = person === 'du'
    ? {
        subject,
        verbPhrase,
        inversion: 'suffix',
        invertedSubjectSuffix: { yiddish: 'ו', transliteration: 'u' },
      }
    : { subject, verbPhrase, inversion: 'separate' };

  return parts;
}

export function formatPersonClause(
  person: Person,
  verbPhrase: VerbForm,
  options: ClauseOptions,
): VerbForm {
  return formatClause(getPersonClauseParts(person, verbPhrase), options);
}

export function formatPersonClauseSegments(
  person: Person,
  verbPhrase: VerbForm,
  options: ClauseOptions,
): ClauseSegment[] {
  return formatClauseSegments(getPersonClauseParts(person, verbPhrase), options);
}

const nisht: VerbForm = {
  yiddish: 'נישט',
  transliteration: 'nisht',
};

function buildClauseSegments(
  parts: ClauseParts,
  options: ClauseOptions,
  language: keyof VerbForm,
): ClauseSegment[] {
  const inverted = options.inverted && parts.inversion !== 'none';
  const [verb, ...remainder] = parts.verbPhrase[language].trim().split(/\s+/);
  const segments: ClauseSegment[] = [];
  const append = (
    text: string,
    role: ClauseSegment['role'],
    attached = false,
  ) => {
    segments.push({ text, role, spaceBefore: segments.length > 0 && !attached });
  };

  if (!inverted && parts.subject) {
    append(parts.subject[language], 'pronoun');
  }

  append(verb, 'verb');

  if (inverted && parts.inversion === 'suffix') {
    append(parts.invertedSubjectSuffix[language], 'pronoun', true);
  } else if (inverted && parts.inversion === 'separate') {
    append(parts.subject[language], 'pronoun');
  }

  // Extract and handle reflexive pronoun (зиך) if present in remainder
  const zikhIndex = remainder.findIndex(word => word === (language === 'yiddish' ? 'זיך' : 'zikh'));
  const hasZikh = zikhIndex !== -1;
  
  // If there's a zikh, add it right after the verb/subject (before negation)
  if (hasZikh) {
    append(remainder[zikhIndex], 'verb');
  }

  const alreadyNegative = parts.verbPhrase.yiddish
    .trim()
    .split(/\s+/)
    .includes(nisht.yiddish);

  if (options.negative && !alreadyNegative) {
    append(nisht[language], 'negation');
  }

  // Add remaining words, excluding the already-added zikh
  for (let i = 0; i < remainder.length; i++) {
    if (i === zikhIndex) {
      continue; // Already added above
    }
    const word = remainder[i];
    append(
      word,
      word === nisht[language]
        ? 'negation'
        : 'verb',
    );
  }

  return segments;
}

export function formatClauseSegments(
  parts: ClauseParts,
  options: ClauseOptions,
): ClauseSegment[] {
  return buildClauseSegments(parts, options, 'yiddish');
}

export function formatClause(
  parts: ClauseParts,
  options: ClauseOptions,
): VerbForm {
  const text = (language: keyof VerbForm) => buildClauseSegments(parts, options, language)
    .map((segment) => `${segment.spaceBefore ? ' ' : ''}${segment.text}`)
    .join('');

  return {
    yiddish: text('yiddish'),
    transliteration: text('transliteration'),
  };
}
import type { ReactNode } from 'react';
import { Person, VerbForm } from '@/types/verb';
import {
  formatClauseSegments,
  formatPersonClauseSegments,
  type ClauseSegment,
} from '@/lib/grammar/clause';

export function TenseBox({
  title,
  forms,
  labelOverrides,
  negative = false,
  inverted = false,
  imperative = false,
}: {
  title: string;
  forms: Partial<Record<Person, VerbForm>>;
  labelOverrides?: Partial<Record<Person, ReactNode>>;
  negative?: boolean;
  inverted?: boolean;
  imperative?: boolean;
}) {
  return (
    <div className="bg-surface-panel p-4">
      <h2 className="font-semibold text-center mb-2">{title}</h2>
      {Object.entries(forms).map(([person, form]) => {
        if (!form) return null;

        const segments = imperative
          ? formatClauseSegments(
              { verbPhrase: form, inversion: 'none' },
              { negative, inverted: false },
            )
          : formatPersonClauseSegments(person as Person, form, { negative, inverted });
        const label = labelOverrides?.[person as Person];
        const words: ClauseSegment[] = [];
        for (const segment of segments) {
          const previous = words[words.length - 1];
          if (previous && !segment.spaceBefore) {
            previous.text += segment.text;
          } else {
            words.push({ ...segment });
          }
        }

        return (
          <div key={person} className="text-center text-text-secondary font-yiddish">
            {imperative && label != null && (
              <span className="text-text-secondary">{label}{' '}</span>
            )}
            <span lang="yi" dir="rtl">
              {words.map((segment, index) => (
                <span
                  key={index}
                  className={`clause-${segment.role}`}
                >
                  {segment.spaceBefore ? ' ' : ''}{segment.text}
                </span>
              ))}
            </span>
          </div>
        );
      })}
    </div>
  );
}

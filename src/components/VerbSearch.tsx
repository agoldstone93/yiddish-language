import { useCombobox } from 'downshift';
import { useRouter } from 'next/router';
import { startTransition, useCallback, useEffect, useMemo, useState } from 'react';
import type { Verb } from '@/types/verb';

export type VerbSearchProps = {
  verbs: Verb[];
  placeholder?: string;
  maxResults?: number;
  className?: string;
  inputClassName?: string;
  menuClassName?: string;
  onSelect?: (verb: Verb) => void;
  activeVerbId?: string;
};

const DEFAULT_MAX_RESULTS = 10;

// Normalize text for flexible matching across Yiddish/Hebrew and Latin inputs
function normalizeForSearch(value: string | undefined | null): string {
  if (!value) return '';
  let text = value.normalize('NFD').toLowerCase();
  // Strip Hebrew cantillation + niqqud (U+0591–U+05C7)
  text = text.replace(/[\u0591-\u05C7]/g, '');
  // Strip Latin combining marks
  text = text.replace(/[\u0300-\u036f]/g, '');
  // Map final Hebrew forms to standard forms
  text = text.replace(/[ךםןףץ]/g, (ch) => ({
    'ך': 'כ',
    'ם': 'מ',
    'ן': 'נ',
    'ף': 'פ',
    'ץ': 'צ',
  } as Record<string, string>)[ch] || ch);
  // Remove punctuation often used in Yiddish orthography and dashes/quotes
  text = text.replace(/[\u05BE\u05F3\u05F4\u2010-\u2015'"-]/g, '');
  // Collapse whitespace
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

export function VerbSearch({
  verbs,
  placeholder = 'Search verbs…',
  maxResults = DEFAULT_MAX_RESULTS,
  className = '',
  inputClassName = '',
  menuClassName = '',
  onSelect,
  activeVerbId,
}: VerbSearchProps) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');

  const matches = useMemo(() => {
    const needle = normalizeForSearch(inputValue);
    if (!needle) {
      return [];
    }
    return verbs
      .filter((entry) => {
        const haystack = [
          entry.lemma?.yiddish,
          entry.lemma?.transliteration,
          entry.meaning?.english,
          ...(entry.search?.yiddish ?? []),
          ...(entry.search?.transliteration ?? []),
          ...(entry.search?.english ?? []),
        ].filter((value): value is string => Boolean(value));
        return haystack.some((value) => normalizeForSearch(value).includes(needle));
      })
      .slice(0, maxResults);
  }, [inputValue, maxResults, verbs]);

  const handleSelect = useCallback(
    (selected: Verb | null | undefined) => {
      if (!selected) {
        return;
      }
      setInputValue('');
      if (onSelect) {
        onSelect(selected);
        return;
      }
      void router.push(`/verbs/${selected.id}`);
    },
    [onSelect, router]
  );

  const { getInputProps, getItemProps, getMenuProps, highlightedIndex, isOpen } =
    useCombobox<Verb>({
      inputValue,
      items: matches,
      // We control input updates via the input's onChange to respect IME composition
      onSelectedItemChange: ({ selectedItem }) => handleSelect(selectedItem),
      itemToString: (item) =>
        item ? `${item.lemma.yiddish} — ${item.lemma.transliteration}` : '',
    });

  useEffect(() => {
    if (activeVerbId) {
      startTransition(() => setInputValue(''));
    }
  }, [activeVerbId]);

  const inputProps = getInputProps({
    placeholder,
    onCompositionEnd: (e: React.CompositionEvent<HTMLInputElement>) => {
      // Ensure the final composed value is captured
      setInputValue(e.currentTarget.value);
    },
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      // Always mirror the raw input value; do not transform while typing
      setInputValue(e.target.value);
    },
    autoComplete: 'off',
    autoCorrect: 'off',
    autoCapitalize: 'none',
    spellCheck: false,
  });
  const menuProps = getMenuProps({}, { suppressRefError: true });
  const showMenu = isOpen && Boolean(inputValue);

  return (
    <div className={`relative ${className}`.trim()}>
      <input
        className={`w-full rounded border border-gray-300 dark:border-gray-700
          bg-orange-100 dark:bg-gray-800
          px-4 py-3 text-lg dark:text-gray-100
          dark:placeholder-gray-500 placeholder-gray-600
          focus:outline-none focus:ring-2 focus:ring-blue-400 ${inputClassName}`.trim()}
        {...inputProps}
      />
      <ul
        className={`absolute left-0 right-0 top-full z-20 mt-2 max-h-80 overflow-auto 
                    rounded border border-gray-300 dark:border-gray-700 bg-orange-100
                    dark:bg-gray-900 text-gray-900 dark:text-gray-100
                    shadow-lg divide-y divide-gray-300 dark:divide-gray-700 ${
          showMenu ? '' : 'hidden'
        } ${menuClassName}`.trim()}
        {...menuProps}
      >
        {showMenu && matches.map((entry, index) => (
          <li
            key={entry.id}
            className={`cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-gray-200 dark:hover:bg-gray-800 ${
              highlightedIndex === index ? 'bg-gray-700' : ''
            }`}
            {...getItemProps({ item: entry, index })}
          >
            <div className="text-base font-medium">
              {entry.lemma.yiddish} — {entry.meaning.english}
            </div>
            {entry.meaning?.english && (
              <div className="text-xs text-gray-600 dark:text-gray-400">{entry.lemma.transliteration}</div>
            )}
          </li>
        ))}
        {showMenu && matches.length === 0 && (
          <li className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
            <a 
              href="/admin/#/collections/verbs/new" 
              className="block -mx-4 -my-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              No matches found. Click here to add this verb
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}

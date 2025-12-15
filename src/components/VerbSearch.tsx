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
    const needle = inputValue.trim().toLowerCase();
    if (!needle) {
      return [];
    }
    return verbs
      .filter((entry) => {
        const haystack = [
          entry.lemma?.yiddish,
          entry.lemma?.transliteration,
          entry.meaning?.english,
        ].filter((value): value is string => Boolean(value));
        return haystack.some((value) => value.toLowerCase().includes(needle));
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
      onInputValueChange: ({ inputValue }) => setInputValue(inputValue ?? ''),
      onSelectedItemChange: ({ selectedItem }) => handleSelect(selectedItem),
      itemToString: (item) =>
        item ? `${item.lemma.yiddish} — ${item.lemma.transliteration}` : '',
    });

  useEffect(() => {
    if (activeVerbId) {
      startTransition(() => setInputValue(''));
    }
  }, [activeVerbId]);

  const inputProps = getInputProps({ placeholder });
  const menuProps = getMenuProps({}, { suppressRefError: true });
  const showMenu = isOpen && Boolean(inputValue);

  return (
    <div className={`relative ${className}`.trim()}>
      <input
        className={`w-full rounded border border-gray-700 bg-gray-800 px-4 py-3 text-lg text-gray-100 shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 ${inputClassName}`.trim()}
        {...inputProps}
      />
      <ul
        className={`absolute left-0 right-0 top-full z-20 mt-2 max-h-80 overflow-auto rounded border border-gray-700 bg-gray-900 text-gray-100 shadow-lg divide-y divide-gray-700 ${
          showMenu ? '' : 'hidden'
        } ${menuClassName}`.trim()}
        {...menuProps}
      >
        {showMenu && matches.map((entry, index) => (
          <li
            key={entry.id}
            className={`cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-gray-800 ${
              highlightedIndex === index ? 'bg-gray-700' : ''
            }`}
            {...getItemProps({ item: entry, index })}
          >
            <div className="text-base font-medium">
              {entry.lemma.yiddish} — {entry.lemma.transliteration}
            </div>
            {entry.meaning?.english && (
              <div className="text-xs text-gray-400">{entry.meaning.english}</div>
            )}
          </li>
        ))}
        {showMenu && matches.length === 0 && (
          <li className="px-4 py-2 text-sm text-gray-400">No matches.</li>
        )}
      </ul>
    </div>
  );
}

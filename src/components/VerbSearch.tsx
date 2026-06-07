import { useCombobox } from 'downshift';
import { useRouter } from 'next/router';
import { startTransition, useCallback, useEffect, useMemo, useState } from 'react';
import { SearchEntry } from '@/lib/searchIndex';
import { normaliseForSearch } from '@/lib/searchNormalise';

export type VerbSearchProps = {
  verbs: SearchEntry[];
  placeholder?: string;
  maxResults?: number;
  className?: string;
  inputClassName?: string;
  menuClassName?: string;
  onSelect?: (verb: SearchEntry) => void;
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
    const needle = normaliseForSearch(inputValue);
    if (!needle) return [];

    return verbs
      .filter((entry) =>
        entry.searchTerms.some((value) =>
          normaliseForSearch(value).includes(needle)
        )
      )
      .slice(0, maxResults);
  }, [inputValue, maxResults, verbs]);

  const handleSelect = useCallback(
    (selected: SearchEntry | null | undefined) => {
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
    useCombobox<SearchEntry>({
      inputValue,
      items: matches,
      // We control input updates via the input's onChange to respect IME composition
      onSelectedItemChange: ({ selectedItem }) => handleSelect(selectedItem),
      itemToString: (item) =>
        item ? `${item.yiddish} — ${item.transliteration}` : '',
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
        className={`w-full rounded border border-border-default
          bg-surface-panel px-4 py-3 text-lg placeholder-text-secondary
          focus:outline-none focus:ring-2 focus:ring-blue-400 ${inputClassName}`.trim()}
        {...inputProps}
      />
      <ul
        className={`absolute left-0 right-0 top-full z-20 mt-2 max-h-80 overflow-auto
                    rounded border border-border-default text-foreground
                    bg-orange-100 dark:bg-gray-900 
                    shadow-lg divide-y divide-border-default ${
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
            <div className="text-base">
              {entry.yiddish} — {entry.english[0] ?? ""}
            </div>
            <div className="text-xs text-text-secondary">
              {entry.transliteration}
            </div>
          </li>
        ))}
        {showMenu && matches.length === 0 && (
          <li className="px-4 py-2 text-sm text-text-secondary">
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

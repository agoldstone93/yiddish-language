import { useEffect, useState } from 'react';
import type { SearchEntry } from './searchIndex';

export function useSearchIndex() {
  const [verbs, setVerbs] = useState<SearchEntry[]>([]);
  useEffect(() => {
    fetch('/search-index.json').then(r => r.json()).then(setVerbs);
  }, []);
  return verbs;
}
import { useEffect, useState } from 'react';
import type { SearchEntry } from './searchIndex';

export function useSearchIndex() {
  const [verbs, setVerbs] = useState<SearchEntry[]>([]);
  useEffect(() => {
    fetch('/api/search-index').then(r => r.json()).then(setVerbs);
  }, []);
  return verbs;
}
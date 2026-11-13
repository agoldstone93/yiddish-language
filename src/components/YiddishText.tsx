import type { ReactNode } from 'react';

export function YiddishText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={`font-yiddish ${className ?? ''}`} lang="yi" dir="rtl">
      {children}
    </span>
  );
}

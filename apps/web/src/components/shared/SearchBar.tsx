//apps/web/src/components/shared/SearchBar.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { cn } from '@kobi/ui';

interface Props {
  placeholder?: string;
  className?: string;
}

export function SearchBar({ placeholder = 'খুঁজুন…', className }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initial = searchParams.get('search') || '';
  const [value, setValue] = useState(initial);

  // Sync with URL changes
  useEffect(() => {
    setValue(searchParams.get('search') || '');
  }, [searchParams]);

  const submit = (q: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (q.trim()) params.set('search', q.trim());
    else params.delete('search');
    params.delete('page'); // reset pagination
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const clear = () => {
    setValue('');
    submit('');
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit(value);
      }}
      className={cn('relative w-full max-w-md', className)}
    >
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-ink-400)] pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 pl-11 pr-10 rounded-full border border-[var(--color-border)] bg-[var(--color-cream-50)] text-[var(--color-ink-800)] placeholder:text-[var(--color-ink-400)] font-bangla text-sm focus:border-[var(--color-gold-400)] focus:outline-none transition-colors"
      />
      {value && (
        <button
          type="button"
          onClick={clear}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-[var(--color-ink-400)] hover:text-[var(--color-ink-700)] hover:bg-[var(--color-cream-200)] transition-colors"
          aria-label="মুছুন"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </form>
  );
}
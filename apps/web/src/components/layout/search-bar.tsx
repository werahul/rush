'use client';

import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  className?: string;
  autoFocus?: boolean;
  onClose?: () => void;
}

export function SearchBar({ className, autoFocus, onClose }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 400);

  useEffect(() => {
    if (!debounced.trim()) return;
    router.prefetch(`/products?search=${encodeURIComponent(debounced.trim())}`);
  }, [debounced, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/products?search=${encodeURIComponent(q)}`);
      onClose?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('relative w-full', className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search streetwear, gym fits..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 pr-10"
        autoFocus={autoFocus}
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  );
}

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { CATEGORIES } from '@rush/shared';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
] as const;

const PRICE_RANGES = [
  { label: 'Under ₹1,000', min: 0, max: 999 },
  { label: '₹1,000 – ₹2,000', min: 1000, max: 2000 },
  { label: 'Over ₹2,000', min: 2001, max: undefined as number | undefined },
];

interface ProductFiltersProps {
  className?: string;
}

export function ProductFilters({ className }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') ?? '';
  const currentSort = searchParams.get('sort') ?? 'newest';
  const currentMin = searchParams.get('minPrice');
  const currentMax = searchParams.get('maxPrice');

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') params.delete(key);
      else params.set(key, value);
    });
    params.delete('page');
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    const search = searchParams.get('search');
    router.push(search ? `/products?search=${encodeURIComponent(search)}` : '/products');
  };

  return (
    <aside className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em]">Filters</h2>
        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto p-0 text-xs">
          Clear all
        </Button>
      </div>

      <div>
        <Label className="mb-3 block text-xs uppercase tracking-widest text-muted-foreground">Category</Label>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!currentCategory ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateParams({ category: null })}
          >
            All
          </Button>
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.id}
              variant={currentCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateParams({ category: cat.id })}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <Label className="mb-3 block text-xs uppercase tracking-widest text-muted-foreground">Price</Label>
        <div className="space-y-2">
          {PRICE_RANGES.map((range) => {
            const active =
              currentMin === String(range.min) &&
              (range.max == null ? !currentMax : currentMax === String(range.max));
            return (
              <button
                key={range.label}
                type="button"
                onClick={() =>
                  updateParams({
                    minPrice: String(range.min),
                    maxPrice: range.max != null ? String(range.max) : null,
                  })
                }
                className={cn(
                  'block w-full rounded-md border px-3 py-2 text-left text-sm transition-colors',
                  active ? 'border-foreground bg-foreground text-background' : 'hover:bg-accent'
                )}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      <Separator />

      <div>
        <Label className="mb-3 block text-xs uppercase tracking-widest text-muted-foreground">Sort by</Label>
        <select
          value={currentSort}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}

'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { CATEGORIES } from '@rush/shared';
import { SearchBar } from '@/components/layout/search-bar';
import { Separator } from '@/components/ui/separator';
import { useUiStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';

export function MobileMenu() {
  const isOpen = useUiStore((s) => s.isMobileMenuOpen);
  const setOpen = useUiStore((s) => s.setMobileMenuOpen);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          />
          <motion.nav
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed inset-y-0 left-0 z-50 flex w-full max-w-sm flex-col bg-background p-6 shadow-xl lg:hidden"
          >
            <div className="mb-6 flex items-center justify-between">
              <Link href="/" onClick={() => setOpen(false)} className="font-display text-2xl font-bold tracking-[0.2em]">
                RUSH
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-2 hover:bg-accent"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <SearchBar onClose={() => setOpen(false)} className="mb-6" />

            <div className="flex flex-1 flex-col gap-1 overflow-y-auto">
              <Link
                href="/products"
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium uppercase tracking-widest hover:text-muted-foreground"
              >
                All Products
              </Link>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={cat.href}
                  onClick={() => setOpen(false)}
                  className="py-3 text-sm font-medium uppercase tracking-widest hover:text-muted-foreground"
                >
                  {cat.label}
                </Link>
              ))}
              <Separator className="my-4" />
              <Link
                href="/wishlist"
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium uppercase tracking-widest hover:text-muted-foreground"
              >
                Wishlist
              </Link>
              <Link
                href={isAuthenticated ? '/account' : '/login'}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium uppercase tracking-widest hover:text-muted-foreground"
              >
                {isAuthenticated ? 'Account' : 'Sign In'}
              </Link>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}

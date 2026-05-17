'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Heart, Menu, Moon, Search, ShoppingBag, Sun, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { CATEGORIES } from '@rush/shared';
import { Button } from '@/components/ui/button';
import { IconBadge } from '@/components/ui/icon-badge';
import { SearchBar } from '@/components/layout/search-bar';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';
import { useUiStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';
import { cn } from '@/lib/utils';

const navLinkClass =
  'text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground';

export function Header() {
  const { theme, setTheme } = useTheme();
  const setDrawerOpen = useCartStore((s) => s.setDrawerOpen);
  const itemCount = useCartStore((s) => s.itemCount);
  const wishlistCount = useWishlistStore((s) => s.productIds.length);
  const { isSearchOpen, setSearchOpen, setMobileMenuOpen } = useUiStore();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const count = itemCount();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <motion.div
        className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 md:h-[4.5rem]"
      >
        <motion.div
          className="flex items-center gap-3 lg:gap-6"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link
            href="/"
            className="font-display text-xl font-bold tracking-[0.25em] transition-opacity hover:opacity-80 md:text-2xl"
          >
            RUSH
          </Link>
          <nav className="hidden items-center gap-6 lg:flex">
            {CATEGORIES.map((cat) => (
              <Link key={cat.id} href={cat.href} className={navLinkClass}>
                {cat.label}
              </Link>
            ))}
          </nav>
        </motion.div>

        <div className={cn('hidden flex-1 max-w-md lg:block', isSearchOpen && 'lg:hidden')}>
          <SearchBar />
        </div>

        <motion.div
          className="flex items-center gap-0.5 md:gap-1"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(!isSearchOpen)}
            className="lg:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
            className="relative"
          >
            <span className="relative flex h-5 w-5 items-center justify-center">
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </span>
          </Button>

          <Button variant="ghost" size="icon" className="overflow-visible" asChild>
            <Link href="/wishlist" aria-label="Wishlist" className="overflow-visible">
              <span className="relative inline-flex h-5 w-5 items-center justify-center">
                <Heart className="h-5 w-5" />
                <IconBadge count={wishlistCount} />
              </span>
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <Link href={isAuthenticated ? '/account' : '/login'} aria-label="Account">
              <User className="h-5 w-5" />
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="overflow-visible"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open cart"
          >
            <span className="relative inline-flex h-5 w-5 items-center justify-center">
              <ShoppingBag className="h-5 w-5" />
              <IconBadge count={count} />
            </span>
          </Button>
        </motion.div>
      </motion.div>

      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t px-4 py-3 lg:hidden"
        >
          <SearchBar autoFocus onClose={() => setSearchOpen(false)} />
        </motion.div>
      )}
    </motion.header>
  );
}

import Link from 'next/link';
import { BRAND, CATEGORIES } from '@rush/shared';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="font-display text-2xl font-bold tracking-[0.2em]">
              RUSH
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">{BRAND.description}</p>
            <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{BRAND.tagline}</p>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em]">Shop</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/products" className="hover:text-foreground">
                  All Products
                </Link>
              </li>
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link href={cat.href} className="hover:text-foreground">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em]">Support</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/account" className="hover:text-foreground">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-foreground">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-foreground">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-foreground">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground md:flex-row">
          <p>&copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/stores/cart-store';

export function CartDrawer() {
  const { items, isOpen, setDrawerOpen, updateQuantity, removeItem, subtotal, itemCount } =
    useCartStore();
  const count = itemCount();
  const total = subtotal();

  return (
    <Sheet open={isOpen} onOpenChange={setDrawerOpen}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle className="font-display text-lg tracking-[0.15em]">YOUR BAG</SheetTitle>
          <SheetDescription>
            {count === 0 ? 'Your bag is empty' : `${count} item${count > 1 ? 's' : ''}`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <AnimatePresence mode="popLayout">
            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground" strokeWidth={1} />
                <p className="mb-6 text-sm text-muted-foreground">Nothing here yet. Time to move fast.</p>
                <Button variant="rush" onClick={() => setDrawerOpen(false)} asChild>
                  <Link href="/products">Shop Now</Link>
                </Button>
              </motion.div>
            ) : (
              <ul className="space-y-4">
                {items.map((item) => (
                  <motion.li
                    key={item.sku}
                    layout
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    className="flex gap-4"
                  >
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-muted">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={() => setDrawerOpen(false)}
                        className="text-sm font-medium leading-tight hover:underline"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.size} / {item.color}
                      </p>
                      <p className="mt-1 text-sm font-medium">{formatPrice(item.price)}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2 border">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                            className="p-1.5 hover:bg-accent"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-xs">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                            className="p-1.5 hover:bg-accent"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.sku)}
                          className="p-1.5 text-muted-foreground hover:text-destructive"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </AnimatePresence>
        </div>

        {items.length > 0 && (
          <SheetFooter className="mt-auto border-t px-6 py-5 sm:flex-col sm:space-x-0">
            <div className="mb-4 flex w-full items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-lg font-semibold">{formatPrice(total)}</span>
            </div>
            <Button variant="rush" className="w-full" asChild onClick={() => setDrawerOpen(false)}>
              <Link href="/checkout">Checkout</Link>
            </Button>
            <Button variant="ghost" className="w-full" asChild onClick={() => setDrawerOpen(false)}>
              <Link href="/cart">View Bag</Link>
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

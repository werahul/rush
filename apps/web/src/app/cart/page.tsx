'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { PAGE_IMAGES } from '@/lib/images';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/stores/cart-store';

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, clearCart } = useCartStore();
  const total = subtotal();

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-24 text-center">
        <div className="relative mb-8 h-56 w-full max-w-sm overflow-hidden rounded-lg">
          <Image src={PAGE_IMAGES.emptyCart} alt="" fill className="object-cover" sizes="400px" />
          <div className="absolute inset-0 bg-background/60" />
        </div>
        <ShoppingBag className="mb-4 h-8 w-8 text-muted-foreground" strokeWidth={1} />
        <h1 className="text-2xl font-semibold">Your bag is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">Discover the latest drops</p>
        <Button variant="rush" className="mt-8" asChild>
          <Link href="/products">Shop Now</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 md:py-14">
      <h1 className="mb-10 text-2xl font-semibold tracking-tight md:text-3xl">Shopping Bag</h1>

      <div className="grid gap-10 lg:grid-cols-3">
        <ul className="space-y-6 lg:col-span-2">
          {items.map((item) => (
            <li key={item.sku} className="flex gap-4 border-b pb-6">
              <div className="relative h-28 w-24 shrink-0 overflow-hidden bg-muted">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
              </div>
              <div className="flex flex-1 flex-col">
                <Link href={`/products/${item.slug}`} className="font-medium hover:underline">
                  {item.name}
                </Link>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.size} / {item.color}
                </p>
                <p className="mt-2 font-semibold">{formatPrice(item.price)}</p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center border">
                    <button type="button" onClick={() => updateQuantity(item.sku, item.quantity - 1)} className="p-2">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.sku, item.quantity + 1)} className="p-2">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button type="button" onClick={() => removeItem(item.sku)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="h-fit border p-6 lg:sticky lg:top-24">
          <h2 className="text-sm font-semibold uppercase tracking-widest">Order Summary</h2>
          <Separator className="my-4" />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold">{formatPrice(total)}</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Shipping calculated at checkout</p>
          <Button variant="rush" className="mt-6 w-full" asChild>
            <Link href="/checkout">Checkout</Link>
          </Button>
          <Button variant="ghost" className="mt-2 w-full text-xs" onClick={clearCart}>
            Clear bag
          </Button>
        </div>
      </div>
    </div>
  );
}

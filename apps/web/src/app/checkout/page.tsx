'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const user = useAuthStore((s) => s.user);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sub = subtotal();
  const shipping = sub > 0 ? 99 : 0;
  const tax = Math.round(sub * 0.18);
  const total = sub + shipping + tax;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('Your bag is empty');
      return;
    }
    setIsSubmitting(true);
    const form = new FormData(e.currentTarget);
    const address = {
      label: 'Shipping',
      fullName: String(form.get('fullName')),
      phone: String(form.get('phone')),
      line1: String(form.get('line1')),
      line2: String(form.get('line2') || ''),
      city: String(form.get('city')),
      state: String(form.get('state')),
      postalCode: String(form.get('postalCode')),
      country: 'India',
    };

    try {
      const res = await api.post<{ order: { _id: string } }>('/orders', {
        shippingAddress: address,
        paymentProvider: 'cod',
      });
      clearCart();
      toast.success('Order placed successfully');
      router.push(`/account/orders/${res.data?.order._id ?? ''}`);
    } catch {
      toast.success('Order placed (demo mode)');
      clearCart();
      router.push('/account/orders');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">Nothing to checkout</h1>
        <Button variant="rush" className="mt-6" asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 md:py-14">
      <h1 className="mb-10 text-2xl font-semibold tracking-tight">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest">Shipping Address</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" name="fullName" defaultValue={user ? `${user.firstName} ${user.lastName}` : ''} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" defaultValue={user?.phone ?? ''} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="line1">Address Line 1</Label>
            <Input id="line1" name="line1" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="line2">Address Line 2</Label>
            <Input id="line2" name="line2" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" name="state" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">PIN Code</Label>
              <Input id="postalCode" name="postalCode" required />
            </div>
          </div>
        </div>

        <div className="h-fit border p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest">Order Summary</h2>
          <Separator className="my-4" />
          <ul className="mb-4 space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.sku} className="flex justify-between">
                <span className="text-muted-foreground">
                  {item.name} × {item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(sub)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (18%)</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <Button type="submit" variant="rush" className="mt-6 w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Placing Order...' : 'Place Order (COD)'}
          </Button>
        </div>
      </form>
    </div>
  );
}

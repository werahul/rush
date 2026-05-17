'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { MOCK_ORDERS } from '@/lib/mock-data';
import { cn, formatDate, formatPrice } from '@/lib/utils';
import { ORDER_STATUS_LABELS } from '@rush/shared';
import type { Order, OrderStatus } from '@rush/shared';

const STATUS_ORDER: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'out_for_delivery',
  'delivered',
];

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<Order>(`/orders/${id}`);
        setOrder(res.data ?? null);
      } catch {
        setOrder(MOCK_ORDERS.find((o) => o._id === id) ?? MOCK_ORDERS[0] ?? null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return <p className="container mx-auto px-4 py-24 text-center text-muted-foreground">Loading...</p>;
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-xl font-semibold">Order not found</h1>
        <Button variant="link" asChild className="mt-4">
          <Link href="/account/orders">Back to orders</Link>
        </Button>
      </div>
    );
  }

  const currentIndex = STATUS_ORDER.indexOf(order.status);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10 md:py-14">
      <Link href="/account/orders" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
        ← Back to orders
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Placed {formatDate(order.createdAt)}</p>
        </div>
        <Badge variant="outline">{ORDER_STATUS_LABELS[order.status] ?? order.status}</Badge>
      </div>

      {order.trackingNumber && (
        <p className="mt-4 text-sm">
          Tracking: <span className="font-mono font-medium">{order.trackingNumber}</span>
        </p>
      )}

      <div className="mt-10">
        <h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em]">Tracking</h2>
        <ol className="relative space-y-0">
          {order.timeline.map((event, i) => {
            const stepIndex = STATUS_ORDER.indexOf(event.status);
            const isComplete = stepIndex <= currentIndex;
            const isLast = i === order.timeline.length - 1;
            return (
              <li key={`${event.status}-${event.timestamp}`} className="relative flex gap-4 pb-8">
                {!isLast && (
                  <span
                    className={cn(
                      'absolute left-[11px] top-6 h-full w-px',
                      isComplete ? 'bg-foreground' : 'bg-border'
                    )}
                  />
                )}
                <span
                  className={cn(
                    'relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2',
                    isComplete ? 'border-foreground bg-foreground text-background' : 'border-border bg-background'
                  )}
                >
                  {isComplete && <Check className="h-3 w-3" />}
                </span>
                <div>
                  <p className="text-sm font-medium">{ORDER_STATUS_LABELS[event.status] ?? event.message}</p>
                  <p className="text-xs text-muted-foreground">{event.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDate(event.timestamp)}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <Separator className="my-8" />

      <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em]">Items</h2>
      <ul className="space-y-4">
        {order.items.map((item) => (
          <li key={item.sku} className="flex gap-4">
            <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-muted">
              <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
            </div>
            <div>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {item.size} / {item.color} × {item.quantity}
              </p>
              <p className="mt-1 text-sm">{formatPrice(item.price * item.quantity)}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 border-t pt-6 text-sm">
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>
    </div>
  );
}

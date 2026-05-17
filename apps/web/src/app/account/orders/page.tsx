'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { MOCK_ORDERS } from '@/lib/mock-data';
import { formatDate, formatPrice } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import { ORDER_STATUS_LABELS } from '@rush/shared';
import type { Order } from '@rush/shared';

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<Order[]>('/orders');
        setOrders(res.data ?? []);
      } catch {
        setOrders(MOCK_ORDERS);
      } finally {
        setLoadingOrders(false);
      }
    })();
  }, []);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10 md:py-14">
      <h1 className="text-2xl font-semibold tracking-tight">Order History</h1>
      <p className="mt-2 text-sm text-muted-foreground">Track and manage your orders</p>

      {loadingOrders ? (
        <p className="mt-10 text-muted-foreground">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="mt-10 text-muted-foreground">No orders yet</p>
      ) : (
        <ul className="mt-10 space-y-4">
          {orders.map((order) => (
            <li key={order._id}>
              <Link
                href={`/account/orders/${order._id}`}
                className="block border p-4 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{ORDER_STATUS_LABELS[order.status] ?? order.status}</Badge>
                    <p className="mt-2 text-sm font-semibold">{formatPrice(order.total)}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

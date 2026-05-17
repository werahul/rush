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

export default function AdminOrdersPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) router.push('/');
  }, [user, isLoading, router]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<Order[]>('/admin/orders');
        setOrders(res.data ?? []);
      } catch {
        setOrders(MOCK_ORDERS);
      }
    })();
  }, []);

  return (
    <div className="container mx-auto px-4 py-10 md:py-14">
      <div className="mb-10">
        <Link href="/admin" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
          ← Dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Orders</h1>
      </div>

      <div className="overflow-x-auto border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40 text-left text-xs uppercase tracking-widest">
            <tr>
              <th className="p-4">Order</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Payment</th>
              <th className="p-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b last:border-0">
                <td className="p-4 font-medium">{order.orderNumber}</td>
                <td className="p-4 text-muted-foreground">{formatDate(order.createdAt)}</td>
                <td className="p-4">
                  <Badge variant="outline">{ORDER_STATUS_LABELS[order.status] ?? order.status}</Badge>
                </td>
                <td className="p-4 capitalize">{order.paymentStatus}</td>
                <td className="p-4 text-right font-medium">{formatPrice(order.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

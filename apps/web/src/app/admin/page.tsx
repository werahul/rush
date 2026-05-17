'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, ShoppingCart, Users, IndianRupee } from 'lucide-react';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';

interface DashboardData {
  stats: {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    revenue30d: number;
  };
  recentOrders: Array<{
    _id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
}

const MOCK_DASHBOARD: DashboardData = {
  stats: { totalUsers: 128, totalProducts: 24, totalOrders: 342, revenue30d: 485000 },
  recentOrders: [
    { _id: '1', orderNumber: 'RUSH-10042', total: 2499, status: 'shipped', createdAt: new Date().toISOString() },
    { _id: '2', orderNumber: 'RUSH-10041', total: 1798, status: 'processing', createdAt: new Date().toISOString() },
  ],
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const [data, setData] = useState<DashboardData>(MOCK_DASHBOARD);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) router.push('/');
  }, [user, isLoading, router]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<DashboardData>('/admin/dashboard');
        if (res.data) setData(res.data);
      } catch {
        /* use mock */
      }
    })();
  }, []);

  const stats = [
    { label: 'Users', value: data.stats.totalUsers, icon: Users },
    { label: 'Products', value: data.stats.totalProducts, icon: Package },
    { label: 'Orders', value: data.stats.totalOrders, icon: ShoppingCart },
    { label: 'Revenue (30d)', value: formatPrice(data.stats.revenue30d), icon: IndianRupee },
  ];

  return (
    <div className="container mx-auto px-4 py-10 md:py-14">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Admin</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Dashboard</h1>
        </div>
        <div className="flex gap-4 text-sm">
          <Link href="/admin/products" className="hover:underline">
            Products
          </Link>
          <Link href="/admin/orders" className="hover:underline">
            Orders
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="border p-6">
            <stat.icon className="mb-3 h-5 w-5 text-muted-foreground" />
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 border p-6">
        <h2 className="text-sm font-semibold uppercase tracking-widest">Recent Orders</h2>
        <ul className="mt-4 divide-y">
          {data.recentOrders.map((order) => (
            <li key={order._id} className="flex justify-between py-3 text-sm">
              <span className="font-medium">{order.orderNumber}</span>
              <span className="text-muted-foreground capitalize">{order.status}</span>
              <span>{formatPrice(order.total)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

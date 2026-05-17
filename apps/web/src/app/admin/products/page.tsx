'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { formatPrice } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import type { Product } from '@rush/shared';

export default function AdminProductsPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) router.push('/');
  }, [user, isLoading, router]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<Product[]>('/products', { limit: 100 });
        setProducts(res.data ?? []);
      } catch {
        setProducts(MOCK_PRODUCTS);
      }
    })();
  }, []);

  return (
    <div className="container mx-auto px-4 py-10 md:py-14">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <Link href="/admin" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
            ← Dashboard
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Products</h1>
        </div>
      </div>

      <div className="overflow-x-auto border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40 text-left text-xs uppercase tracking-widest">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const stock = p.variants.reduce((s, v) => s + v.stock, 0);
              return (
                <tr key={p._id} className="border-b last:border-0">
                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="p-4 capitalize text-muted-foreground">{p.category.replace('-', ' ')}</td>
                  <td className="p-4">{formatPrice(p.basePrice)}</td>
                  <td className="p-4">{stock}</td>
                  <td className="p-4">{p.isActive ? 'Active' : 'Inactive'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

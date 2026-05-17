'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Package, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out');
    router.push('/');
  };

  if (isLoading || !user) {
    return <div className="container mx-auto px-4 py-24 text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10 md:py-14">
      <h1 className="text-2xl font-semibold tracking-tight">My Account</h1>
      <p className="mt-2 text-sm text-muted-foreground">Welcome back, {user.firstName}</p>

      <div className="mt-10 space-y-4 border p-6">
        <div className="flex items-center gap-3">
          <User className="h-5 w-5" />
          <div>
            <p className="font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Separator />
        <Link href="/account/orders" className="flex items-center gap-3 py-2 text-sm hover:text-muted-foreground">
          <Package className="h-5 w-5" />
          Order History
        </Link>
        {user.role === 'admin' && (
          <Link href="/admin" className="flex items-center gap-3 py-2 text-sm hover:text-muted-foreground">
            Admin Dashboard
          </Link>
        )}
        <Separator />
        <Button variant="ghost" className="w-full justify-start gap-3 px-0" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/auth-store';
import { PAGE_IMAGES } from '@/lib/images';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome back');
      router.push('/account');
    } catch {
      toast.error('Invalid credentials');
    }
  };

  return (
    <motion.div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <motion.div
        className="relative hidden lg:block"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image src={PAGE_IMAGES.auth} alt="RUSH streetwear" fill className="object-cover" priority sizes="50vw" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-12 left-12 text-white">
          <p className="text-xs uppercase tracking-[0.4em] text-white/70">Members only</p>
          <p className="mt-2 font-display text-3xl font-bold tracking-[0.2em]">RUSH</p>
        </div>
      </motion.div>

      <motion.div
        className="flex items-center justify-center px-4 py-14"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-md">
          <h1 className="text-center font-display text-2xl font-bold tracking-[0.2em]">SIGN IN</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">Access your RUSH account</p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" variant="rush" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New to RUSH?{' '}
            <Link href="/signup" className="font-medium text-foreground underline-offset-4 hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

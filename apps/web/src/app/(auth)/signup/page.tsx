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

export default function SignupPage() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(form);
      toast.success('Account created');
      router.push('/account');
    } catch {
      toast.error('Could not create account');
    }
  };

  return (
    <motion.div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <motion.div
        className="relative order-2 lg:order-1 lg:block hidden"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image src={PAGE_IMAGES.heroAlt} alt="Join RUSH" fill className="object-cover" sizes="50vw" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute bottom-12 left-12 text-white">
          <p className="text-xs uppercase tracking-[0.4em] text-white/70">Join the movement</p>
          <p className="mt-2 font-display text-3xl font-bold tracking-[0.2em]">RUSH</p>
        </div>
      </motion.div>

      <motion.div
        className="order-1 flex items-center justify-center px-4 py-14 lg:order-2"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-md">
          <h1 className="text-center font-display text-2xl font-bold tracking-[0.2em]">JOIN RUSH</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">Create your account</p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <motion.div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  required
                />
              </motion.div>
              <motion.div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  required
                />
              </motion.div>
            </div>
            <motion.div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </motion.div>
            <motion.div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={8}
              />
            </motion.div>
            <Button type="submit" variant="rush" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

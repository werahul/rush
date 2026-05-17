'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { BRAND } from '@rush/shared';
import { Button } from '@/components/ui/button';
import { PAGE_IMAGES } from '@/lib/images';

export function HomeHero() {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={PAGE_IMAGES.hero}
          alt="RUSH streetwear hero"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <motion.p
          className="mb-4 text-xs uppercase tracking-[0.4em] text-white/80"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {BRAND.tagline}
        </motion.p>
        <motion.h1
          className="font-display text-5xl font-bold tracking-[0.15em] md:text-7xl lg:text-8xl"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {BRAND.name}
        </motion.h1>
        <motion.p
          className="mx-auto mt-6 max-w-md text-sm text-white/80 md:text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {BRAND.description}
        </motion.p>
        <motion.div
          className="mt-10 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6 }}
        >
          <Button variant="rush" size="lg" asChild>
            <Link href="/products">
              Shop Collection <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-black"
            asChild
          >
            <Link href="/collections/gym-outfits">Gym Fits</Link>
          </Button>
        </motion.div>
      </div>
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        <span className="block h-10 w-px bg-white/50" />
      </motion.div>
    </section>
  );
}

'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { CATEGORY_IMAGES } from '@/lib/images';

interface CollectionHeroProps {
  title: string;
  categoryId: string;
}

export function CollectionHero({ title, categoryId }: CollectionHeroProps) {
  const image = CATEGORY_IMAGES[categoryId] ?? CATEGORY_IMAGES['mens-wear'];

  return (
    <motion.section
      className="relative mb-10 h-[40vh] min-h-[280px] overflow-hidden md:mb-14 md:h-[45vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Image src={image} alt={title} fill className="object-cover" priority sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
      <motion.div
        className="absolute inset-0 flex items-end"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="container mx-auto px-4 pb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-white/70">Collection</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">{title}</h1>
        </div>
      </motion.div>
    </motion.section>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CATEGORIES } from '@rush/shared';
import { CATEGORY_IMAGES } from '@/lib/images';
import { FadeIn, StaggerChildren, StaggerItem } from '@/components/motion/fade-in';

export function CategoryShowcase() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <FadeIn className="mb-8 text-center">
        <h2 className="text-xs font-semibold uppercase tracking-[0.3em]">Categories</h2>
      </FadeIn>
      <StaggerChildren className="grid gap-4 md:grid-cols-3">
        {CATEGORIES.map((cat) => (
          <StaggerItem key={cat.id}>
            <Link
              href={cat.href}
              className="group relative block aspect-[4/5] overflow-hidden bg-muted"
            >
              <Image
                src={CATEGORY_IMAGES[cat.id]}
                alt={cat.label}
                fill
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/30 transition-colors duration-500 group-hover:bg-black/45" />
              <span className="absolute bottom-6 left-6 text-lg font-semibold uppercase tracking-[0.2em] text-white">
                {cat.label}
              </span>
            </Link>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </section>
  );
}

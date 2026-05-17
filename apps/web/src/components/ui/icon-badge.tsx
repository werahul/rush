'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface IconBadgeProps {
  count: number;
  className?: string;
}

/** Badge anchored to icon only — parent must be `relative inline-flex` wrapping the icon */
export function IconBadge({ count, className }: IconBadgeProps) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
          className={cn(
            'pointer-events-none absolute right-0 top-0 z-10 flex h-[18px] min-w-[18px] -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-bold leading-none text-background shadow-sm',
            className
          )}
        >
          {count > 99 ? '99+' : count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

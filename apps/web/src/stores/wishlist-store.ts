import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  productIds: string[];
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
  setProductIds: (ids: string[]) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],

      toggle: (productId) => {
        const ids = get().productIds;
        if (ids.includes(productId)) {
          set({ productIds: ids.filter((id) => id !== productId) });
        } else {
          set({ productIds: [...ids, productId] });
        }
      },

      has: (productId) => get().productIds.includes(productId),

      setProductIds: (ids) => set({ productIds: ids }),
    }),
    { name: 'rush-wishlist' }
  )
);

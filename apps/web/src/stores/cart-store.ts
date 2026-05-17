import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@rush/shared';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  setItems: (items: CartItem[]) => void;
  addItem: (item: CartItem) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  removeItem: (sku: string) => void;
  clearCart: () => void;
  toggleDrawer: () => void;
  setDrawerOpen: (open: boolean) => void;
  itemCount: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      setItems: (items) => set({ items }),

      addItem: (item) => {
        const items = get().items;
        const existing = items.find((i) => i.sku === item.sku);
        if (existing) {
          set({
            items: items.map((i) =>
              i.sku === item.sku
                ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.maxStock) }
                : i
            ),
            isOpen: true,
          });
        } else {
          set({ items: [...items, item], isOpen: true });
        }
      },

      updateQuantity: (sku, quantity) => {
        if (quantity < 1) {
          set({ items: get().items.filter((i) => i.sku !== sku) });
        } else {
          set({
            items: get().items.map((i) =>
              i.sku === sku ? { ...i, quantity: Math.min(quantity, i.maxStock) } : i
            ),
          });
        }
      },

      removeItem: (sku) => set({ items: get().items.filter((i) => i.sku !== sku) }),

      clearCart: () => set({ items: [] }),

      toggleDrawer: () => set({ isOpen: !get().isOpen }),

      setDrawerOpen: (open) => set({ isOpen: open }),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: 'rush-cart' }
  )
);

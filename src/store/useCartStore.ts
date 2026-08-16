import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  variationId?: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  sku: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variationId?: string) => void;
  updateQuantity: (productId: string, variationId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  getTotals: () => { total: number; count: number };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.productId === newItem.productId && item.variationId === newItem.variationId
          );
          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += newItem.quantity;
            return { items: newItems };
          }
          return { items: [...state.items, newItem] };
        }),
      removeItem: (productId, variationId) =>
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productId === productId && item.variationId === variationId)
          ),
        })),
      updateQuantity: (productId, variationId, quantity) =>
        set((state) => ({
          items: state.items.map((item) => {
            if (item.productId === productId && item.variationId === variationId) {
              return { ...item, quantity: Math.max(1, quantity) };
            }
            return item;
          }),
        })),
      clearCart: () => set({ items: [] }),
      getTotals: () => {
        const { items } = get();
        return items.reduce(
          (acc, item) => ({
            total: acc.total + item.price * item.quantity,
            count: acc.count + item.quantity,
          }),
          { total: 0, count: 0 }
        );
      },
    }),
    {
      name: 'kovera-cart',
    }
  )
);

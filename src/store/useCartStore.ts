import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, OrderItem } from '../types';
import toast from 'react-hot-toast';

interface CartItem extends OrderItem {
  product: Product;
}

interface CartState {
  items: CartItem[];
  isCartDrawerOpen: boolean;
  
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  
  getTotalCAD: () => number;
  getTotalRWF: () => number;
  getTotalWeightKg: () => number;
  getShippingFeeCAD: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartDrawerOpen: false,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.product_id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product_id === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
              isCartDrawerOpen: true,
            };
          }
          const newItem: CartItem = {
            product_id: product.id,
            title: product.title,
            quantity,
            unit_price_cad: product.price_cad,
            unit_price_rwf: product.price_rwf,
            weight_kg: product.weight_kg,
            image: product.images[0],
            product,
          };
          return {
            items: [...state.items, newItem],
            isCartDrawerOpen: true,
          };
        });
        toast.success(`Added "${product.title}" to cart.`);
      },

      removeItem: (productId) =>
        set((state) => {
          const itemToRemove = state.items.find((i) => i.product_id === productId);
          if (itemToRemove) {
            toast.success(`Removed "${itemToRemove.title}" from cart.`);
          }
          return {
            items: state.items.filter((i) => i.product_id !== productId),
          };
        }),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: quantity <= 0
            ? state.items.filter((i) => i.product_id !== productId)
            : state.items.map((i) => (i.product_id === productId ? { ...i, quantity } : i)),
        })),

      clearCart: () => set({ items: [] }),

      openCartDrawer: () => set({ isCartDrawerOpen: true }),
      closeCartDrawer: () => set({ isCartDrawerOpen: false }),

      getTotalCAD: () => {
        return get().items.reduce((sum, item) => sum + item.unit_price_cad * item.quantity, 0);
      },

      getTotalRWF: () => {
        return get().items.reduce((sum, item) => sum + item.unit_price_rwf * item.quantity, 0);
      },

      getTotalWeightKg: () => {
        return get().items.reduce((sum, item) => sum + item.weight_kg * item.quantity, 0);
      },

      getShippingFeeCAD: () => {
        const totalKg = get().getTotalWeightKg();
        if (totalKg === 0) return 0;
        return Math.max(10, Math.round(totalKg * 12.0 * 100) / 100);
      },
    }),
    {
      name: 'magic_link_cart_storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);

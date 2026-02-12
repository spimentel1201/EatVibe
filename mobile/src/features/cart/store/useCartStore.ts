import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../../../core/storage/mmkvStorage';
import { CartStore, CartItem } from '../types';
import { MenuItem } from '../../restaurant/types';

export const useCartStore = create(
    persist(
        (set: any, get: any): CartStore => ({
            items: [],
            restaurantId: null,

            addItem: (item: MenuItem, quantity: number) => {
                const { items } = get();
                const existingItem = items.find((i: CartItem) => i.id === item.id);

                if (existingItem) {
                    set({
                        items: items.map((i: CartItem) =>
                            i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
                        ),
                    });
                } else {
                    set({ items: [...items, { ...item, quantity }] });
                }
            },

            removeItem: (itemId: string) => {
                const { items } = get();
                set({ items: items.filter((i: CartItem) => i.id !== itemId) });
            },

            updateQuantity: (itemId: string, quantity: number) => {
                const { items } = get();
                if (quantity <= 0) {
                    set({ items: items.filter((i: CartItem) => i.id !== itemId) });
                    return;
                }
                set({
                    items: items.map((i: CartItem) =>
                        i.id === itemId ? { ...i, quantity } : i
                    ),
                });
            },

            clearCart: () => {
                set({ items: [], restaurantId: null });
            },

            getTotal: () => {
                const { items } = get();
                return items.reduce((acc: number, item: CartItem) => acc + item.price * item.quantity, 0);
            },

            getItemCount: () => {
                const { items } = get();
                return items.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);
            },
        }),
        {
            name: 'eatvibe-cart-storage',
            storage: createJSONStorage(() => mmkvStorage),
        }
    )
);

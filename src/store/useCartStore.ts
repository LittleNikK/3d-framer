import { create } from 'zustand';
import type { CartItem, CustomizationMap } from '../types';
import { storageService } from '../services/storageService';
import { getProductById } from '../config/products';
import { calculateCustomizationPrice } from '../config/pricing';

interface CartState {
  items: CartItem[];
  addItem: (
    productId: string,
    size: number,
    configuration: CustomizationMap,
    thumbnailUrl?: string
  ) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: storageService.getCartItems(),

  addItem: (productId, size, configuration, thumbnailUrl) => {
    const product = getProductById(productId);
    const pricing = calculateCustomizationPrice(product, configuration);

    const newItem: CartItem = {
      cartItemId: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      productId,
      productName: product.name,
      size,
      configuration: { ...configuration },
      unitPrice: pricing.totalPrice,
      quantity: 1,
      thumbnailUrl,
      addedAt: new Date().toISOString(),
    };

    set(state => {
      const updated = [newItem, ...state.items];
      storageService.saveCartItems(updated);
      return { items: updated };
    });
  },

  removeItem: (cartItemId: string) => {
    set(state => {
      const updated = state.items.filter(item => item.cartItemId !== cartItemId);
      storageService.saveCartItems(updated);
      return { items: updated };
    });
  },

  updateQuantity: (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(cartItemId);
      return;
    }
    set(state => {
      const updated = state.items.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      );
      storageService.saveCartItems(updated);
      return { items: updated };
    });
  },

  clearCart: () => {
    storageService.saveCartItems([]);
    set({ items: [] });
  },

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));

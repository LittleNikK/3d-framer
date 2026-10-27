import type { SavedDesign, CartItem, DemoOrder } from '../types';

const STORAGE_KEYS = {
  DESIGNS: 'solestudio_saved_designs_v1',
  CART: 'solestudio_cart_items_v1',
  ORDERS: 'solestudio_demo_orders_v1',
} as const;

class StorageService {
  private isAvailable(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return false;
      const testKey = '__solestudio_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  // --- Saved Designs ---

  getSavedDesigns(): SavedDesign[] {
    if (!this.isAvailable()) return [];
    try {
      const data = window.localStorage.getItem(STORAGE_KEYS.DESIGNS);
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.filter(d => d && typeof d.id === 'string' && d.configuration);
      }
      return [];
    } catch (e) {
      console.warn('Failed to parse saved designs from localStorage:', e);
      return [];
    }
  }

  saveDesign(design: SavedDesign): boolean {
    if (!this.isAvailable()) return false;
    try {
      const designs = this.getSavedDesigns();
      const existingIndex = designs.findIndex(d => d.id === design.id);
      if (existingIndex >= 0) {
        designs[existingIndex] = design;
      } else {
        designs.unshift(design);
      }
      window.localStorage.setItem(STORAGE_KEYS.DESIGNS, JSON.stringify(designs));
      return true;
    } catch (e) {
      console.error('Failed to save design to localStorage:', e);
      return false;
    }
  }

  deleteDesign(id: string): boolean {
    if (!this.isAvailable()) return false;
    try {
      const designs = this.getSavedDesigns().filter(d => d.id !== id);
      window.localStorage.setItem(STORAGE_KEYS.DESIGNS, JSON.stringify(designs));
      return true;
    } catch (e) {
      console.error('Failed to delete design from localStorage:', e);
      return false;
    }
  }

  // --- Cart Items ---

  getCartItems(): CartItem[] {
    if (!this.isAvailable()) return [];
    try {
      const data = window.localStorage.getItem(STORAGE_KEYS.CART);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn('Failed to parse cart from localStorage:', e);
      return [];
    }
  }

  saveCartItems(items: CartItem[]): boolean {
    if (!this.isAvailable()) return false;
    try {
      window.localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
      return true;
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
      return false;
    }
  }

  // --- Orders ---

  getOrders(): DemoOrder[] {
    if (!this.isAvailable()) return [];
    try {
      const data = window.localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn('Failed to parse orders from localStorage:', e);
      return [];
    }
  }

  saveOrder(order: DemoOrder): boolean {
    if (!this.isAvailable()) return false;
    try {
      const orders = this.getOrders();
      orders.unshift(order);
      window.localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      return true;
    } catch (e) {
      console.error('Failed to save order to localStorage:', e);
      return false;
    }
  }

  getOrderById(orderId: string): DemoOrder | null {
    const orders = this.getOrders();
    return orders.find(o => o.orderId === orderId || o.referenceNumber === orderId) || null;
  }
}

export const storageService = new StorageService();

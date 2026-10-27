import { create } from 'zustand';
import type { SavedDesign, CustomizationMap } from '../types';
import { storageService } from '../services/storageService';
import { getProductById } from '../config/products';
import { calculateCustomizationPrice } from '../config/pricing';

interface SavedDesignsState {
  designs: SavedDesign[];
  saveDesign: (
    name: string,
    productId: string,
    size: number,
    configuration: CustomizationMap,
    thumbnailUrl?: string
  ) => SavedDesign;
  duplicateDesign: (id: string) => SavedDesign | null;
  renameDesign: (id: string, newName: string) => boolean;
  deleteDesign: (id: string) => boolean;
  getDesignById: (id: string) => SavedDesign | undefined;
}

export const useSavedDesignsStore = create<SavedDesignsState>((set, get) => ({
  designs: storageService.getSavedDesigns(),

  saveDesign: (name, productId, size, configuration, thumbnailUrl) => {
    const product = getProductById(productId);
    const pricing = calculateCustomizationPrice(product, configuration);
    const now = new Date().toISOString();

    const newDesign: SavedDesign = {
      id: `dsg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim() || `${product.name} Custom`,
      productId,
      size,
      configuration: { ...configuration },
      price: pricing.totalPrice,
      createdAt: now,
      updatedAt: now,
      thumbnailUrl,
      version: 1,
    };

    storageService.saveDesign(newDesign);
    set({ designs: storageService.getSavedDesigns() });
    return newDesign;
  },

  duplicateDesign: (id: string) => {
    const existing = get().designs.find(d => d.id === id);
    if (!existing) return null;

    const copy: SavedDesign = {
      ...existing,
      id: `dsg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: `${existing.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storageService.saveDesign(copy);
    set({ designs: storageService.getSavedDesigns() });
    return copy;
  },

  renameDesign: (id: string, newName: string) => {
    const existing = get().designs.find(d => d.id === id);
    if (!existing) return false;

    const updated: SavedDesign = {
      ...existing,
      name: newName.trim() || existing.name,
      updatedAt: new Date().toISOString(),
    };

    const success = storageService.saveDesign(updated);
    if (success) {
      set({ designs: storageService.getSavedDesigns() });
    }
    return success;
  },

  deleteDesign: (id: string) => {
    const success = storageService.deleteDesign(id);
    if (success) {
      set({ designs: storageService.getSavedDesigns() });
    }
    return success;
  },

  getDesignById: (id: string) => {
    return get().designs.find(d => d.id === id);
  },
}));

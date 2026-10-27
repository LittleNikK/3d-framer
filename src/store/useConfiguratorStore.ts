import { create } from 'zustand';
import type {
  PartId,
  MaterialPresetId,
  CustomizationMap,
  CameraPreset,
  MeshInspectionInfo,
} from '../types';
import { getProductById, DEFAULT_PRODUCT_ID } from '../config/products';
import { ORDERED_PARTS } from '../config/meshMappings';

interface ConfiguratorState {
  productId: string;
  selectedPartId: PartId;
  configuration: CustomizationMap;
  selectedSize: number;
  cameraPreset: CameraPreset;
  autoRotate: boolean;
  modelStatus: 'loading' | 'ready' | 'error' | 'fallback';
  modelErrorMessage?: string;
  modelInspection: MeshInspectionInfo | null;

  // History for Undo / Redo
  history: CustomizationMap[];
  future: CustomizationMap[];

  // Actions
  setProductId: (productId: string) => void;
  selectPart: (partId: PartId) => void;
  setPartColor: (color: string) => void;
  setPartMaterial: (materialId: MaterialPresetId) => void;
  setSize: (size: number) => void;
  setCameraPreset: (preset: CameraPreset) => void;
  toggleAutoRotate: () => void;
  setModelStatus: (status: 'loading' | 'ready' | 'error' | 'fallback', error?: string) => void;
  setModelInspection: (info: MeshInspectionInfo | null) => void;

  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  resetConfiguration: () => void;
  loadConfiguration: (config: CustomizationMap, size?: number, productId?: string) => void;
}

const initialProduct = getProductById(DEFAULT_PRODUCT_ID);

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  productId: DEFAULT_PRODUCT_ID,
  selectedPartId: 'mesh',
  configuration: { ...initialProduct.defaultConfiguration },
  selectedSize: initialProduct.defaultSize,
  cameraPreset: 'threeQuarter',
  autoRotate: false,
  modelStatus: 'loading',
  modelInspection: null,

  history: [],
  future: [],

  setProductId: (productId: string) => {
    const prod = getProductById(productId);
    set({
      productId,
      configuration: { ...prod.defaultConfiguration },
      selectedSize: prod.defaultSize,
      history: [],
      future: [],
      cameraPreset: 'threeQuarter',
    });
  },

  selectPart: (partId: PartId) => {
    if (ORDERED_PARTS.includes(partId)) {
      set({ selectedPartId: partId });
    }
  },

  setPartColor: (color: string) => {
    const { configuration, selectedPartId, history } = get();
    const currentPart = configuration[selectedPartId];
    if (currentPart && currentPart.color.toUpperCase() === color.toUpperCase()) {
      return; // No-op if unchanged
    }

    const nextConfig: CustomizationMap = {
      ...configuration,
      [selectedPartId]: {
        ...currentPart,
        color,
      },
    };

    set({
      configuration: nextConfig,
      history: [...history.slice(-30), configuration], // keep up to 30 steps
      future: [], // clear redo stack on new action
    });
  },

  setPartMaterial: (materialId: MaterialPresetId) => {
    const { configuration, selectedPartId, history } = get();
    const currentPart = configuration[selectedPartId];
    if (currentPart && currentPart.materialPresetId === materialId) {
      return;
    }

    const nextConfig: CustomizationMap = {
      ...configuration,
      [selectedPartId]: {
        ...currentPart,
        materialPresetId: materialId,
      },
    };

    set({
      configuration: nextConfig,
      history: [...history.slice(-30), configuration],
      future: [],
    });
  },

  setSize: (size: number) => {
    set({ selectedSize: size });
  },

  setCameraPreset: (preset: CameraPreset) => {
    set({ cameraPreset: preset, autoRotate: false });
  },

  toggleAutoRotate: () => {
    set(state => ({ autoRotate: !state.autoRotate }));
  },

  setModelStatus: (status, error) => {
    set({ modelStatus: status, modelErrorMessage: error });
  },

  setModelInspection: (info) => {
    set({ modelInspection: info });
  },

  undo: () => {
    const { history, configuration, future } = get();
    if (history.length === 0) return;

    const previous = history[history.length - 1];
    const newHistory = history.slice(0, history.length - 1);

    set({
      configuration: previous,
      history: newHistory,
      future: [configuration, ...future],
    });
  },

  redo: () => {
    const { history, configuration, future } = get();
    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);

    set({
      configuration: next,
      history: [...history, configuration],
      future: newFuture,
    });
  },

  canUndo: () => get().history.length > 0,
  canRedo: () => get().future.length > 0,

  resetConfiguration: () => {
    const { productId, configuration, history } = get();
    const product = getProductById(productId);
    set({
      configuration: { ...product.defaultConfiguration },
      history: [...history, configuration],
      future: [],
      cameraPreset: 'threeQuarter',
    });
  },

  loadConfiguration: (config: CustomizationMap, size?: number, productId?: string) => {
    set(state => {
      const activeProd = productId ? getProductById(productId) : getProductById(state.productId);
      return {
        productId: activeProd.id,
        configuration: { ...config },
        selectedSize: size ?? state.selectedSize,
        history: [],
        future: [],
      };
    });
  },
}));

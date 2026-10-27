import type { MaterialPreset, MaterialPresetId } from '../types';

export const MATERIAL_PRESETS: Record<MaterialPresetId, MaterialPreset> = {
  leather: {
    id: 'leather',
    name: 'Full-Grain Leather',
    description: 'Supple, premium tumbled leather with a refined satin sheen',
    roughness: 0.42,
    metalness: 0.08,
    clearcoat: 0.1,
    priceModifier: 400, // +₹400
  },
  suede: {
    id: 'suede',
    name: 'Italian Suede',
    description: 'Velvety matte nap with rich diffuse light scattering',
    roughness: 0.88,
    metalness: 0.0,
    priceModifier: 550, // +₹550
  },
  mesh: {
    id: 'mesh',
    name: 'Engineered Mesh',
    description: 'Ultra-breathable micro-perforated lightweight knit',
    roughness: 0.65,
    metalness: 0.05,
    priceModifier: 0, // Base inclusion
  },
  knit: {
    id: 'knit',
    name: 'Adaptive Knit',
    description: 'Flexible woven yarn contours directly to your foot',
    roughness: 0.78,
    metalness: 0.02,
    priceModifier: 300, // +₹300
  },
  rubber: {
    id: 'rubber',
    name: 'Vulcanized Rubber',
    description: 'Durable, high-traction compound designed for longevity',
    roughness: 0.5,
    metalness: 0.0,
    priceModifier: 0,
  },
  glossy: {
    id: 'glossy',
    name: 'Gloss Synthetic',
    description: 'High-shine patent finish for bold visual contrast',
    roughness: 0.15,
    metalness: 0.25,
    clearcoat: 0.8,
    priceModifier: 350, // +₹350
  },
};

export const DEFAULT_MATERIAL_PRESET_ID: MaterialPresetId = 'leather';

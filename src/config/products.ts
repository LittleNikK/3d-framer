import type { ProductDefinition, CustomizationMap } from '../types';
import { LOGICAL_PARTS, ORDERED_PARTS } from './meshMappings';

// Generate default configuration map
export function generateDefaultConfiguration(): CustomizationMap {
  const config = {} as CustomizationMap;
  for (const partId of ORDERED_PARTS) {
    const part = LOGICAL_PARTS[partId];
    config[partId] = {
      color: part.defaultColor,
      materialPresetId: part.defaultMaterial,
    };
  }
  return config;
}

export const PRODUCTS: ProductDefinition[] = [
  {
    id: 'solestudio-glide',
    name: 'SoleStudio Glide Pro',
    subtitle: 'Flagship Dynamic Performance Sneaker',
    description: 'Engineered for street-to-court agility with an sculpted aerodynamic chassis, multi-layered paneling, and decoupled responsive cushion sole.',
    basePrice: 7499, // ₹7,499
    currency: 'INR',
    modelPath: '/models/sneaker-pro.glb',
    modelStatus: 'available',
    defaultConfiguration: generateDefaultConfiguration(),
    supportedSizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    defaultSize: 9,
    availableParts: ORDERED_PARTS,
    thumbnail: '/images/glide-pro.jpg',
    badge: 'BESTSELLER',
  },
  {
    id: 'solestudio-apex',
    name: 'SoleStudio Apex Court',
    subtitle: 'Minimalist Heritage High-Cut',
    description: 'Clean architectural lines inspired by archival indoor courts. Hand-tumbled side overlays with reinforced padded collar protection.',
    basePrice: 8499, // ₹8,499
    currency: 'INR',
    modelPath: '/models/sneaker-pro.glb', // Uses the active multi-part GLB with alternative defaults
    modelStatus: 'available',
    defaultConfiguration: {
      ...generateDefaultConfiguration(),
      mesh: { color: '#111215', materialPresetId: 'leather' },
      stripes: { color: '#E11D48', materialPresetId: 'suede' },
      caps: { color: '#2C3038', materialPresetId: 'leather' },
      band: { color: '#E11D48', materialPresetId: 'leather' },
      patch: { color: '#E11D48', materialPresetId: 'glossy' },
      laces: { color: '#111215', materialPresetId: 'knit' },
      inner: { color: '#111215', materialPresetId: 'mesh' },
      sole: { color: '#F3EFE0', materialPresetId: 'rubber' },
    },
    supportedSizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
    defaultSize: 9.5,
    availableParts: ORDERED_PARTS,
    thumbnail: '/images/apex-court.jpg',
    badge: 'PREMIUM',
  },
  {
    id: 'solestudio-retro',
    name: 'SoleStudio Retro Low',
    subtitle: '70s Vintage Low-Profile Trainer',
    description: 'Featherweight contour with earth-tone palettes, natural gum outsole accents, and supple brushed suede toe caps.',
    basePrice: 6999, // ₹6,999
    currency: 'INR',
    modelPath: '/models/sneaker-pro.glb',
    modelStatus: 'available',
    defaultConfiguration: {
      ...generateDefaultConfiguration(),
      mesh: { color: '#F3EFE0', materialPresetId: 'suede' },
      stripes: { color: '#556B2F', materialPresetId: 'leather' },
      caps: { color: '#C2B280', materialPresetId: 'suede' },
      band: { color: '#8D7B68', materialPresetId: 'leather' },
      patch: { color: '#556B2F', materialPresetId: 'leather' },
      laces: { color: '#DED8CE', materialPresetId: 'knit' },
      inner: { color: '#DED8CE', materialPresetId: 'mesh' },
      sole: { color: '#C2B280', materialPresetId: 'rubber' },
    },
    supportedSizes: [6, 7, 8, 9, 10, 11],
    defaultSize: 8,
    availableParts: ORDERED_PARTS,
    thumbnail: '/images/retro-low.jpg',
  },
];

export const DEFAULT_PRODUCT_ID = 'solestudio-glide';

export function getProductById(id: string): ProductDefinition {
  return PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
}

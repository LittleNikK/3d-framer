import type { PartId, MaterialPresetId } from '../types';

export interface LogicalPartConfig {
  id: PartId;
  name: string;
  category: 'Upper' | 'Accents' | 'Hardware' | 'Foundation';
  description: string;
  defaultColor: string;
  defaultMaterial: MaterialPresetId;
  supportedMaterials: MaterialPresetId[];
  meshNodeName: string;      // The GLTF node name
  materialSlotName: string;  // The GLTF material slot name in the model
  priceModifier?: number;
}

export const LOGICAL_PARTS: Record<PartId, LogicalPartConfig> = {
  mesh: {
    id: 'mesh',
    name: 'Main Upper',
    category: 'Upper',
    description: 'Vamp and quarter side body shaping the silhouette',
    defaultColor: '#F3EFE0', // Off-White
    defaultMaterial: 'leather',
    supportedMaterials: ['leather', 'suede', 'mesh', 'knit', 'glossy'],
    meshNodeName: 'Shoe',
    materialSlotName: 'mesh',
  },
  caps: {
    id: 'caps',
    name: 'Toe Overlay & Caps',
    category: 'Upper',
    description: 'Front protective bumper and reinforced eyelet strips',
    defaultColor: '#C2B280', // Desert Sand
    defaultMaterial: 'suede',
    supportedMaterials: ['leather', 'suede', 'rubber', 'glossy'],
    meshNodeName: 'Shoe',
    materialSlotName: 'caps',
  },
  stripes: {
    id: 'stripes',
    name: 'Side Stripes',
    category: 'Accents',
    description: 'Iconic lateral brand stripes and support contours',
    defaultColor: '#EA580C', // Hyper Tangerine
    defaultMaterial: 'glossy',
    supportedMaterials: ['leather', 'suede', 'rubber', 'glossy'],
    meshNodeName: 'Shoe',
    materialSlotName: 'stripes',
  },
  band: {
    id: 'band',
    name: 'Heel Counter',
    category: 'Accents',
    description: 'Rear stabilization band and Achilles cushion frame',
    defaultColor: '#2C3038', // Charcoal
    defaultMaterial: 'leather',
    supportedMaterials: ['leather', 'suede', 'rubber', 'glossy'],
    meshNodeName: 'Shoe',
    materialSlotName: 'band',
  },
  patch: {
    id: 'patch',
    name: 'Tongue Badge',
    category: 'Accents',
    description: 'Signature debossed studio patch on the padded tongue',
    defaultColor: '#EA580C', // Tangerine
    defaultMaterial: 'leather',
    supportedMaterials: ['leather', 'rubber', 'glossy'],
    meshNodeName: 'Shoe',
    materialSlotName: 'patch',
    priceModifier: 150,
  },
  laces: {
    id: 'laces',
    name: 'Laces',
    category: 'Hardware',
    description: 'High-density braided cord with tipped aglets',
    defaultColor: '#FFFFFF', // Pure White
    defaultMaterial: 'knit',
    supportedMaterials: ['knit', 'leather'],
    meshNodeName: 'Shoe',
    materialSlotName: 'laces',
  },
  inner: {
    id: 'inner',
    name: 'Collar & Lining',
    category: 'Upper',
    description: 'Plush ankle surround and breathable interior sockliner',
    defaultColor: '#111215', // Triple Black
    defaultMaterial: 'mesh',
    supportedMaterials: ['mesh', 'knit', 'leather'],
    meshNodeName: 'Shoe',
    materialSlotName: 'inner',
  },
  sole: {
    id: 'sole',
    name: 'Midsole & Outsole',
    category: 'Foundation',
    description: 'Sculpted shock-absorbing midsole with gum traction',
    defaultColor: '#FFFFFF', // Pure White
    defaultMaterial: 'rubber',
    supportedMaterials: ['rubber', 'glossy'],
    meshNodeName: 'Shoe',
    materialSlotName: 'sole',
  },
};

export const ORDERED_PARTS: PartId[] = [
  'mesh',
  'caps',
  'stripes',
  'band',
  'patch',
  'laces',
  'inner',
  'sole',
];

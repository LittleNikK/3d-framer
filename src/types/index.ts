// Type definitions for SOLESTUDIO 3D Customizer

export type PartId =
  | 'mesh'      // Main Upper
  | 'caps'      // Toe Overlay & Caps
  | 'stripes'   // Side Stripes / Panels
  | 'band'      // Heel Band / Panel
  | 'patch'     // Tongue Patch / Logo
  | 'laces'     // Laces
  | 'inner'     // Collar & Inner Lining
  | 'sole';     // Midsole & Outsole

export type MaterialPresetId =
  | 'leather'
  | 'suede'
  | 'mesh'
  | 'knit'
  | 'rubber'
  | 'glossy';

export interface MaterialPreset {
  id: MaterialPresetId;
  name: string;
  description: string;
  roughness: number;
  metalness: number;
  clearcoat?: number;
  priceModifier: number; // in INR
}

export interface PartCustomization {
  color: string;
  materialPresetId: MaterialPresetId;
}

export type CustomizationMap = Record<PartId, PartCustomization>;

export type CameraPreset = 'front' | 'side' | 'rear' | 'top' | 'threeQuarter' | 'hero';

export interface ProductDefinition {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  basePrice: number; // in INR
  currency: string;
  modelPath: string;
  modelStatus: 'available' | 'fallback';
  defaultConfiguration: CustomizationMap;
  supportedSizes: number[]; // US sizes e.g. 7, 7.5, 8, ...
  defaultSize: number;
  availableParts: PartId[];
  thumbnail: string;
  badge?: string;
}

export interface SavedDesign {
  id: string;
  name: string;
  productId: string;
  size: number;
  configuration: CustomizationMap;
  price: number;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl?: string; // Data URL or placeholder
  version: number;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  productName: string;
  size: number;
  configuration: CustomizationMap;
  unitPrice: number;
  quantity: number;
  thumbnailUrl?: string;
  addedAt: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface DemoOrder {
  orderId: string;
  referenceNumber: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  status: 'confirmed' | 'processing' | 'shipped';
  createdAt: string;
  isDemo: true;
}

export interface MeshInspectionInfo {
  meshCount: number;
  materials: {
    name: string;
    index: number;
    roughness?: number;
    metalness?: number;
    color?: string;
  }[];
  meshes: {
    name: string;
    materialNames: string[];
  }[];
}

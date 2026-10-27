import type { CustomizationMap, ProductDefinition } from '../types';
import { MATERIAL_PRESETS } from './materials';
import { LOGICAL_PARTS } from './meshMappings';

export interface PriceBreakdown {
  basePrice: number;
  materialUpgrades: { partName: string; materialName: string; amount: number }[];
  partExtras: { partName: string; amount: number }[];
  totalPrice: number;
}

/**
 * Calculates deterministic pricing for a customized sneaker
 */
export function calculateCustomizationPrice(
  product: ProductDefinition,
  configuration: CustomizationMap
): PriceBreakdown {
  let total = product.basePrice;
  const materialUpgrades: PriceBreakdown['materialUpgrades'] = [];
  const partExtras: PriceBreakdown['partExtras'] = [];

  for (const partId of product.availableParts) {
    const partConfig = LOGICAL_PARTS[partId];
    const partCustom = configuration[partId];

    if (!partCustom) continue;

    // Check material upgrade cost
    const material = MATERIAL_PRESETS[partCustom.materialPresetId];
    if (material && material.priceModifier > 0) {
      total += material.priceModifier;
      materialUpgrades.push({
        partName: partConfig.name,
        materialName: material.name,
        amount: material.priceModifier,
      });
    }

    // Check part extra cost (e.g. debossed tongue badge)
    if (partConfig.priceModifier && partConfig.priceModifier > 0) {
      total += partConfig.priceModifier;
      partExtras.push({
        partName: partConfig.name,
        amount: partConfig.priceModifier,
      });
    }
  }

  return {
    basePrice: product.basePrice,
    materialUpgrades,
    partExtras,
    totalPrice: total,
  };
}

/**
 * Formats a number into Indian Rupee representation (e.g., ₹7,499)
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

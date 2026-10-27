import type { CustomizationMap, PartId, MaterialPresetId } from '../types';
import { ORDERED_PARTS } from '../config/meshMappings';
import { MATERIAL_PRESETS } from '../config/materials';
import { normalizeHexColor } from '../config/colors';

interface CompactConfigPayload {
  v: number;       // Version (1)
  p: string;       // Product ID
  s: number;       // Size
  c: Record<string, [string, string]>; // partId -> [hexColor, materialPresetId]
}

export class ShareService {
  /**
   * Encodes a design configuration into a URL-safe compact string
   */
  encodeConfiguration(
    productId: string,
    size: number,
    configuration: CustomizationMap
  ): string {
    const compactParts: Record<string, [string, string]> = {};

    for (const partId of ORDERED_PARTS) {
      const part = configuration[partId];
      if (part) {
        compactParts[partId] = [part.color, part.materialPresetId];
      }
    }

    const payload: CompactConfigPayload = {
      v: 1,
      p: productId,
      s: size,
      c: compactParts,
    };

    try {
      const json = JSON.stringify(payload);
      // Safe base64 encode for browser
      return encodeURIComponent(btoa(json));
    } catch (e) {
      console.error('Failed to encode share configuration:', e);
      return '';
    }
  }

  /**
   * Decodes and validates a configuration string from a share URL
   */
  decodeConfiguration(encoded: string): {
    productId?: string;
    size?: number;
    configuration?: CustomizationMap;
    error?: string;
  } {
    try {
      const json = atob(decodeURIComponent(encoded));
      const payload = JSON.parse(json) as CompactConfigPayload;

      if (!payload || payload.v !== 1 || !payload.c) {
        return { error: 'Unsupported or corrupted configuration payload.' };
      }

      const configuration: Partial<CustomizationMap> = {};

      for (const [partId, val] of Object.entries(payload.c)) {
        if (!ORDERED_PARTS.includes(partId as PartId)) continue;
        if (!Array.isArray(val) || val.length < 2) continue;

        const [colorInput, materialInput] = val;
        const normalizedColor = normalizeHexColor(colorInput);
        const materialId = materialInput as MaterialPresetId;

        if (normalizedColor && MATERIAL_PRESETS[materialId]) {
          configuration[partId as PartId] = {
            color: normalizedColor,
            materialPresetId: materialId,
          };
        }
      }

      if (Object.keys(configuration).length === 0) {
        return { error: 'No valid customized parts could be recovered.' };
      }

      return {
        productId: payload.p,
        size: typeof payload.s === 'number' ? payload.s : 9,
        configuration: configuration as CustomizationMap,
      };
    } catch {
      return { error: 'Invalid share link format. Restoring default studio layout.' };
    }
  }

  /**
   * Creates a full shareable URL
   */
  generateShareUrl(productId: string, size: number, configuration: CustomizationMap): string {
    const encoded = this.encodeConfiguration(productId, size, configuration);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/customize/${productId}?config=${encoded}`;
  }
}

export const shareService = new ShareService();

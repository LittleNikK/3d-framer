import { describe, it, expect, beforeEach } from 'vitest';
import { calculateCustomizationPrice, formatINR } from '../config/pricing';
import { normalizeHexColor, getColorName } from '../config/colors';
import { getProductById, generateDefaultConfiguration } from '../config/products';
import { LOGICAL_PARTS, ORDERED_PARTS } from '../config/meshMappings';
import { shareService } from '../services/shareService';
import { useConfiguratorStore } from '../store/useConfiguratorStore';
import { useCartStore } from '../store/useCartStore';

describe('SoleStudio Customizer Core Tests', () => {
  describe('Deterministic Pricing Calculation', () => {
    it('calculates the base product price accurately with default configuration', () => {
      const product = getProductById('solestudio-glide');
      const defaultConfig = generateDefaultConfiguration();
      const pricing = calculateCustomizationPrice(product, defaultConfig);

      expect(pricing.basePrice).toBe(7499);
      expect(pricing.totalPrice).toBeGreaterThanOrEqual(pricing.basePrice);
    });

    it('adds material upgrades correctly when premium materials are applied', () => {
      const product = getProductById('solestudio-glide');
      const config = generateDefaultConfiguration();

      // Base price before adding suede to mesh
      const initialPricing = calculateCustomizationPrice(product, config);

      // Upgrade main mesh to Italian Suede (+₹550)
      config.mesh = { color: '#ffffff', materialPresetId: 'suede' };
      const updatedPricing = calculateCustomizationPrice(product, config);

      expect(updatedPricing.totalPrice).toBe(initialPricing.totalPrice + 150); // Suede is 550 vs leather default 400
    });

    it('formats Indian Rupee currency with proper symbol and separators', () => {
      expect(formatINR(7499)).toMatch(/₹\s?7,499/);
      expect(formatINR(12500)).toMatch(/₹\s?12,500/);
    });
  });

  describe('Color Validation & Normalization', () => {
    it('normalizes 3-character hex colors to 6-character uppercase hex', () => {
      expect(normalizeHexColor('#fff')).toBe('#FFFFFF');
      expect(normalizeHexColor('f00')).toBe('#FF0000');
      expect(normalizeHexColor('#ea580c')).toBe('#EA580C');
    });

    it('rejects invalid hex strings gracefully', () => {
      expect(normalizeHexColor('not-a-color')).toBeNull();
      expect(normalizeHexColor('#12345')).toBeNull();
      expect(normalizeHexColor('#GGGGGG')).toBeNull();
    });

    it('resolves curated color names accurately', () => {
      expect(getColorName('#FFFFFF')).toBe('Pure White');
      expect(getColorName('#EA580C')).toBe('Hyper Tangerine');
    });
  });

  describe('Mesh & Part Mapping Integrity', () => {
    it('contains all 8 logical parts', () => {
      expect(ORDERED_PARTS).toHaveLength(8);
      for (const partId of ORDERED_PARTS) {
        expect(LOGICAL_PARTS[partId]).toBeDefined();
        expect(LOGICAL_PARTS[partId].meshNodeName).toBe('Shoe');
        expect(LOGICAL_PARTS[partId].materialSlotName).toBe(partId);
      }
    });

    it('generates a full default configuration map for every part', () => {
      const config = generateDefaultConfiguration();
      for (const partId of ORDERED_PARTS) {
        expect(config[partId]).toBeDefined();
        expect(config[partId].color).toBeTruthy();
        expect(config[partId].materialPresetId).toBeTruthy();
      }
    });

    it('handles unknown product IDs by falling back safely to the flagship product', () => {
      const fallback = getProductById('non-existent-product-id');
      expect(fallback.id).toBe('solestudio-glide');
    });
  });

  describe('Shareable Configuration Serialization', () => {
    it('encodes and round-trip decodes sneaker configuration accurately', () => {
      const config = generateDefaultConfiguration();
      config.stripes = { color: '#EA580C', materialPresetId: 'glossy' };
      config.mesh = { color: '#111215', materialPresetId: 'suede' };

      const encoded = shareService.encodeConfiguration('solestudio-glide', 10, config);
      expect(encoded).toBeTruthy();

      const decoded = shareService.decodeConfiguration(encoded);
      expect(decoded.error).toBeUndefined();
      expect(decoded.productId).toBe('solestudio-glide');
      expect(decoded.size).toBe(10);
      expect(decoded.configuration?.stripes.color).toBe('#EA580C');
      expect(decoded.configuration?.stripes.materialPresetId).toBe('glossy');
      expect(decoded.configuration?.mesh.materialPresetId).toBe('suede');
    });

    it('gracefully handles corrupted or malformed payloads without crashing', () => {
      const result = shareService.decodeConfiguration('bad_encoded_string_123');
      expect(result.error).toBeTruthy();
      expect(result.configuration).toBeUndefined();
    });
  });

  describe('Configurator Store State & History (Undo/Redo)', () => {
    beforeEach(() => {
      useConfiguratorStore.getState().resetConfiguration();
    });

    it('records state transitions in history and supports undo and redo', () => {
      const store = useConfiguratorStore.getState();

      store.selectPart('mesh');
      store.setPartColor('#E11D48');

      expect(useConfiguratorStore.getState().configuration.mesh.color).toBe('#E11D48');
      expect(useConfiguratorStore.getState().canUndo()).toBe(true);

      // Undo
      useConfiguratorStore.getState().undo();
      expect(useConfiguratorStore.getState().configuration.mesh.color).not.toBe('#E11D48');
      expect(useConfiguratorStore.getState().canRedo()).toBe(true);

      // Redo
      useConfiguratorStore.getState().redo();
      expect(useConfiguratorStore.getState().configuration.mesh.color).toBe('#E11D48');
    });

    it('restores default factory configuration on reset', () => {
      const store = useConfiguratorStore.getState();
      store.selectPart('sole');
      store.setPartColor('#EA580C');

      useConfiguratorStore.getState().resetConfiguration();
      const defaultColor = LOGICAL_PARTS.sole.defaultColor;
      expect(useConfiguratorStore.getState().configuration.sole.color).toBe(defaultColor);
    });
  });

  describe('Demo Shopping Cart Isolation', () => {
    beforeEach(() => {
      useCartStore.getState().clearCart();
    });

    it('isolates different custom configurations as separate cart line items', () => {
      const cart = useCartStore.getState();
      const config1 = generateDefaultConfiguration();
      const config2 = generateDefaultConfiguration();
      config2.mesh = { color: '#000000', materialPresetId: 'suede' };

      cart.addItem('solestudio-glide', 9, config1);
      cart.addItem('solestudio-glide', 9.5, config2);

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(2);
      expect(items[0].size).toBe(9.5);
      expect(items[1].size).toBe(9);
      expect(items[0].configuration.mesh.color).toBe('#000000');
    });

    it('updates quantities and recalculates subtotal properly', () => {
      const cart = useCartStore.getState();
      const config = generateDefaultConfiguration();
      cart.addItem('solestudio-glide', 9, config);

      const item = useCartStore.getState().items[0];
      const initialPrice = item.unitPrice;

      cart.updateQuantity(item.cartItemId, 2);
      expect(useCartStore.getState().items[0].quantity).toBe(2);
      expect(useCartStore.getState().getSubtotal()).toBe(initialPrice * 2);

      cart.removeItem(item.cartItemId);
      expect(useCartStore.getState().items).toHaveLength(0);
      expect(useCartStore.getState().getSubtotal()).toBe(0);
    });
  });
});

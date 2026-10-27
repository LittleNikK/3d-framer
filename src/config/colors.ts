export interface ColorOption {
  name: string;
  hex: string;
  isDark?: boolean;
}

export interface ColorPalette {
  id: string;
  name: string;
  colors: ColorOption[];
}

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'essentials',
    name: 'Essentials',
    colors: [
      { name: 'Pure White', hex: '#FFFFFF' },
      { name: 'Sail / Off-White', hex: '#F3EFE0' },
      { name: 'Bone / Chalk', hex: '#DED8CE' },
      { name: 'Cool Grey', hex: '#949BA4' },
      { name: 'Charcoal', hex: '#2C3038', isDark: true },
      { name: 'Triple Black', hex: '#111215', isDark: true },
    ],
  },
  {
    id: 'earth',
    name: 'Earth Tones',
    colors: [
      { name: 'Desert Sand', hex: '#C2B280' },
      { name: 'Warm Taupe', hex: '#8D7B68' },
      { name: 'Olive Drab', hex: '#556B2F', isDark: true },
      { name: 'Deep Forest', hex: '#2D4A3E', isDark: true },
      { name: 'Terracotta', hex: '#C8644A' },
      { name: 'Espresso', hex: '#3E2723', isDark: true },
    ],
  },
  {
    id: 'bold',
    name: 'Bold Accents',
    colors: [
      { name: 'Apex Crimson', hex: '#E11D48' },
      { name: 'Hyper Tangerine', hex: '#EA580C' },
      { name: 'Solar Amber', hex: '#D97706' },
      { name: 'Electric Cobalt', hex: '#2563EB' },
      { name: 'Cyber Teal', hex: '#0D9488' },
      { name: 'Royal Violet', hex: '#7C3AED' },
    ],
  },
  {
    id: 'pastels',
    name: 'Pastels & Studio',
    colors: [
      { name: 'Lavender Mist', hex: '#DDD6FE' },
      { name: 'Mint Glaze', hex: '#CCFBF1' },
      { name: 'Rose Dust', hex: '#FCE7F3' },
      { name: 'Butter Cream', hex: '#FEF3C7' },
      { name: 'Sky Ice', hex: '#E0F2FE' },
      { name: 'Pistachio', hex: '#D1FAE5' },
    ],
  },
];

/**
 * Validates and normalizes 3 or 6-digit hex colors
 */
export function normalizeHexColor(input: string): string | null {
  let cleaned = input.trim();
  if (!cleaned.startsWith('#')) {
    cleaned = '#' + cleaned;
  }
  const hexRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  if (!hexRegex.test(cleaned)) {
    return null;
  }
  if (cleaned.length === 4) {
    // Expand 3-digit hex to 6-digit
    cleaned = '#' + cleaned[1] + cleaned[1] + cleaned[2] + cleaned[2] + cleaned[3] + cleaned[3];
  }
  return cleaned.toUpperCase();
}

/**
 * Find color name by hex, or generate a readable representation
 */
export function getColorName(hex: string): string {
  const norm = normalizeHexColor(hex);
  if (!norm) return hex;
  for (const palette of COLOR_PALETTES) {
    const found = palette.colors.find(c => c.hex.toUpperCase() === norm);
    if (found) return found.name;
  }
  return norm;
}

import React, { useState, useEffect } from 'react';
import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import { COLOR_PALETTES, normalizeHexColor, getColorName } from '../../config/colors';
import { Palette, Check, Hash } from 'lucide-react';

export function ColorPicker() {
  const selectedPartId = useConfiguratorStore(state => state.selectedPartId);
  const configuration = useConfiguratorStore(state => state.configuration);
  const setPartColor = useConfiguratorStore(state => state.setPartColor);

  const currentColor = configuration[selectedPartId]?.color || '#ffffff';

  const [activePaletteId, setActivePaletteId] = useState<string>('essentials');
  const [customHexInput, setCustomHexInput] = useState<string>(currentColor);
  const [hexError, setHexError] = useState<string | null>(null);

  useEffect(() => {
    setCustomHexInput(currentColor);
    setHexError(null);
  }, [currentColor, selectedPartId]);

  const handleCustomHexSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizeHexColor(customHexInput);
    if (!normalized) {
      setHexError('Please enter a valid 3 or 6-digit hex code (e.g. #EA580C)');
      return;
    }
    setHexError(null);
    setPartColor(normalized);
  };

  const currentPalette = COLOR_PALETTES.find(p => p.id === activePaletteId) || COLOR_PALETTES[0];

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-amber-400" />
          <span>Color: {getColorName(currentColor)}</span>
        </h3>
        <span className="text-[11px] font-mono text-slate-400 uppercase bg-slate-900/60 px-2 py-0.5 rounded border border-white/5">
          {currentColor}
        </span>
      </div>

      {/* Palette Category Selector */}
      <div className="flex items-center gap-1 p-1 bg-slate-900/60 rounded-lg border border-white/5 overflow-x-auto">
        {COLOR_PALETTES.map(palette => {
          const isActive = palette.id === activePaletteId;
          return (
            <button
              key={palette.id}
              type="button"
              onClick={() => setActivePaletteId(palette.id)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {palette.name}
            </button>
          );
        })}
      </div>

      {/* Palette Color Swatches */}
      <div className="grid grid-cols-6 gap-2 pt-1">
        {currentPalette.colors.map(colorOption => {
          const isSelected = currentColor.toUpperCase() === colorOption.hex.toUpperCase();

          return (
            <button
              key={colorOption.hex}
              type="button"
              onClick={() => {
                setPartColor(colorOption.hex);
                setCustomHexInput(colorOption.hex);
                setHexError(null);
              }}
              title={`${colorOption.name} (${colorOption.hex})`}
              className={`group relative aspect-square rounded-xl transition-all duration-200 border flex items-center justify-center cursor-pointer ${
                isSelected
                  ? 'border-amber-400 ring-2 ring-amber-500/50 scale-105 shadow-md shadow-amber-500/10'
                  : 'border-white/10 hover:border-white/30 hover:scale-105'
              }`}
              style={{ backgroundColor: colorOption.hex }}
            >
              {isSelected && (
                <Check
                  className={`w-4 h-4 stroke-[2.5] ${
                    colorOption.isDark ? 'text-white' : 'text-slate-900'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Custom Hex Color Input Form */}
      <form onSubmit={handleCustomHexSubmit} className="mt-1 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500">
              <Hash className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              value={customHexInput}
              onChange={e => {
                setCustomHexInput(e.target.value);
                setHexError(null);
              }}
              placeholder="#FFFFFF"
              maxLength={7}
              className={`w-full pl-8 pr-3 py-1.5 bg-slate-950/70 border rounded-lg text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none transition-colors ${
                hexError
                  ? 'border-red-500 focus:border-red-400'
                  : 'border-white/10 focus:border-amber-500/60'
              }`}
            />
          </div>

          <button
            type="submit"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            Apply
          </button>
        </div>

        {hexError && <p className="text-[11px] text-red-400">{hexError}</p>}
      </form>
    </div>
  );
}

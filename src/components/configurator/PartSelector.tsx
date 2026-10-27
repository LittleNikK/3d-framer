import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import { LOGICAL_PARTS, ORDERED_PARTS } from '../../config/meshMappings';
import { MATERIAL_PRESETS } from '../../config/materials';
import { Layers } from 'lucide-react';

export function PartSelector() {
  const selectedPartId = useConfiguratorStore(state => state.selectedPartId);
  const selectPart = useConfiguratorStore(state => state.selectPart);
  const configuration = useConfiguratorStore(state => state.configuration);

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>Sneaker Zone ({ORDERED_PARTS.length})</span>
        </h3>
        <span className="text-[11px] text-slate-400">
          Direct 3D click supported
        </span>
      </div>

      {/* Responsive horizontal scrollable or grid chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2">
        {ORDERED_PARTS.map(partId => {
          const part = LOGICAL_PARTS[partId];
          const custom = configuration[partId];
          const isSelected = selectedPartId === partId;
          const material = custom ? MATERIAL_PRESETS[custom.materialPresetId] : null;

          return (
            <button
              key={partId}
              type="button"
              onClick={() => selectPart(partId)}
              className={`group relative text-left p-2.5 rounded-xl transition-all duration-200 border flex items-center gap-3 cursor-pointer ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/30'
                  : 'bg-slate-900/40 hover:bg-slate-800/60 border-white/5 hover:border-white/15'
              }`}
            >
              {/* Color swatch circle with material accent */}
              <div
                className="w-7 h-7 rounded-full shrink-0 border border-white/20 shadow-inner flex items-center justify-center relative overflow-hidden transition-transform group-hover:scale-105"
                style={{ backgroundColor: custom?.color || '#ffffff' }}
              >
                {/* Subtle highlight ring if selected */}
                {isSelected && (
                  <div className="absolute inset-0 rounded-full border-2 border-amber-400 animate-pulse" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`text-xs font-semibold truncate ${
                      isSelected ? 'text-amber-300' : 'text-slate-200 group-hover:text-white'
                    }`}
                  >
                    {part.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-slate-400 truncate">
                    {material?.name || 'Leather'}
                  </span>
                  {part.priceModifier ? (
                    <span className="text-[9px] font-mono text-amber-400/90 font-medium">
                      +₹{part.priceModifier}
                    </span>
                  ) : null}
                </div>
              </div>

              {isSelected && (
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 shadow-[0_0_8px_#f59e0b]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

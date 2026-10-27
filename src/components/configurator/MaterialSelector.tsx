import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import { MATERIAL_PRESETS } from '../../config/materials';
import { LOGICAL_PARTS } from '../../config/meshMappings';
import type { MaterialPresetId } from '../../types';
import { Box, Check, Info } from 'lucide-react';

export function MaterialSelector() {
  const selectedPartId = useConfiguratorStore(state => state.selectedPartId);
  const configuration = useConfiguratorStore(state => state.configuration);
  const setPartMaterial = useConfiguratorStore(state => state.setPartMaterial);

  const activePart = LOGICAL_PARTS[selectedPartId];
  const currentMaterialId = configuration[selectedPartId]?.materialPresetId || activePart.defaultMaterial;

  const allPresetIds: MaterialPresetId[] = ['leather', 'suede', 'mesh', 'knit', 'rubber', 'glossy'];

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Box className="w-3.5 h-3.5 text-amber-400" />
          <span>Surface Material</span>
        </h3>
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <Info className="w-3 h-3 text-slate-500" />
          PBR Physical Shaders
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {allPresetIds.map(presetId => {
          const preset = MATERIAL_PRESETS[presetId];
          const isSupported = activePart.supportedMaterials.includes(presetId);
          const isSelected = currentMaterialId === presetId;

          return (
            <button
              key={presetId}
              type="button"
              disabled={!isSupported}
              onClick={() => isSupported && setPartMaterial(presetId)}
              className={`group relative text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500/70 shadow-sm shadow-amber-500/10 ring-1 ring-amber-500/20'
                  : isSupported
                  ? 'bg-slate-900/40 hover:bg-slate-800/60 border-white/5 hover:border-white/15'
                  : 'bg-slate-950/20 border-white/5 opacity-40 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start justify-between gap-1.5">
                <span
                  className={`text-xs font-semibold ${
                    isSelected
                      ? 'text-amber-300'
                      : isSupported
                      ? 'text-slate-200 group-hover:text-white'
                      : 'text-slate-500'
                  }`}
                >
                  {preset.name}
                </span>

                {isSelected ? (
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                ) : !isSupported ? (
                  <span className="text-[9px] text-slate-500 font-mono">N/A</span>
                ) : null}
              </div>

              <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                {preset.description}
              </p>

              <div className="mt-2 flex items-center justify-between text-[10px]">
                <span className="font-mono text-slate-400">
                  {preset.priceModifier > 0 ? `+₹${preset.priceModifier}` : 'Included'}
                </span>
                <span className="text-[9px] font-mono text-slate-400">
                  R: {preset.roughness}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import { LOGICAL_PARTS, ORDERED_PARTS } from '../../config/meshMappings';
import { X, Terminal, CheckCircle2, ShieldCheck, Database } from 'lucide-react';

interface ModelInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModelInspectorModal({ isOpen, onClose }: ModelInspectorModalProps) {
  const modelInspection = useConfiguratorStore(state => state.modelInspection);
  const modelStatus = useConfiguratorStore(state => state.modelStatus);
  const configuration = useConfiguratorStore(state => state.configuration);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl max-h-[85vh] p-6 rounded-2xl glass-panel border-white/10 shadow-2xl relative flex flex-col gap-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>3D Asset Inspection & Mesh Mapping Report</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {modelStatus.toUpperCase()}
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Asset: /models/sneaker-pro.glb (Draco compressed)</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Diagnostics Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          {/* Asset Provenance & License */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Asset License & Provenance</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Standard open-source 3D footwear model with segmented PBR material slots (mesh, caps, laces, inner, sole, stripes, band, patch). Optimized with Draco geometry compression level 7 and hosted locally in <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded">public/models/</code> with offline Draco decoders in <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded">public/draco/</code>.
            </p>
          </div>

          {/* Active Mesh-to-Logical Part Mapping Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-slate-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-amber-400" />
                Active Logical Mapping Table ({ORDERED_PARTS.length} zones)
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 100% Bound
              </span>
            </div>

            <div className="rounded-xl border border-white/5 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-900/80 font-mono text-[10px] uppercase text-slate-400">
                  <tr>
                    <th className="p-2.5">Logical Part</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Slot / Mesh</th>
                    <th className="p-2.5">Active Color</th>
                    <th className="p-2.5">Preset</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                  {ORDERED_PARTS.map(partId => {
                    const part = LOGICAL_PARTS[partId];
                    const custom = configuration[partId];
                    return (
                      <tr key={partId} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-2.5 font-sans font-semibold text-slate-200">{part.name}</td>
                        <td className="p-2.5 text-slate-400">{part.category}</td>
                        <td className="p-2.5 text-amber-300/90">{part.materialSlotName}</td>
                        <td className="p-2.5 flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/20 inline-block"
                            style={{ backgroundColor: custom?.color || '#ffffff' }}
                          />
                          <span className="text-slate-300">{custom?.color}</span>
                        </td>
                        <td className="p-2.5 text-slate-400 capitalize">{custom?.materialPresetId}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Model Inspection Raw Data */}
          {modelInspection && (
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5 font-mono text-[11px] space-y-2">
              <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                WebGL Material Slot Diagnostics
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                {modelInspection.materials.map(m => (
                  <div key={m.index} className="p-2 rounded bg-slate-900/60 border border-white/5">
                    <div className="text-amber-400 font-bold">{m.name}</div>
                    <div className="text-slate-400 text-[10px]">
                      Roughness: {m.roughness ?? 'N/A'} • Metalness: {m.metalness ?? 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
}

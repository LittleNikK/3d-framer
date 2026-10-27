import { useState } from 'react';
import { useRouter } from '../app/router';
import { useSavedDesignsStore } from '../store/useSavedDesignsStore';
import { useConfiguratorStore } from '../store/useConfiguratorStore';
import { useToastStore } from '../store/useToastStore';
import { getProductById } from '../config/products';
import { formatINR } from '../config/pricing';
import type { SavedDesign } from '../types';
import { ORDERED_PARTS } from '../config/meshMappings';
import {
  Bookmark,
  Plus,
  Box,
  Edit3,
  Copy,
  Trash2,
  Ruler,
  ExternalLink,
} from 'lucide-react';

export function SavedDesignsPage() {
  const { navigate } = useRouter();
  const designs = useSavedDesignsStore(state => state.designs);
  const duplicateDesign = useSavedDesignsStore(state => state.duplicateDesign);
  const renameDesign = useSavedDesignsStore(state => state.renameDesign);
  const deleteDesign = useSavedDesignsStore(state => state.deleteDesign);

  const loadConfiguration = useConfiguratorStore(state => state.loadConfiguration);
  const addToast = useToastStore(state => state.addToast);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState('');

  const handleOpenDesign = (design: SavedDesign) => {
    loadConfiguration(design.configuration, design.size, design.productId);
    navigate(`/customize/${design.productId}`);
    addToast({
      type: 'success',
      title: 'Design Loaded',
      description: `Opened "${design.name}" in the 3D customizer.`,
    });
  };

  const handleDuplicate = (id: string) => {
    const copy = duplicateDesign(id);
    if (copy) {
      addToast({
        type: 'success',
        title: 'Design Duplicated',
        description: `Created copy "${copy.name}".`,
      });
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from your vault?`)) {
      deleteDesign(id);
      addToast({
        type: 'info',
        title: 'Design Deleted',
        description: `Removed "${name}" from your studio collection.`,
      });
    }
  };

  const handleStartRename = (design: SavedDesign) => {
    setEditingId(design.id);
    setRenameInput(design.name);
  };

  const handleSaveRename = (id: string) => {
    if (renameInput.trim()) {
      renameDesign(id, renameInput.trim());
      addToast({
        type: 'success',
        title: 'Design Renamed',
        description: `Updated name to "${renameInput.trim()}".`,
      });
    }
    setEditingId(null);
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold mb-1">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Vault Archive</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
            My Custom Designs
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Revisit, duplicate, rename, or order your previously customized bespoke footwear.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/customize/solestudio-glide')}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer w-fit"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Customization</span>
        </button>
      </div>

      {/* Designs Grid or Empty State */}
      {designs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 rounded-3xl glass-panel border border-white/5 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Bookmark className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Your Vault is Empty</h3>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              You haven't saved any customized sneakers yet. Launch the 3D studio, tweak materials and colors, and click "Save Design".
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/customize/solestudio-glide')}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            Launch 3D Studio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map(design => {
            const product = getProductById(design.productId);
            const isEditing = editingId === design.id;

            return (
              <div
                key={design.id}
                className="rounded-2xl glass-panel border border-white/5 hover:border-white/15 transition-all duration-200 overflow-hidden flex flex-col justify-between group shadow-xl"
              >
                {/* Thumbnail Preview Area */}
                <div
                  onClick={() => handleOpenDesign(design)}
                  className="relative aspect-[16/10] bg-[#11131a] flex items-center justify-center p-4 border-b border-white/5 cursor-pointer overflow-hidden group-hover:bg-[#141722] transition-colors"
                >
                  {design.thumbnailUrl ? (
                    <img
                      src={design.thumbnailUrl}
                      alt={design.name}
                      className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-600 gap-2">
                      <Box className="w-8 h-8 text-amber-500/40" />
                      <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                        {product.name}
                      </span>
                    </div>
                  )}

                  <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-amber-300 font-bold">
                    {formatINR(design.price)}
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {isEditing ? (
                      <div className="flex items-center gap-1.5 mb-1">
                        <input
                          type="text"
                          value={renameInput}
                          onChange={e => setRenameInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleSaveRename(design.id)}
                          autoFocus
                          className="px-2 py-1 bg-slate-900 border border-amber-500 rounded text-xs text-white font-bold w-full focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveRename(design.id)}
                          className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold text-[10px] rounded"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                          {design.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => handleStartRename(design)}
                          title="Rename design"
                          className="text-slate-500 hover:text-slate-300 p-1 rounded transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span className="font-medium text-slate-300">{product.name}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Ruler className="w-3 h-3 text-slate-500" />
                        US {design.size}
                      </span>
                    </div>
                  </div>

                  {/* Swatch Preview Bar */}
                  <div className="flex items-center gap-1.5 pt-2">
                    {ORDERED_PARTS.slice(0, 7).map(partId => {
                      const color = design.configuration[partId]?.color || '#ffffff';
                      return (
                        <div
                          key={partId}
                          className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: color }}
                          title={`${partId}: ${color}`}
                        />
                      );
                    })}
                    <span className="text-[10px] font-mono text-slate-500 ml-1">+1</span>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenDesign(design)}
                      className="px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Open in 3D</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleDuplicate(design.id)}
                        title="Duplicate this design"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(design.id, design.name)}
                        title="Delete this design"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import { useSavedDesignsStore } from '../../store/useSavedDesignsStore';
import { useToastStore } from '../../store/useToastStore';
import { getProductById } from '../../config/products';
import { X, Bookmark, Check } from 'lucide-react';

interface SaveDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  getScreenshotUrl?: () => string | null;
}

export function SaveDesignModal({ isOpen, onClose, getScreenshotUrl }: SaveDesignModalProps) {
  const productId = useConfiguratorStore(state => state.productId);
  const configuration = useConfiguratorStore(state => state.configuration);
  const selectedSize = useConfiguratorStore(state => state.selectedSize);

  const saveDesign = useSavedDesignsStore(state => state.saveDesign);
  const addToast = useToastStore(state => state.addToast);

  const product = getProductById(productId);
  const [designName, setDesignName] = useState(`${product.name} Edition`);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const screenshot = getScreenshotUrl ? getScreenshotUrl() || undefined : undefined;
    const newDesign = saveDesign(designName, productId, selectedSize, configuration, screenshot);

    setIsSaved(true);
    addToast({
      type: 'success',
      title: 'Design Saved to Studio Vault',
      description: `"${newDesign.name}" has been recorded. You can reload or duplicate it anytime under My Designs.`,
    });

    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md p-6 rounded-2xl glass-panel border-white/10 shadow-2xl relative flex flex-col gap-4">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Save Custom Design</h3>
            <p className="text-xs text-slate-400">Store this configuration in your studio collection</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4 mt-2">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              Design Name
            </label>
            <input
              type="text"
              value={designName}
              onChange={e => setDesignName(e.target.value)}
              placeholder="e.g. Midnight Thunder Air"
              required
              maxLength={40}
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-white/10 focus:border-amber-500 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 text-xs text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Model:</span>
              <span className="text-slate-200 font-medium">{product.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Chosen Size:</span>
              <span className="text-slate-200 font-mono">US {selectedSize}</span>
            </div>
            <div className="flex justify-between">
              <span>Customized Zones:</span>
              <span className="text-amber-400 font-mono">8 of 8 parts</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaved}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save to My Designs</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

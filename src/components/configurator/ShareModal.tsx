import { useState } from 'react';
import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import { shareService } from '../../services/shareService';
import { useToastStore } from '../../store/useToastStore';
import { X, Share2, Copy, Check, Globe } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const productId = useConfiguratorStore(state => state.productId);
  const configuration = useConfiguratorStore(state => state.configuration);
  const selectedSize = useConfiguratorStore(state => state.selectedSize);

  const addToast = useToastStore(state => state.addToast);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = shareService.generateShareUrl(productId, selectedSize, configuration);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      addToast({
        type: 'success',
        title: 'Share Link Copied',
        description: 'Link copied to clipboard. Anyone opening it will view this exact 3D sneaker.',
      });
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      addToast({
        type: 'error',
        title: 'Failed to Copy',
        description: 'Please copy the link directly from the input field.',
      });
    });
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
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Share Your Creation</h3>
            <p className="text-xs text-slate-400">Send this exact 3D design to friends or collaborators</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-2">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              readOnly
              value={shareUrl}
              onClick={e => (e.target as HTMLInputElement).select()}
              className="bg-transparent text-xs font-mono text-slate-300 w-full focus:outline-none select-all truncate"
            />
            <button
              type="button"
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            This URL securely encodes your complete color palette, material shaders, and size choices into a self-contained payload. It loads instantly on mobile, tablet, or desktop.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

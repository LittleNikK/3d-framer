import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import { useCartStore } from '../../store/useCartStore';
import { useToastStore } from '../../store/useToastStore';
import { getProductById, PRODUCTS } from '../../config/products';
import { calculateCustomizationPrice, formatINR } from '../../config/pricing';
import { ShoppingBag, Bookmark, Share2, ChevronDown } from 'lucide-react';

interface PriceSummaryProps {
  onOpenSaveModal: () => void;
  onOpenShareModal: () => void;
  getScreenshotUrl?: () => string | null;
}

export function PriceSummary({
  onOpenSaveModal,
  onOpenShareModal,
  getScreenshotUrl,
}: PriceSummaryProps) {
  const productId = useConfiguratorStore(state => state.productId);
  const setProductId = useConfiguratorStore(state => state.setProductId);
  const configuration = useConfiguratorStore(state => state.configuration);
  const selectedSize = useConfiguratorStore(state => state.selectedSize);

  const addItemToCart = useCartStore(state => state.addItem);
  const addToast = useToastStore(state => state.addToast);

  const product = getProductById(productId);
  const pricing = calculateCustomizationPrice(product, configuration);

  const handleAddToCart = () => {
    const thumb = getScreenshotUrl ? getScreenshotUrl() || undefined : undefined;
    addItemToCart(productId, selectedSize, configuration, thumb);
    addToast({
      type: 'success',
      title: 'Added to Cart',
      description: `${product.name} (US ${selectedSize}) configured and reserved.`,
    });
  };

  return (
    <div className="w-full flex flex-col gap-4 p-5 rounded-2xl glass-panel border-white/10 shadow-xl">
      {/* Product Header & Switcher */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight">{product.name}</h2>
            {product.badge && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {product.badge}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{product.subtitle}</p>
        </div>

        {/* Product Model Selector dropdown */}
        <div className="relative">
          <select
            value={productId}
            onChange={e => setProductId(e.target.value)}
            className="appearance-none pl-3 pr-7 py-1.5 bg-slate-900/80 hover:bg-slate-800 border border-white/10 rounded-lg text-xs font-medium text-slate-200 focus:outline-none focus:border-amber-500/50 cursor-pointer"
          >
            {PRODUCTS.map(p => (
              <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                {p.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="space-y-1.5 pt-2 border-t border-white/5 text-xs">
        <div className="flex justify-between text-slate-400">
          <span>Base Model</span>
          <span className="font-mono text-slate-300">{formatINR(pricing.basePrice)}</span>
        </div>

        {pricing.materialUpgrades.map((item, idx) => (
          <div key={idx} className="flex justify-between text-slate-400">
            <span className="truncate pr-2">
              {item.partName} ({item.materialName})
            </span>
            <span className="font-mono text-amber-400 shrink-0">+{formatINR(item.amount)}</span>
          </div>
        ))}

        {pricing.partExtras.map((item, idx) => (
          <div key={idx} className="flex justify-between text-slate-400">
            <span className="truncate pr-2">{item.partName} Insignia</span>
            <span className="font-mono text-amber-400 shrink-0">+{formatINR(item.amount)}</span>
          </div>
        ))}

        <div className="flex justify-between items-baseline pt-2 border-t border-white/10">
          <div>
            <span className="text-sm font-bold text-white">Live Total</span>
            <p className="text-[10px] text-slate-400">Includes all material selections</p>
          </div>
          <span className="text-xl font-bold font-mono text-amber-400">
            {formatINR(pricing.totalPrice)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 pt-1">
        {/* Primary CTA: Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-amber-500/20 active:scale-[0.99] cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
          <span>Add to Bag • {formatINR(pricing.totalPrice)}</span>
        </button>

        {/* Secondary Actions: Save & Share */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onOpenSaveModal}
            className="py-2.5 px-3 bg-slate-900/60 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span>Save Design</span>
          </button>

          <button
            type="button"
            onClick={onOpenShareModal}
            className="py-2.5 px-3 bg-slate-900/60 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Share Link</span>
          </button>
        </div>
      </div>
    </div>
  );
}

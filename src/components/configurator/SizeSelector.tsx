import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import { getProductById } from '../../config/products';
import { Ruler } from 'lucide-react';

export function SizeSelector() {
  const productId = useConfiguratorStore(state => state.productId);
  const selectedSize = useConfiguratorStore(state => state.selectedSize);
  const setSize = useConfiguratorStore(state => state.setSize);

  const product = getProductById(productId);

  return (
    <div className="w-full flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Ruler className="w-3.5 h-3.5 text-amber-400" />
          <span>Select Size (US Men's / Unisex)</span>
        </h3>
        <span className="text-[11px] font-mono text-slate-300">
          UK {(selectedSize - 0.5).toFixed(1)} / EU {Math.round(selectedSize + 33)}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {product.supportedSizes.map(size => {
          const isSelected = selectedSize === size;
          return (
            <button
              key={size}
              type="button"
              onClick={() => setSize(size)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm shadow-amber-500/20'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border-white/5 hover:border-white/20'
              }`}
            >
              US {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}

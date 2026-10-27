import { useRouter } from '../app/router';
import { useCartStore } from '../store/useCartStore';
import { useConfiguratorStore } from '../store/useConfiguratorStore';
import { formatINR } from '../config/pricing';
import { ORDERED_PARTS, LOGICAL_PARTS } from '../config/meshMappings';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Box,
} from 'lucide-react';

export function CartPage() {
  const { navigate } = useRouter();
  const items = useCartStore(state => state.items);
  const removeItem = useCartStore(state => state.removeItem);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const getSubtotal = useCartStore(state => state.getSubtotal);
  const loadConfiguration = useConfiguratorStore(state => state.loadConfiguration);

  const subtotal = getSubtotal();
  const estimatedShipping = 0; // Free demo shipping
  const estimatedTax = Math.round(subtotal * 0.18); // 18% GST (demonstrative)
  const grandTotal = subtotal + estimatedShipping;

  const handleEditItem = (item: any) => {
    loadConfiguration(item.configuration, item.size, item.productId);
    navigate(`/customize/${item.productId}`);
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
      {/* Header */}
      <div className="pb-6 border-b border-white/5">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold mb-1">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Studio Bag</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
          Review Your Customized Footwear
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review customized sizes and materials before simulated demo checkout.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 rounded-3xl glass-panel border border-white/5 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Your Shopping Bag is Empty</h3>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              You haven't added any customized sneakers yet. Craft your pair in real-time 3D and click "Add to Bag".
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items List (Left Column) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {items.map(item => (
              <div
                key={item.cartItemId}
                className="p-5 rounded-2xl glass-panel border border-white/5 flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-lg group hover:border-white/15 transition-all"
              >
                {/* Thumbnail */}
                <div
                  onClick={() => handleEditItem(item)}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-[#11131a] flex items-center justify-center p-2 border border-white/5 shrink-0 overflow-hidden cursor-pointer hover:bg-[#141722] transition-colors"
                >
                  {item.thumbnailUrl ? (
                    <img
                      src={item.thumbnailUrl}
                      alt={item.productName}
                      className="w-full h-full object-contain filter drop-shadow-md"
                    />
                  ) : (
                    <Box className="w-8 h-8 text-amber-400/50" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3
                        onClick={() => handleEditItem(item)}
                        className="text-base font-bold text-white hover:text-amber-300 transition-colors cursor-pointer truncate"
                      >
                        {item.productName}
                      </h3>
                      <p className="text-xs font-mono text-slate-400">
                        Size: <span className="text-amber-400 font-bold">US {item.size}</span>
                      </p>
                    </div>

                    <span className="text-base font-bold font-mono text-white">
                      {formatINR(item.unitPrice * item.quantity)}
                    </span>
                  </div>

                  {/* Micro color chips */}
                  <div className="flex items-center gap-1">
                    {ORDERED_PARTS.slice(0, 6).map(partId => {
                      const color = item.configuration[partId]?.color || '#ffffff';
                      return (
                        <div
                          key={partId}
                          className="w-3.5 h-3.5 rounded-full border border-white/20"
                          style={{ backgroundColor: color }}
                          title={`${LOGICAL_PARTS[partId]?.name}: ${color}`}
                        />
                      );
                    })}
                    <span className="text-[10px] text-slate-400 font-mono ml-1">
                      +2 more zones
                    </span>
                  </div>

                  {/* Quantity & Delete Controls */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Qty:</span>
                      <div className="flex items-center bg-slate-900 border border-white/10 rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="p-1.5 text-slate-400 hover:text-white transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="p-1.5 text-slate-400 hover:text-white transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleEditItem(item)}
                        className="text-xs text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Edit in 3D</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => removeItem(item.cartItemId)}
                        className="text-xs text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary (Right Column) */}
          <div className="lg:col-span-4 p-6 rounded-2xl glass-panel border border-white/10 shadow-2xl space-y-6">
            <h2 className="text-base font-bold text-white pb-3 border-b border-white/10">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-mono text-slate-200">{formatINR(subtotal)}</span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  Estimated Delivery
                </span>
                <span className="font-mono text-emerald-400 font-semibold">FREE (Demo)</span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span>Estimated Taxes (GST 18% Incl.)</span>
                <span className="font-mono text-slate-400">{formatINR(estimatedTax)}</span>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                <div>
                  <span className="text-base font-bold text-white">Estimated Total</span>
                  <p className="text-[10px] text-slate-400">Demo currency calculation</p>
                </div>
                <span className="text-2xl font-bold font-mono text-amber-400">
                  {formatINR(grandTotal)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/20 active:scale-95 cursor-pointer text-sm"
            >
              <span>Proceed to Demo Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Demo Guarantee Badge */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-start gap-2.5 text-slate-400 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Demonstration checkout experience. No real payment methods, CVVs, or card credentials will be requested.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useRouter } from '../app/router';
import { storageService } from '../services/storageService';
import { formatINR } from '../config/pricing';
import {
  CheckCircle2,
  Package,
  Calendar,
  MapPin,
} from 'lucide-react';

export function OrderConfirmationPage() {
  const { params, navigate } = useRouter();
  const orderId = params.orderId;
  const order = storageService.getOrderById(orderId);

  // Trigger celebratory confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#ffffff', '#ea580c'],
      });
    } catch {
      // safe fallback if canvas is restricted
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center gap-8 text-center">
      {/* Celebration Icon */}
      <div className="relative flex items-center justify-center">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-2xl shadow-amber-500/20">
          <CheckCircle2 className="w-10 h-10 text-amber-400" />
        </div>
      </div>

      <div className="space-y-2 max-w-lg">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
          <span>SIMULATED ORDER CONFIRMED</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight">
          Your Bespoke Sneakers Are in Motion
        </h1>
        <p className="text-sm text-slate-400">
          Thank you for exploring SOLESTUDIO. Your simulated demo order has been logged into the studio ledger.
        </p>
      </div>

      {/* Order Reference Card */}
      <div className="w-full p-6 rounded-2xl glass-panel border border-white/10 text-left space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">
              Order Reference
            </span>
            <span className="text-lg font-mono font-bold text-amber-400">
              {order?.referenceNumber || `SOLE-2026-${orderId.slice(-5)}`}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {order ? new Date(order.createdAt).toLocaleDateString() : 'Today'}
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Package className="w-3.5 h-3.5" />
              Demo Production Queued
            </span>
          </div>
        </div>

        {/* Configured Items List */}
        {order && order.items && (
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
              Configured Silhouette ({order.items.length})
            </h3>
            <div className="divide-y divide-white/5">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    {item.thumbnailUrl && (
                      <img
                        src={item.thumbnailUrl}
                        alt={item.productName}
                        className="w-12 h-12 rounded-lg bg-slate-900 object-contain p-1 border border-white/5"
                      />
                    )}
                    <div>
                      <h4 className="text-white font-bold">{item.productName}</h4>
                      <p className="text-slate-400 text-[11px]">
                        Size: US {item.size} • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>

                  <span className="font-mono text-amber-400 font-bold">
                    {formatINR(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shipping summary */}
        {order?.shippingAddress && (
          <div className="pt-4 border-t border-white/5 flex items-start gap-3 text-xs text-slate-400">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-300 font-semibold block">Simulated Delivery Address:</span>
              <p>
                {order.shippingAddress.fullName} • {order.shippingAddress.addressLine1},{' '}
                {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                {order.shippingAddress.postalCode}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Return CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => navigate('/customize/solestudio-glide')}
          className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
        >
          <span>Customize Another Sneaker</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/designs')}
          className="px-6 py-3.5 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
        >
          View My Vault
        </button>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="px-6 py-3.5 bg-transparent hover:bg-slate-900 text-slate-400 hover:text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

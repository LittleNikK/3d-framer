import React, { useState } from 'react';
import { useRouter } from '../app/router';
import { useCartStore } from '../store/useCartStore';
import { storageService } from '../services/storageService';
import { formatINR } from '../config/pricing';
import type { DemoOrder, ShippingAddress } from '../types';
import {
  AlertCircle,
  CreditCard,
  QrCode,
  Truck,
  Loader2,
  Lock,
} from 'lucide-react';

export function CheckoutPage() {
  const { navigate } = useRouter();
  const items = useCartStore(state => state.items);
  const clearCart = useCartStore(state => state.clearCart);
  const getSubtotal = useCartStore(state => state.getSubtotal);

  const subtotal = getSubtotal();
  const shippingFee = 0;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shippingFee;

  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: 'Alex Vance',
    email: 'alex.vance@example.com',
    phone: '9876543210',
    addressLine1: 'Suite 404, Tech Park Boulevard',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560001',
    country: 'India',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});
  const [paymentMethod, setPaymentMethod] = useState<'demo-card' | 'demo-upi' | 'demo-cod'>('demo-upi');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingAddress, string>> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please provide a valid 10-digit mobile number';
    }

    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.postalCode.trim() || !/^\d{6}$/.test(formData.postalCode.trim())) {
      newErrors.postalCode = 'Please enter a valid 6-digit PIN code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    if (items.length === 0) {
      alert('Your cart is empty. Please add a customized sneaker first.');
      navigate('/');
      return;
    }

    setIsSubmitting(true);

    // Simulate realistic asynchronous order generation & confirmation
    setTimeout(() => {
      const randomRef = `SOLE-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const orderId = `ord_${Date.now()}`;

      const newOrder: DemoOrder = {
        orderId,
        referenceNumber: randomRef,
        items: [...items],
        shippingAddress: { ...formData },
        subtotal,
        shippingFee,
        tax,
        total,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        isDemo: true,
      };

      storageService.saveOrder(newOrder);
      clearCart();
      setIsSubmitting(false);
      navigate(`/order-confirmation/${orderId}`);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
      {/* Demo Notice Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-300">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
        <div className="space-y-0.5 text-xs">
          <h4 className="font-bold tracking-wide uppercase font-mono text-[11px]">
            Demonstration Mode Active
          </h4>
          <p className="text-amber-200/80 leading-relaxed">
            This is a simulated checkout workflow. No real currency will be charged, and no sensitive credit card numbers or banking passwords will ever be collected.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 flex flex-col gap-6">
          {/* Contact Details */}
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-mono text-xs flex items-center justify-center font-bold">
                1
              </span>
              <span>Contact Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full px-3.5 py-2.5 bg-slate-900/80 border rounded-xl text-xs text-white focus:outline-none transition-colors ${
                    errors.fullName ? 'border-rose-500' : 'border-white/10 focus:border-amber-500'
                  }`}
                />
                {errors.fullName && <p className="text-[10px] text-rose-400 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3.5 py-2.5 bg-slate-900/80 border rounded-xl text-xs text-white focus:outline-none transition-colors ${
                    errors.email ? 'border-rose-500' : 'border-white/10 focus:border-amber-500'
                  }`}
                />
                {errors.email && <p className="text-[10px] text-rose-400 mt-1">{errors.email}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Mobile Number (10 Digits)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-3.5 py-2.5 bg-slate-900/80 border rounded-xl text-xs text-white focus:outline-none transition-colors ${
                    errors.phone ? 'border-rose-500' : 'border-white/10 focus:border-amber-500'
                  }`}
                />
                {errors.phone && <p className="text-[10px] text-rose-400 mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-mono text-xs flex items-center justify-center font-bold">
                2
              </span>
              <span>Delivery Address</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={formData.addressLine1}
                  onChange={e => setFormData({ ...formData, addressLine1: e.target.value })}
                  className={`w-full px-3.5 py-2.5 bg-slate-900/80 border rounded-xl text-xs text-white focus:outline-none transition-colors ${
                    errors.addressLine1 ? 'border-rose-500' : 'border-white/10 focus:border-amber-500'
                  }`}
                />
                {errors.addressLine1 && (
                  <p className="text-[10px] text-rose-400 mt-1">{errors.addressLine1}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className={`w-full px-3.5 py-2.5 bg-slate-900/80 border rounded-xl text-xs text-white focus:outline-none transition-colors ${
                    errors.city ? 'border-rose-500' : 'border-white/10 focus:border-amber-500'
                  }`}
                />
                {errors.city && <p className="text-[10px] text-rose-400 mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={e => setFormData({ ...formData, state: e.target.value })}
                  className={`w-full px-3.5 py-2.5 bg-slate-900/80 border rounded-xl text-xs text-white focus:outline-none transition-colors ${
                    errors.state ? 'border-rose-500' : 'border-white/10 focus:border-amber-500'
                  }`}
                />
                {errors.state && <p className="text-[10px] text-rose-400 mt-1">{errors.state}</p>}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  PIN Code (6 digits)
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  maxLength={6}
                  onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                  className={`w-full px-3.5 py-2.5 bg-slate-900/80 border rounded-xl text-xs text-white focus:outline-none transition-colors ${
                    errors.postalCode ? 'border-rose-500' : 'border-white/10 focus:border-amber-500'
                  }`}
                />
                {errors.postalCode && (
                  <p className="text-[10px] text-rose-400 mt-1">{errors.postalCode}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  readOnly
                  value="India"
                  className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-white/5 rounded-xl text-xs text-slate-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method (Demo) */}
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-mono text-xs flex items-center justify-center font-bold">
                3
              </span>
              <span>Simulated Payment Gateway</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('demo-upi')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  paymentMethod === 'demo-upi'
                    ? 'bg-amber-500/15 border-amber-500/70 text-amber-300'
                    : 'bg-slate-900/50 border-white/5 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <QrCode className="w-5 h-5 mb-2 text-amber-400" />
                <h4 className="text-xs font-bold">Demo UPI / QR</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Instant simulated confirmation</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('demo-card')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  paymentMethod === 'demo-card'
                    ? 'bg-amber-500/15 border-amber-500/70 text-amber-300'
                    : 'bg-slate-900/50 border-white/5 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <CreditCard className="w-5 h-5 mb-2 text-amber-400" />
                <h4 className="text-xs font-bold">Sandbox Card</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Test card simulation</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('demo-cod')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  paymentMethod === 'demo-cod'
                    ? 'bg-amber-500/15 border-amber-500/70 text-amber-300'
                    : 'bg-slate-900/50 border-white/5 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Truck className="w-5 h-5 mb-2 text-amber-400" />
                <h4 className="text-xs font-bold">Pay on Delivery</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Demo simulated cash flow</p>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/20 active:scale-[0.99] cursor-pointer text-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Simulating Studio Order Creation...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 stroke-[2.5]" />
                <span>Place Demo Order • {formatINR(total)}</span>
              </>
            )}
          </button>
        </form>

        {/* Right Summary Column */}
        <div className="lg:col-span-4 p-6 rounded-2xl glass-panel border border-white/10 space-y-5">
          <h3 className="text-base font-bold text-white pb-3 border-b border-white/10">
            Order Review ({items.length} items)
          </h3>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {items.map(item => (
              <div key={item.cartItemId} className="flex items-center gap-3 text-xs">
                {item.thumbnailUrl ? (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.productName}
                    className="w-12 h-12 rounded-lg bg-slate-900 object-contain p-1 border border-white/5 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center shrink-0 border border-white/5">
                    <span className="font-mono text-xs text-amber-400">US {item.size}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-bold truncate">{item.productName}</h4>
                  <p className="text-[10px] text-slate-400">
                    Size: US {item.size} • Qty: {item.quantity}
                  </p>
                </div>
                <span className="font-mono text-amber-400 font-semibold shrink-0">
                  {formatINR(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span className="font-mono text-slate-200">{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Express Delivery</span>
              <span className="font-mono text-emerald-400 font-semibold">FREE (Demo)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Estimated GST (18%)</span>
              <span className="font-mono text-slate-400">{formatINR(tax)}</span>
            </div>
            <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
              <span className="text-base font-bold text-white">Total Amount</span>
              <span className="text-xl font-bold font-mono text-amber-400">{formatINR(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useRouter } from '../../app/router';
import { useCartStore } from '../../store/useCartStore';
import { useSavedDesignsStore } from '../../store/useSavedDesignsStore';
import { ShoppingBag, Menu, X, ArrowRight } from 'lucide-react';

export function Navbar() {
  const { route, navigate } = useRouter();
  const cartItemCount = useCartStore(state => state.getItemCount());
  const designsCount = useSavedDesignsStore(state => state.designs.length);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Explore', path: '/', active: route === 'home' },
    { label: 'Customizer', path: '/customize/solestudio-glide', active: route === 'customize' },
    {
      label: 'My Designs',
      path: '/designs',
      active: route === 'designs',
      badge: designsCount > 0 ? designsCount : undefined,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 bg-[#090a0f]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Wordmark */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 text-left group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <span className="font-display font-black text-slate-950 text-base tracking-tighter">
              S
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-lg tracking-wider text-white">
                SOLE<span className="text-amber-400">STUDIO</span>
              </span>
              <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold tracking-wider">
                3D
              </span>
            </div>
            <span className="text-[10px] text-slate-400 -mt-1 font-mono tracking-widest uppercase">
              Bespoke Lab
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <button
              key={link.path}
              type="button"
              onClick={() => navigate(link.path)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                link.active
                  ? 'bg-white/10 text-white shadow-inner'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{link.label}</span>
              {link.badge !== undefined && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {link.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Action Controls & Cart */}
        <div className="flex items-center gap-2.5">
          {/* Cart Button */}
          <button
            type="button"
            onClick={() => navigate('/cart')}
            className={`relative p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
              route === 'cart'
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-slate-900/60 hover:bg-slate-800 border-white/5 text-slate-300 hover:text-white'
            }`}
            title="View Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold font-mono flex items-center justify-center shadow-md animate-scaleIn">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Start Customizing CTA Button (when not on customize page) */}
          {route !== 'customize' && (
            <button
              type="button"
              onClick={() => navigate('/customize/solestudio-glide')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
            >
              <span>Launch Studio</span>
            </button>
          )}

          {/* Mobile Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#0e1017] px-4 pt-3 pb-6 flex flex-col gap-2">
          {navLinks.map(link => (
            <button
              key={link.path}
              type="button"
              onClick={() => {
                navigate(link.path);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between ${
                link.active ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'text-slate-300'
              }`}
            >
              <span>{link.label}</span>
              {link.badge !== undefined && (
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-amber-500/20 text-amber-300">
                  {link.badge}
                </span>
              )}
            </button>
          ))}

          <button
            type="button"
            onClick={() => {
              navigate('/customize/solestudio-glide');
              setMobileMenuOpen(false);
            }}
            className="w-full mt-2 py-3 bg-amber-500 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2"
          >
            <span>Launch 3D Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
}

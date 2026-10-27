import { useRouter } from '../../app/router';
import { Box, ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  const { navigate } = useRouter();

  return (
    <footer className="w-full border-t border-white/5 bg-[#07080b] text-slate-400 text-xs py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
        {/* Brand Info */}
        <div className="max-w-sm space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500 flex items-center justify-center font-black text-slate-950 text-xs">
              S
            </div>
            <span className="font-display font-black text-white text-base tracking-wider">
              SOLE<span className="text-amber-400">STUDIO</span>
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed text-xs">
            Next-generation 3D footwear customization platform. Experience photorealistic WebGL rendering, tactile PBR material shaders, and real-time bespoke tailoring.
          </p>
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Offline Draco Engine Active
            </span>
            <span>•</span>
            <span>v1.0.0 Production</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
          <div>
            <h4 className="font-mono uppercase text-slate-300 font-semibold mb-3 tracking-wider text-[11px]">
              Studio
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Explore Collection
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/customize/solestudio-glide')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Customizer Studio
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/designs')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Saved Vault
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Shopping Bag
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono uppercase text-slate-300 font-semibold mb-3 tracking-wider text-[11px]">
              Technology
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-1.5">
                <Box className="w-3 h-3 text-amber-400" />
                Three.js & R3F
              </li>
              <li>Physically Based Rendering</li>
              <li>Draco Mesh Geometry</li>
              <li>Deterministic Pricing</li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h4 className="font-mono uppercase text-slate-300 font-semibold mb-3 tracking-wider text-[11px]">
              Demonstration Notice
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              This interactive application is built for demonstration purposes. Simulated orders, demo pricing, and customized sneakers are virtual creations.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
        <div>© 2026 SOLESTUDIO — All rights reserved.</div>
        <div className="flex items-center gap-1 text-slate-400">
          Crafted with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for footwear enthusiasts
        </div>
      </div>
    </footer>
  );
}

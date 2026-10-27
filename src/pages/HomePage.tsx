import { useRef } from 'react';
import { useRouter } from '../app/router';
import { PRODUCTS } from '../config/products';
import { formatINR } from '../config/pricing';
import { SneakerCanvas, type SneakerCanvasHandle } from '../components/canvas/SneakerCanvas';
import { ArrowRight, Compass } from 'lucide-react';

export function HomePage() {
  const { navigate } = useRouter();
  const canvasRef = useRef<SneakerCanvasHandle>(null);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 overflow-hidden">
        {/* Subtle radial lighting glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute -top-32 left-10 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Text Column */}
          <div className="lg:col-span-5 flex flex-col gap-6 text-left">

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white leading-[1.08]">
                YOUR VISION. <br />
                <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                  YOUR SNEAKER.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-lg font-light">
                Tailor every contour in photorealistic WebGL. Fine-tune Italian suede, full-grain leather, and bold accents with real-time tactile PBR materials.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/customize/solestudio-glide')}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold rounded-xl flex items-center gap-2.5 transition-all shadow-xl shadow-amber-500/20 active:scale-95 cursor-pointer text-sm"
              >
                <span>Start Customizing</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/designs')}
                className="px-6 py-3.5 bg-slate-900/60 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 rounded-xl font-semibold transition-colors cursor-pointer text-sm"
              >
                Saved Vault
              </button>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5 text-xs">
              <div className="space-y-0.5">
                <span className="font-mono font-bold text-white text-base">8 Zones</span>
                <p className="text-slate-400 text-[11px]">Independent parts</p>
              </div>
              <div className="space-y-0.5">
                <span className="font-mono font-bold text-white text-base">6 Shaders</span>
                <p className="text-slate-400 text-[11px]">Tactile PBR presets</p>
              </div>
              <div className="space-y-0.5">
                <span className="font-mono font-bold text-white text-base">360° Studio</span>
                <p className="text-slate-400 text-[11px]">Full camera orbit</p>
              </div>
            </div>
          </div>

          {/* Right 3D Viewport Column */}
          <div className="lg:col-span-7 h-[420px] sm:h-[500px] lg:h-[580px] rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl relative group">
            <SneakerCanvas ref={canvasRef} modelPath="/models/sneaker-pro.glb" interactive={true} />

            {/* Interactive hint badge */}
            <div className="absolute top-4 right-4 z-20 pointer-events-none px-3 py-1.5 rounded-xl glass-panel border border-white/10 text-xs font-mono text-slate-300 flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>Drag to orbit • Click parts to pick</span>
            </div>

            {/* Bottom floating bar */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between p-3 rounded-2xl glass-panel border border-white/10 backdrop-blur-xl">
              <div>
                <h4 className="text-xs font-bold text-white">SoleStudio Glide Pro</h4>
                <p className="text-[11px] text-slate-400 font-mono">Flagship Silhouette</p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/customize/solestudio-glide')}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Customize in 3D</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Silhouettes Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-white/5">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
              Bespoke Lineup
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mt-1">
              Select Your Canvas
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md font-light">
            Each silhouette has been crafted with precision topology, allowing seamless multi-zone material swapping in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRODUCTS.map(product => (
            <div
              key={product.id}
              className="p-6 rounded-2xl glass-panel border border-white/5 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between group hover:shadow-xl hover:shadow-amber-500/5"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    {product.subtitle}
                  </span>
                  {product.badge && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {product.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                  {product.name}
                </h3>

                <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">
                    Starting At
                  </span>
                  <span className="text-lg font-bold font-mono text-white">
                    {formatINR(product.basePrice)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/customize/${product.id}`)}
                  className="px-4 py-2 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-200 border border-white/10 hover:border-transparent rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Customize</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customization Process Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">
            From Digital Canvas to Reality
          </h2>
          <p className="text-sm text-slate-400">
            A frictionless, interactive customization process designed to give you creative freedom.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold text-lg">
              01
            </div>
            <h3 className="text-lg font-bold text-white">Select Product Silhouette</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Choose from high-performance athletic runners, minimalist court high-tops, or vintage low-profile trainers.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold text-lg">
              02
            </div>
            <h3 className="text-lg font-bold text-white">Bespoke 3D Tailoring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Click any sneaker part directly in 3D to apply Italian suede, full-grain leather, rubber outsoles, and curated color palettes.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold text-lg">
              03
            </div>
            <h3 className="text-lg font-bold text-white">Save, Share & Order</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Archive your creation into your private vault, generate an instant reproducible link, or add to your shopping bag for checkout.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

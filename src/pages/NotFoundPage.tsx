import { useRouter } from '../app/router';
import { Compass, ArrowRight } from 'lucide-react';

export function NotFoundPage() {
  const { navigate } = useRouter();

  return (
    <div className="max-w-md mx-auto w-full px-4 py-24 flex flex-col items-center justify-center text-center gap-5">
      <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
        <Compass className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl font-black font-display text-white">404 — Route Not Found</h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          The requested studio page does not exist or has moved. Return to the main catalog or customizer.
        </p>
      </div>

      <button
        type="button"
        onClick={() => navigate('/')}
        className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
      >
        <span>Return to Studio Home</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

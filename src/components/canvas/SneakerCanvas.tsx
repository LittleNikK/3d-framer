import React, { Suspense, forwardRef, useImperativeHandle, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { LightingRig } from './LightingRig';
import { SneakerModel } from './SneakerModel';
import { FallbackSneakerModel } from './FallbackSneakerModel';
import { CameraRig } from './CameraRig';
import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import { Loader2, AlertCircle } from 'lucide-react';

export interface SneakerCanvasHandle {
  captureScreenshot: () => string | null;
}

interface SneakerCanvasProps {
  modelPath?: string;
  className?: string;
  interactive?: boolean;
}

// Error boundary for 3D model loading
class ModelErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode; onError?: (error: any) => void },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn('3D Model failed to load, switching to procedural fallback:', error);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function CanvasLoadingIndicator() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20 pointer-events-none">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
        <Loader2 className="w-6 h-6 text-amber-400 absolute animate-pulse" />
      </div>
      <p className="mt-4 text-xs font-mono tracking-widest text-slate-300 uppercase">
        Initializing 3D Canvas
      </p>
    </div>
  );
}

export const SneakerCanvas = forwardRef<SneakerCanvasHandle, SneakerCanvasProps>(
  ({ modelPath = '/models/sneaker-pro.glb', className = '', interactive = true }, ref) => {
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const cameraPreset = useConfiguratorStore(state => state.cameraPreset);
    const autoRotate = useConfiguratorStore(state => state.autoRotate);
    const modelStatus = useConfiguratorStore(state => state.modelStatus);
    const setModelStatus = useConfiguratorStore(state => state.setModelStatus);

    // Provide screenshot capture capability via ref
    useImperativeHandle(ref, () => ({
      captureScreenshot: () => {
        try {
          const canvas = canvasContainerRef.current?.querySelector('canvas');
          if (!canvas) return null;
          return canvas.toDataURL('image/png', 0.95);
        } catch (e) {
          console.error('Failed to export canvas screenshot:', e);
          return null;
        }
      },
    }));

    return (
      <div
        ref={canvasContainerRef}
        className={`relative w-full h-full select-none studio-canvas-bg overflow-hidden ${className}`}
      >
        {/* Subtle radial studio gradient background */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/40 via-[#0b0c10] to-[#060709]" />

        {/* Ambient floor glow effect */}
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-3/4 h-48 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />

        <Suspense fallback={<CanvasLoadingIndicator />}>
          <Canvas
            shadows
            dpr={[1, 2]}
            gl={{
              preserveDrawingBuffer: true,
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
            }}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          >
            <PerspectiveCamera makeDefault position={[2.5, 1.3, 3.2]} fov={45} />

            <CameraRig preset={cameraPreset} autoRotate={autoRotate} />

            <LightingRig />

            <ModelErrorBoundary
              fallback={<FallbackSneakerModel />}
              onError={() => setModelStatus('fallback')}
            >
              {modelStatus === 'fallback' ? (
                <FallbackSneakerModel />
              ) : (
                <SneakerModel modelPath={modelPath} />
              )}
            </ModelErrorBoundary>

            {interactive && (
              <OrbitControls
                makeDefault
                enablePan={false}
                minDistance={2.2}
                maxDistance={7.0}
                maxPolarAngle={Math.PI / 2 + 0.05}
                minPolarAngle={0.1}
                dampingFactor={0.05}
                enableDamping
                autoRotate={autoRotate}
                autoRotateSpeed={2.5}
              />
            )}
          </Canvas>
        </Suspense>

        {/* Fallback notification indicator if model asset falls back */}
        {modelStatus === 'fallback' && (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Procedural Fallback Mode Active</span>
          </div>
        )}
      </div>
    );
  }
);

SneakerCanvas.displayName = 'SneakerCanvas';

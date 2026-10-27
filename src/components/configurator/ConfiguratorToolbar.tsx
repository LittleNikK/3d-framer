import { useState } from 'react';
import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import { useToastStore } from '../../store/useToastStore';
import type { CameraPreset } from '../../types';
import {
  RotateCcw,
  RotateCw,
  RefreshCw,
  Camera,
  Compass,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Terminal,
} from 'lucide-react';

interface ConfiguratorToolbarProps {
  onCaptureScreenshot: () => void;
  onOpenInspector: () => void;
}

export function ConfiguratorToolbar({
  onCaptureScreenshot,
  onOpenInspector,
}: ConfiguratorToolbarProps) {
  const cameraPreset = useConfiguratorStore(state => state.cameraPreset);
  const setCameraPreset = useConfiguratorStore(state => state.setCameraPreset);
  const autoRotate = useConfiguratorStore(state => state.autoRotate);
  const toggleAutoRotate = useConfiguratorStore(state => state.toggleAutoRotate);
  const undo = useConfiguratorStore(state => state.undo);
  const redo = useConfiguratorStore(state => state.redo);
  const canUndo = useConfiguratorStore(state => state.canUndo());
  const canRedo = useConfiguratorStore(state => state.canRedo());
  const resetConfiguration = useConfiguratorStore(state => state.resetConfiguration);

  const addToast = useToastStore(state => state.addToast);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const cameraPresets: { id: CameraPreset; label: string }[] = [
    { id: 'threeQuarter', label: '3/4 View' },
    { id: 'front', label: 'Front' },
    { id: 'side', label: 'Side' },
    { id: 'rear', label: 'Heel' },
    { id: 'top', label: 'Top' },
  ];

  const handleReset = () => {
    if (window.confirm('Reset all customized sneaker parts to default factory specifications?')) {
      resetConfiguration();
      addToast({
        type: 'info',
        title: 'Configuration Reset',
        description: 'Restored original sneaker silhouette and materials.',
      });
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl glass-panel border-white/10 shadow-2xl">
      {/* Camera Presets */}
      <div className="flex items-center gap-1 overflow-x-auto">
        <span className="text-[10px] font-mono text-slate-400 uppercase px-2 hidden sm:inline flex items-center gap-1">
          <Compass className="w-3 h-3 text-amber-400" />
          Camera
        </span>
        {cameraPresets.map(preset => {
          const isActive = cameraPreset === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => setCameraPreset(preset.id)}
              className={`px-2.5 py-1 text-xs rounded-lg transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-medium'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-1 ml-auto">
        {/* Auto Rotate Toggle */}
        <button
          type="button"
          onClick={toggleAutoRotate}
          title={autoRotate ? 'Pause 360° rotation' : 'Enable 360° studio rotation'}
          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
            autoRotate
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
              : 'text-slate-400 hover:text-white border-transparent hover:bg-slate-800/60'
          }`}
        >
          {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <div className="w-[1px] h-4 bg-white/10 mx-0.5" />

        {/* Undo */}
        <button
          type="button"
          onClick={undo}
          disabled={!canUndo}
          title="Undo last change (Ctrl+Z)"
          className={`p-1.5 rounded-lg transition-all cursor-pointer ${
            canUndo
              ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              : 'text-slate-600 cursor-not-allowed'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Redo */}
        <button
          type="button"
          onClick={redo}
          disabled={!canRedo}
          title="Redo change (Ctrl+Y)"
          className={`p-1.5 rounded-lg transition-all cursor-pointer ${
            canRedo
              ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              : 'text-slate-600 cursor-not-allowed'
          }`}
        >
          <RotateCw className="w-4 h-4" />
        </button>

        {/* Reset */}
        <button
          type="button"
          onClick={handleReset}
          title="Reset sneaker to original"
          className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800/60 rounded-lg transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-white/10 mx-0.5" />

        {/* Capture Snapshot */}
        <button
          type="button"
          onClick={onCaptureScreenshot}
          title="Export high-res PNG studio preview"
          className="p-1.5 text-slate-300 hover:text-amber-300 hover:bg-slate-800/60 rounded-lg transition-all cursor-pointer"
        >
          <Camera className="w-4 h-4" />
        </button>

        {/* Model Inspector */}
        <button
          type="button"
          onClick={onOpenInspector}
          title="Inspect 3D Meshes & Materials Report"
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-all cursor-pointer"
        >
          <Terminal className="w-4 h-4" />
        </button>

        {/* Fullscreen */}
        <button
          type="button"
          onClick={handleToggleFullscreen}
          title="Toggle studio fullscreen"
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-all cursor-pointer hidden md:inline-flex"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

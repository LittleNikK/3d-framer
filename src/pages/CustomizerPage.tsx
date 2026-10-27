import { useEffect, useRef, useState } from 'react';
import { useRouter } from '../app/router';
import { useConfiguratorStore } from '../store/useConfiguratorStore';
import { useToastStore } from '../store/useToastStore';
import { shareService } from '../services/shareService';
import { getProductById } from '../config/products';
import { SneakerCanvas, type SneakerCanvasHandle } from '../components/canvas/SneakerCanvas';
import { ConfiguratorToolbar } from '../components/configurator/ConfiguratorToolbar';
import { PartSelector } from '../components/configurator/PartSelector';
import { ColorPicker } from '../components/configurator/ColorPicker';
import { MaterialSelector } from '../components/configurator/MaterialSelector';
import { SizeSelector } from '../components/configurator/SizeSelector';
import { PriceSummary } from '../components/configurator/PriceSummary';
import { SaveDesignModal } from '../components/configurator/SaveDesignModal';
import { ShareModal } from '../components/configurator/ShareModal';
import { ModelInspectorModal } from '../components/configurator/ModelInspectorModal';
import { SlidersHorizontal, ChevronRight, X } from 'lucide-react';

export function CustomizerPage() {
  const { params, searchParams } = useRouter();
  const productIdFromRoute = params.productId || 'solestudio-glide';

  const productId = useConfiguratorStore(state => state.productId);
  const setProductId = useConfiguratorStore(state => state.setProductId);
  const loadConfiguration = useConfiguratorStore(state => state.loadConfiguration);
  const undo = useConfiguratorStore(state => state.undo);
  const redo = useConfiguratorStore(state => state.redo);
  const toggleAutoRotate = useConfiguratorStore(state => state.toggleAutoRotate);

  const addToast = useToastStore(state => state.addToast);

  const canvasRef = useRef<SneakerCanvasHandle>(null);

  // Modals
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [inspectorModalOpen, setInspectorModalOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Synchronize product ID from route on mount
  useEffect(() => {
    if (productIdFromRoute && productIdFromRoute !== productId) {
      setProductId(productIdFromRoute);
    }
  }, [productIdFromRoute, productId, setProductId]);

  // Decode and load configuration from URL query param if present
  useEffect(() => {
    const encodedConfig = searchParams.get('config');
    if (encodedConfig) {
      const decoded = shareService.decodeConfiguration(encodedConfig);
      if (decoded.configuration) {
        loadConfiguration(decoded.configuration, decoded.size, decoded.productId);
        addToast({
          type: 'success',
          title: 'Shared Design Imported',
          description: 'Restored the customized sneaker configuration from your link.',
        });
      } else if (decoded.error) {
        addToast({
          type: 'error',
          title: 'Import Warning',
          description: decoded.error,
        });
      }
    }
  }, [searchParams, loadConfiguration, addToast]);

  // Keyboard shortcuts (Undo, Redo, Rotate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return; // Ignore if user is typing in a form input
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      } else if (e.key === ' ') {
        e.preventDefault();
        toggleAutoRotate();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, toggleAutoRotate]);

  const product = getProductById(productId);

  // Screenshot export function
  const handleExportScreenshot = () => {
    const dataUrl = canvasRef.current?.captureScreenshot();
    if (!dataUrl) {
      addToast({
        type: 'error',
        title: 'Capture Failed',
        description: 'Unable to capture WebGL canvas preview.',
      });
      return;
    }

    // Trigger immediate PNG download
    const link = document.createElement('a');
    link.download = `solestudio-${productId}-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();

    addToast({
      type: 'success',
      title: 'Studio Snapshot Exported',
      description: 'High-resolution PNG downloaded to your device.',
    });
  };

  const getScreenshotUrl = () => {
    return canvasRef.current?.captureScreenshot() || null;
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col lg:flex-row overflow-hidden bg-[#090a0f]">
      {/* 3D Viewport Column */}
      <div className="relative flex-1 h-[55vh] lg:h-full w-full overflow-hidden">
        <SneakerCanvas
          ref={canvasRef}
          modelPath={product.modelPath}
          className="w-full h-full"
          interactive={true}
        />

        {/* Floating Top Toolbar */}
        <div className="absolute top-4 left-4 right-4 z-20 pointer-events-none">
          <div className="pointer-events-auto max-w-2xl">
            <ConfiguratorToolbar
              onCaptureScreenshot={handleExportScreenshot}
              onOpenInspector={() => setInspectorModalOpen(true)}
            />
          </div>
        </div>

        {/* Mobile Customizer Drawer Toggle Button */}
        <div className="lg:hidden absolute bottom-4 left-4 right-4 z-20">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="w-full py-3 px-4 bg-amber-500 text-slate-950 font-bold rounded-2xl flex items-center justify-between shadow-2xl shadow-amber-500/30"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Customize Colors & Materials</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right Customization Control Panel (Desktop & Tablet) */}
      <aside
        className={`fixed inset-y-0 right-0 z-30 w-full sm:w-[420px] lg:static lg:h-full lg:w-[430px] glass-panel border-l border-white/10 flex flex-col bg-[#0d0f15]/95 backdrop-blur-2xl transition-transform duration-300 ${
          mobileDrawerOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Drawer Close Header */}
        <div className="lg:hidden p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Customization Studio</h3>
          </div>
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Customization Controls */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Part Selection */}
          <PartSelector />

          {/* Color Picker for Selected Part */}
          <div className="pt-4 border-t border-white/5">
            <ColorPicker />
          </div>

          {/* Material Presets for Selected Part */}
          <div className="pt-4 border-t border-white/5">
            <MaterialSelector />
          </div>

          {/* Shoe Size Selection */}
          <div className="pt-4 border-t border-white/5">
            <SizeSelector />
          </div>

          {/* Price Breakdown & CTAs */}
          <div className="pt-2">
            <PriceSummary
              onOpenSaveModal={() => setSaveModalOpen(true)}
              onOpenShareModal={() => setShareModalOpen(true)}
              getScreenshotUrl={getScreenshotUrl}
            />
          </div>
        </div>
      </aside>

      {/* Modals */}
      <SaveDesignModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        getScreenshotUrl={getScreenshotUrl}
      />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />

      <ModelInspectorModal
        isOpen={inspectorModalOpen}
        onClose={() => setInspectorModalOpen(false)}
      />
    </div>
  );
}

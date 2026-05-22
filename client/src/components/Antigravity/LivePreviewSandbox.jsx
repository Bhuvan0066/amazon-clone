import { useEditorStore } from '../../store/editorStore';
import { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

export function LivePreviewSandbox() {
  const { productForm, deviceMode } = useEditorStore();
  const [zoomLevel, setZoomLevel] = useState(1);

  const deviceWidths = { mobile: '375px', tablet: '768px', desktop: '100%' };
  const formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(productForm?.price || 0);

  return (
    <div className="w-full h-full bg-slate-200 flex flex-col relative overflow-hidden">
      
      {/* Zoom Controls Overlay */}
      <div className="absolute top-4 right-4 z-10 flex gap-1 bg-white shadow-md rounded-md border border-slate-200 p-1">
        <button onClick={() => setZoomLevel(Math.max(0.25, zoomLevel - 0.25))} className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition-colors" title="Zoom Out">
          <ZoomOut size={16} />
        </button>
        <div className="px-2 flex items-center text-xs font-bold text-slate-700 min-w-[3.5rem] justify-center">
          {Math.round(zoomLevel * 100)}%
        </div>
        <button onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.25))} className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition-colors" title="Zoom In">
          <ZoomIn size={16} />
        </button>
        <div className="w-px h-5 bg-slate-200 mx-1 self-center"></div>
        <button onClick={() => setZoomLevel(1)} className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition-colors" title="Reset Zoom">
          <Maximize size={16} />
        </button>
      </div>

      {/* Preview Canvas */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-8 custom-scrollbar">
        {/* Scale Wrapper */}
        <div style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s', transformOrigin: 'center' }}>
          
          <div 
            className="bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col"
            style={{ 
              width: deviceWidths[deviceMode], 
              height: deviceMode === 'desktop' ? '100%' : '812px',
              minHeight: '600px',
              maxHeight: '812px'
            }}
          >
            <div className="bg-slate-100 border-b border-slate-200 p-2 text-center text-xs font-medium text-slate-500 uppercase tracking-wider shrink-0">
              Product Preview ({deviceMode})
            </div>
            
            <div className="p-6 flex flex-col flex-1 overflow-y-auto custom-scrollbar">
              {productForm.badges && (
                <span className="bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-sm w-max mb-4">
                  {productForm.badges.split(',')[0]}
                </span>
              )}
              
              <div className="h-48 w-full shrink-0 flex justify-center items-center mb-6 bg-slate-50 rounded-xl overflow-hidden p-2">
                {productForm.image ? (
                  <img src={productForm.image} alt={productForm.title} className="max-h-full object-contain mix-blend-multiply" />
                ) : (
                  <span className="text-slate-400 text-sm">No Image</span>
                )}
              </div>

              <span className="text-xs font-semibold text-slate-400 uppercase mb-1">{productForm.category}</span>
              <h2 className="text-lg font-bold text-slate-800 mb-2 leading-tight">
                {productForm.title || 'Product Title...'}
              </h2>
              
              <div className="text-2xl font-bold text-slate-900 mb-4 shrink-0">{formattedPrice}</div>
              
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                {productForm.description || 'Product description goes here...'}
              </p>

              <div className="mt-auto pt-6 flex gap-3 shrink-0">
                <button className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold py-2.5 rounded-full text-sm transition-colors">
                  Add to Cart
                </button>
                <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-full text-sm transition-colors">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

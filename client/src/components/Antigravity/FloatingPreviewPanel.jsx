import { Rnd } from 'react-rnd';
import { Terminal, X, Minimize2, Maximize2 } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { LivePreviewSandbox } from './LivePreviewSandbox';
import { AssistantPanel } from './AssistantPanel';
import { useState } from 'react';

export function FloatingPreviewPanel() {
  const { isOpen, togglePanel } = useEditorStore();
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <Rnd
        default={{
          x: Math.max(0, window.innerWidth - 850),
          y: Math.max(0, Math.min(50, window.innerHeight - 600)),
          width: Math.min(850, window.innerWidth),
          height: Math.min(600, window.innerHeight),
        }}
        minWidth={300}
        minHeight={200}
        bounds="window"
        dragHandleClassName="ag-drag-handle"
        className="pointer-events-auto w-full h-full flex flex-col shadow-2xl rounded-xl overflow-hidden border border-slate-700 bg-slate-900"
      >
        {/* Header */}
        <div className="ag-drag-handle cursor-move bg-slate-950 px-4 py-2 flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm tracking-wide">
            <Terminal size={16} className="text-blue-500" />
            Product Cart
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded">
              {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
            </button>
            <button onClick={togglePanel} className="p-1 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        {!isMinimized && (
          <div className="flex-1 flex overflow-hidden min-h-0">
            <div className="flex-1 h-full min-w-0">
              <LivePreviewSandbox />
            </div>
            <AssistantPanel />
          </div>
        )}
      </Rnd>
    </div>
  );
}



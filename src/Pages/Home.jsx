import React, { useState } from 'react';
import { analyzeCanvas } from '../services/gemini';
import useCanvas from '../hooks/useCanvas';

import Canvas from '../Components/Canvas';
import Header from '../Components/Header';
import ControlPanel from '../Components/ControlPanel';
import CursorPreview from '../Components/CursorPreview';
import Toast from '../Components/Toast';

const COLOR_PRESETS = [
  { name: 'Forest Green', value: '#286149ff', class: 'bg-[#1b4332] border-[#2d6a4f]' },
  { name: 'Emerald Green', value: '#2d6a4f', class: 'bg-[#2d6a4f] border-[#40916c]' },
  { name: 'Mint Green', value: '#52b788', class: 'bg-[#52b788] border-[#74c69d]' },
  { name: 'Deep Teal', value: '#0f766e', class: 'bg-teal-700 border-teal-600' },
  { name: 'Deep Charcoal', value: '#0f172a', class: 'bg-slate-900 border-slate-700' },
  { name: 'Warm Mahogany', value: '#78350f', class: 'bg-amber-900 border-amber-800' },
  { name: 'Crimson Red', value: '#b91c1c', class: 'bg-red-700 border-red-600' },
  { name: 'Indigo Blue', value: '#1e3a8a', class: 'bg-blue-900 border-blue-800' },
  { name: 'Plum Purple', value: '#6d28d9', class: 'bg-purple-700 border-purple-600' },
  { name: 'Earthy Ochre', value: '#b45309', class: 'bg-amber-700 border-amber-600' },
  { name: 'Soft Sage', value: '#5c6f68', class: 'bg-[#5c6f68] border-[#70847b]' },
  { name: 'Dark Maroon', value: '#881337', class: 'bg-rose-900 border-rose-800' }
];

export default function Home() {
  const canvas = useCanvas();
  const [toast, setToast] = useState({ show: false, text: '', type: '', isLoading: false, error: null });
  const [gridType, setGridType] = useState('none'); // 'none' | 'ruled' | 'dot'

  const handleAISolve = async (type) => {
    setToast({ show: true, text: '', type, isLoading: true, error: null });

    try {
      const text = await analyzeCanvas(type, canvas.getCanvasImageBase64());
      setToast({ show: true, text, type, isLoading: false, error: null });
      canvas.handleClear();
    } catch (err) {
      console.error("Actual Gemini API Error:", err);
      setToast({ show: true, text: '', type, isLoading: false, error: err.message });
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0d1117] select-none">
      <Header />

      {/* Grid background layer */}
      <div className={`absolute inset-0 pointer-events-none z-0 transition-all duration-300 ${gridType === 'ruled' ? 'canvas-grid-ruled' : gridType === 'dot' ? 'canvas-grid-dot' : ''
        }`} />

      <Canvas
        canvasRef={canvas.canvasRef}
        onMouseDown={canvas.startDrawing}
        onMouseMove={canvas.draw}
        onMouseUp={canvas.stopDrawing}
        onMouseLeave={() => { canvas.stopDrawing(); canvas.setIsHoveringCanvas(false); }}
        onMouseEnter={() => canvas.setIsHoveringCanvas(true)}
        onTouchStart={canvas.startDrawing}
        onTouchMove={canvas.draw}
        onTouchEnd={canvas.stopDrawing}
      />

      {canvas.isHoveringCanvas && (
        <CursorPreview cursorPos={canvas.cursorPos} mode={canvas.mode} color={canvas.color} lineWidth={canvas.lineWidth} />
      )}

      <ControlPanel
        mode={canvas.mode} setMode={canvas.setMode}
        lineWidth={canvas.lineWidth} setLineWidth={canvas.setLineWidth}
        color={canvas.color} setColor={canvas.setColor}
        onUndo={canvas.handleUndo} onRedo={canvas.handleRedo} onClear={canvas.handleClear}
        undoDisabled={canvas.undoDisabled} redoDisabled={canvas.redoDisabled}
        onAISolve={handleAISolve} colorPresets={COLOR_PRESETS}
        gridType={gridType}
        onToggleGrid={() => {
          setGridType(prev => {
            if (prev === 'none') return 'ruled';
            if (prev === 'ruled') return 'dot';
            return 'none';
          });
        }}
      />

      <Toast
        show={toast.show} text={toast.text} type={toast.type}
        isLoading={toast.isLoading} error={toast.error}
        onClose={() => setToast(t => ({ ...t, show: false }))}
      />
    </div>
  );
}

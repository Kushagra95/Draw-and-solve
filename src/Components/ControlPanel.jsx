import React, { useState, useEffect, useRef } from 'react';
import {
  Pen,
  Eraser,
  Undo2,
  Redo2,
  Trash2,
  BrainCircuit,
  Sparkles,
  ChevronUp,
  Grid3X3
} from 'lucide-react';

export default function ControlPanel({
  mode,
  setMode,
  lineWidth,
  setLineWidth,
  color,
  setColor,
  onUndo,
  onRedo,
  onClear,
  undoDisabled,
  redoDisabled,
  onAISolve,
  colorPresets,
  gridType,
  onToggleGrid
}) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setShowColorPicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-30 w-[96%] max-w-[840px] pointer-events-none">
      <div className="glass-panel w-full px-3 md:pl-4 md:pr-6 py-3 md:py-4 rounded-[1.5rem] md:rounded-3xl flex flex-col md:flex-row gap-3 md:gap-4 items-center justify-between shadow-2xl pointer-events-auto">

        {/* Group 1: Tools selection */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('pen')}
            className={`p-2.5 rounded-xl transition-all cursor-pointer ${mode === 'pen'
                ? 'bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                : 'text-white/50 hover:text-white/80 hover:bg-white/10'
              }`}
            title="Pen Tool"
          >
            <Pen className="w-5 h-5" />
          </button>

          <button
            onClick={() => setMode('eraser')}
            className={`p-2.5 rounded-xl transition-all cursor-pointer ${mode === 'eraser'
                ? 'bg-purple-500/20 text-purple-400 shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/30'
                : 'text-white/50 hover:text-white/80 hover:bg-white/10'
              }`}
            title="Eraser Tool"
          >
            <Eraser className="w-5 h-5" />
          </button>

          <button
            onClick={onToggleGrid}
            className={`p-2.5 rounded-xl transition-all cursor-pointer ${gridType !== 'none'
                ? 'bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                : 'text-white/50 hover:text-white/80 hover:bg-white/10'
              }`}
            title={`Toggle Grid (Current: ${gridType})`}
          >
            <Grid3X3 className="w-5 h-5" />
          </button>

          <div className="h-6 w-px bg-white/10 mx-1"></div>

          <button
            onClick={onUndo}
            disabled={undoDisabled}
            className={`p-2.5 rounded-xl transition-all cursor-pointer ${undoDisabled
                ? 'text-white/20 cursor-not-allowed opacity-50'
                : 'text-white/50 hover:text-white/80 hover:bg-white/10'
              }`}
            title="Undo Stroke"
          >
            <Undo2 className="w-5 h-5" />
          </button>

          <button
            onClick={onRedo}
            disabled={redoDisabled}
            className={`p-2.5 rounded-xl transition-all cursor-pointer ${redoDisabled
                ? 'text-white/20 cursor-not-allowed opacity-50'
                : 'text-white/50 hover:text-white/80 hover:bg-white/10'
              }`}
            title="Redo Stroke"
          >
            <Redo2 className="w-5 h-5" />
          </button>

          <button
            onClick={onClear}
            className="p-2.5 rounded-xl text-white/50 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
            title="Clear Notebook Canvas"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Group 2: Color Picker and brush stroke size */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">

          {/* Stroke Width Slider */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 w-[146px] flex-shrink-0">
            <span className="text-[10px] font-bold text-white/40">SIZE</span>
            <input
              type="range"
              min="2"
              max="24"
              value={lineWidth}
              onChange={(e) => setLineWidth(parseInt(e.target.value))}
              className="w-16 h-1 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] font-mono text-emerald-400 font-bold w-7 text-right flex-shrink-0">{lineWidth}px</span>
          </div>

          {/* Color Picker Popover */}
          {mode === 'pen' && (
            <div className="relative" ref={colorPickerRef}>
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="px-2 py-1 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer"
                title="Choose Color"
              >
                <div className="flex flex-col items-center justify-center w-7 h-7">
                  <ChevronUp className="w-3.5 h-3.5 text-white/40 -mb-0.5" />
                  <span className="text-sm font-bold text-white/80 leading-none">A</span>
                  <div
                    className="w-4.5 h-[3px] mt-0.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                </div>
              </button>

              {showColorPicker && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 glass-panel p-3 rounded-2xl shadow-2xl animate-slide-down flex flex-col gap-2 min-w-[180px] pointer-events-auto">
                  <div className="text-[9px] font-bold text-white/40 uppercase tracking-wider mb-0.5 text-center">Select Color</div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {colorPresets.map((preset) => (
                      <button
                        key={preset.value}
                        onClick={() => {
                          setColor(preset.value);
                          setShowColorPicker(false);
                        }}
                        className={`w-7 h-7 rounded-lg cursor-pointer transition-all hover:scale-115 border ${preset.class} ${color === preset.value ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-[#0d1117] scale-105' : 'opacity-90'
                          }`}
                        title={preset.name}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Group 3: AI commands */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => onAISolve('solve')}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600/80 hover:bg-emerald-500/80 shadow-md shadow-emerald-600/10 active:scale-95 transition-all cursor-pointer whitespace-nowrap border border-emerald-500/20"
          >
            <BrainCircuit className="w-4 h-4" />
            Solve maths
          </button>

          <button
            onClick={() => onAISolve('guess')}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600/80 hover:bg-emerald-500/80 shadow-md shadow-emerald-600/10 active:scale-95 transition-all cursor-pointer whitespace-nowrap border border-emerald-500/20"
          >
            <Sparkles className="w-4 h-4" />
            Guess sketch
          </button>
        </div>

      </div>
    </div>
  );
}

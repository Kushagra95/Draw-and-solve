import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook encapsulating all HTML5 canvas drawing logic.
 * Handles pen/eraser modes, coordinate tracking, retina scaling,
 * undo/redo history, and image export.
 */
export default function useCanvas() {
  // Drawing configuration
  const [color, setColor] = useState('#1b4332');
  const [lineWidth, setLineWidth] = useState(4);
  const [mode, setMode] = useState('pen'); // 'pen' | 'eraser'
  const [isDrawing, setIsDrawing] = useState(false);

  // Undo/Redo history
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);

  // Cursor tracking
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHoveringCanvas, setIsHoveringCanvas] = useState(false);

  // Refs
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  // Mutable refs to avoid stale closures in event handlers
  const colorRef = useRef(color);
  const lineWidthRef = useRef(lineWidth);
  const modeRef = useRef(mode);
  const isDrawingRef = useRef(isDrawing);

  useEffect(() => { colorRef.current = color; }, [color]);
  useEffect(() => { lineWidthRef.current = lineWidth; }, [lineWidth]);
  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { isDrawingRef.current = isDrawing; }, [isDrawing]);

  // ---------- Canvas Setup & Resize ----------

  const resizeCanvas = useCallback((isInitial = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    let tempImgData = null;
    const oldWidth = canvas.width;
    const oldHeight = canvas.height;

    if (!isInitial && oldWidth > 0 && oldHeight > 0) {
      try {
        tempImgData = ctx.getImageData(0, 0, oldWidth, oldHeight);
      } catch (e) {
        console.warn('Failed to backup canvas on resize:', e);
      }
    }

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctxRef.current = ctx;

    if (tempImgData) {
      try {
        const offscreen = document.createElement('canvas');
        offscreen.width = oldWidth;
        offscreen.height = oldHeight;
        const offCtx = offscreen.getContext('2d');
        offCtx.putImageData(tempImgData, 0, 0);
        ctx.drawImage(offscreen, 0, 0, oldWidth / dpr, oldHeight / dpr, 0, 0, rect.width, rect.height);
      } catch (e) {
        console.warn('Failed to restore canvas on resize:', e);
      }
    }
  }, []);

  useEffect(() => {
    resizeCanvas(true);
    const handleResize = () => resizeCanvas(false);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [resizeCanvas]);

  // ---------- Coordinate Helpers ----------

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  // ---------- Drawing Event Handlers ----------

  const startDrawing = (e) => {

    const { x, y } = getCoordinates(e);
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);

    if (modeRef.current === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = lineWidthRef.current * 4;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = colorRef.current;
      ctx.lineWidth = lineWidthRef.current;
    }

    ctx.lineTo(x, y);
    ctx.stroke();

    setIsDrawing(true);
    isDrawingRef.current = true;
  };

  const draw = (e) => {
    const clientX = e.touches ? e.touches[0]?.clientX : e.clientX;
    const clientY = e.touches ? e.touches[0]?.clientY : e.clientY;
    if (clientX !== undefined && clientY !== undefined) {
      setCursorPos({ x: clientX, y: clientY });
    }

    if (!isDrawingRef.current) return;

    const { x, y } = getCoordinates(e);
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawingRef.current) return;
    const ctx = ctxRef.current;
    if (ctx) ctx.closePath();

    setIsDrawing(false);
    isDrawingRef.current = false;
    saveHistoryState();
  };

  // ---------- History (Undo/Redo) ----------

  const saveHistoryState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyStep + 1);
    setHistory([...newHistory, imgData]);
    setHistoryStep(newHistory.length);
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas || historyStep < 0) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const prevStep = historyStep - 1;
    if (prevStep >= 0) ctx.putImageData(history[prevStep], 0, 0);
    setHistoryStep(prevStep);
  };

  const handleRedo = () => {
    const canvas = canvasRef.current;
    if (!canvas || historyStep >= history.length - 1) return;
    const nextStep = historyStep + 1;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(history[nextStep], 0, 0);
    setHistoryStep(nextStep);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveHistoryState();
  };

  // ---------- Image Export ----------

  const getCanvasImageBase64 = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    tempCtx.fillStyle = '#020617';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(canvas, 0, 0);

    const dataURL = tempCanvas.toDataURL('image/jpeg', 0.95);
    return dataURL.split(',')[1]; // raw base64 without prefix
  };

  return {
    // Refs
    canvasRef,
    // Drawing config
    color, setColor,
    lineWidth, setLineWidth,
    mode, setMode,
    // Cursor
    cursorPos, isHoveringCanvas, setIsHoveringCanvas,
    // Event handlers
    startDrawing, draw, stopDrawing,
    // History
    handleUndo, handleRedo, handleClear,
    undoDisabled: historyStep < 0,
    redoDisabled: historyStep >= history.length - 1,
    // Export
    getCanvasImageBase64
  };
}

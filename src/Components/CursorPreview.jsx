import React from 'react';
import { Eraser } from 'lucide-react';

/**
 * Custom pencil cursor with a colored band/stripe showing the active color.
 * The pencil body is white, with a colored stripe near the top (like a real pencil).
 */
export default function CursorPreview({ cursorPos, mode, color, lineWidth }) {
  if (mode === 'pen') {
    return (
      <div
        className="pointer-events-none fixed z-50"
        style={{
          left: cursorPos.x,
          top: cursorPos.y,
          transform: 'translate(-2px, -26px)',
        }}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
        >
          {/* Main pencil body - white */}
          <path
            d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
            stroke="white"
            strokeWidth="2"
          />
          {/* Color band stripe across the pencil - shows selected drawing color */}
          <path
            d="m15.5 2.25 4 4"
            stroke={color}
            strokeWidth="2.5"
          />
        </svg>
      </div>
    );
  }

  // Eraser mode: show eraser icon with a size ring
  const size = lineWidth * 4;
  return (
    <div
      className="pointer-events-none fixed z-50 flex items-center justify-center"
      style={{
        left: cursorPos.x,
        top: cursorPos.y,
        width: `${size}px`,
        height: `${size}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div
        className="absolute inset-0 rounded-full border-2 border-white/50"
        style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
      />
      <Eraser className="w-5 h-5 text-white/70 relative z-10" strokeWidth={2} />
    </div>
  );
}

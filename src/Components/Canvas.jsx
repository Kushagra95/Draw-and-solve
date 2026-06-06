import React from 'react';

export default function Canvas({
  canvasRef,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onMouseEnter,
  onTouchStart,
  onTouchMove,
  onTouchEnd
}) {
  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full bg-transparent cursor-none touch-none z-10"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    />
  );
}

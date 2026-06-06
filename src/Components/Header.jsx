import React from 'react';

export default function Header() {
  return (
    <header className="absolute top-4 left-0 right-0 z-40 flex items-center justify-center pointer-events-none">
      <div className="glass-panel px-5 py-3 rounded-2xl flex items-center gap-3 pointer-events-auto">
        <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center border-2 border-white/30 shadow-lg">
          <img src="/img.png" alt="Logo" className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-base font-black tracking-wide text-emerald-400 capitalize">Draw and Solve</h1>
        </div>
      </div>
    </header>
  );
}

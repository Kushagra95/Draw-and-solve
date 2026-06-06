import React, { useEffect } from 'react';
import { X, BrainCircuit, Sparkles, Loader2 } from 'lucide-react';

export default function Toast({ show, text, type, isLoading, error, onClose }) {
  // Auto-dismiss after 8 seconds (only when done loading and no error)
  useEffect(() => {
    if (show && text && !isLoading && !error) {
      const timer = setTimeout(onClose, 8000);
      return () => clearTimeout(timer);
    }
  }, [show, text, isLoading, error, onClose]);

  const formatError = (errMsg) => {
    if (!errMsg) return '';
    return 'there is some internal issues while calculating';
  };

  if (!show) return null;

  const icon = type === 'solve'
    ? <BrainCircuit className="w-5 h-5 text-emerald-400 shrink-0" />
    : <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />;

  const label = isLoading ? 'COMPILING' : 'OUTPUT';

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-[92%] sm:w-80 md:w-96 animate-toast-in">
      <div className="glass-panel rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-start gap-3 p-4">
          {/* Icon */}
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-emerald-400 shrink-0 animate-spin" />
          ) : icon}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">{label}</p>
            {error ? (
              <p className="text-sm text-rose-400">{formatError(error)}</p>
            ) : isLoading ? (
              <p className="text-sm text-white/60 animate-pulse">
                {type === 'solve' ? 'Analyzing your canvas...' : 'Analyzing your doodle...'}
              </p>
            ) : (
              <p className="text-sm text-white/90 font-medium leading-relaxed">{text}</p>
            )}
          </div>

          {/* Close */}
          <button onClick={onClose} className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition cursor-pointer shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar for auto-dismiss */}
        {!isLoading && !error && text && (
          <div className="h-0.5 bg-white/5">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 animate-shrink-bar" />
          </div>
        )}
      </div>
    </div>
  );
}

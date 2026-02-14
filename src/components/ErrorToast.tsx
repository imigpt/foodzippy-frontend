import { useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

function ErrorToast({ message, onClose, duration = 6000 }: ErrorToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-6 right-6 z-[9999] animate-slideIn">
      <div className="bg-white rounded-xl shadow-2xl border-2 border-red-500 max-w-md overflow-hidden">
        {/* Error bar */}
        <div className="h-1.5 bg-gradient-to-r from-red-500 to-rose-500"></div>
        
        <div className="p-5 flex items-start gap-4">
          {/* Error icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-red-600" strokeWidth={2.5} />
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 pt-1">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Error
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {message}
            </p>
          </div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close notification"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        {/* Auto-close progress bar */}
        <div className="h-1 bg-slate-100">
          <div 
            className="h-full bg-gradient-to-r from-red-500 to-rose-500 animate-progress"
            style={{ animationDuration: `${duration}ms` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default ErrorToast;

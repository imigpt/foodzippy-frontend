import { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SuccessToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

function SuccessToast({ message, onClose, duration = 5000 }: SuccessToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-6 right-6 z-[9999] animate-slideIn">
      <div className="bg-white rounded-xl shadow-2xl border-2 border-green-500 max-w-md overflow-hidden">
        {/* Success bar */}
        <div className="h-1.5 bg-gradient-to-r from-green-500 to-emerald-500"></div>
        
        <div className="p-5 flex items-start gap-4">
          {/* Success icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-green-600" strokeWidth={2.5} />
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 pt-1">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Success!
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
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
            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 animate-progress"
            style={{ animationDuration: `${duration}ms` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default SuccessToast;

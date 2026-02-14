import { useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface ValidationError {
  section: string;
  fields: string[];
}

interface ValidationErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errors: ValidationError[];
}

function ValidationErrorModal({ isOpen, onClose, errors }: ValidationErrorModalProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-200">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">
              Missing Required Fields
            </h2>
            <p className="text-sm text-slate-600">
              Please complete the following before submitting
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} className="text-slate-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {errors.map((errorGroup, index) => (
            <div key={index} className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-900">
                {errorGroup.section}
              </h3>
              <div className="space-y-2">
                {errorGroup.fields.map((field, fieldIndex) => (
                  <div
                    key={fieldIndex}
                    className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200"
                  >
                    <AlertCircle
                      size={20}
                      className="text-red-500 flex-shrink-0 mt-0.5"
                    />
                    <p className="text-sm text-slate-800 flex-1">{field}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-orange-600 transition-all transform hover:scale-105 active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ValidationErrorModal;

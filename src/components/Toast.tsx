import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error';
  message: string;
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const isSuccess = toast.type === 'success';

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg shadow-lg ${
        isSuccess ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
      } animate-slide-in`}
      role="alert"
      aria-live="polite"
    >
      {isSuccess ? (
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" aria-hidden="true" />
      ) : (
        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" aria-hidden="true" />
      )}
      <p className={`text-sm font-medium ${isSuccess ? 'text-green-800' : 'text-red-800'}`}>
        {toast.message}
      </p>
      <button
        onClick={() => onClose(toast.id)}
        className={`ml-auto p-1 rounded hover:bg-opacity-20 transition-colors ${
          isSuccess 
            ? 'text-green-600 hover:text-green-800 hover:bg-green-200' 
            : 'text-red-600 hover:text-red-800 hover:bg-red-200'
        }`}
        aria-label={`Dismiss ${toast.type} message`}
        title="Dismiss notification"
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
}
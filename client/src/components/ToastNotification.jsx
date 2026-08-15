import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '../store/uiSlice';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function ToastNotification() {
  const dispatch = useDispatch();
  const { toasts } = useSelector((state) => state.ui);

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        dispatch(removeToast(toasts[0].id));
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toasts, dispatch]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-50 flex flex-col space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto px-4 py-3 rounded-xl glass-panel border border-borderCustom shadow-2xl flex items-center space-x-3 text-xs font-medium animate-in slide-in-from-top-4 duration-300"
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-400" />
          ) : (
            <Info className="w-4 h-4 text-accent" />
          )}
          <span className="text-textPrimary">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}

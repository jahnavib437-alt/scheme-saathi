import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useUIStore } from '../store/uiStore';

export const ToastContainer = () => {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          let Icon = Info;
          let colorClass = 'border-saathi-primary text-saathi-primary';

          if (toast.type === 'success') {
            Icon = CheckCircle2;
            colorClass = 'border-saathi-success text-saathi-success';
          } else if (toast.type === 'warning' || toast.type === 'error') {
            Icon = AlertTriangle;
            colorClass = 'border-saathi-danger text-saathi-danger';
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="pointer-events-auto bg-saathi-card rounded-2xl border border-saathi-border p-4 shadow-soft-lg flex items-start gap-3"
            >
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${colorClass}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-saathi-ink">{toast.title}</p>
                {toast.description && (
                  <p className="text-xs text-saathi-muted mt-0.5 line-clamp-2">
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-saathi-muted hover:text-saathi-ink p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

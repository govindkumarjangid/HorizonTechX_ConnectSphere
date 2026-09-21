import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
  showClose = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="modal-root"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {/* Backdrop */}
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Dialog Card */}
          <motion.div
            key="modal-card"
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ type: 'spring', damping: 28, stiffness: 380 }}
            className={`relative w-full ${maxWidth} max-h-[90dvh] sm:max-h-[85vh] flex flex-col bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden z-10 pb-safe sm:pb-0`}
            role="dialog"
            aria-modal="true"
          >
            {/* Mobile Grab Handle */}
            <div className="pt-2 sm:hidden flex justify-center flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
            </div>

            {title && (
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 dark:border-slate-800/80 flex-shrink-0">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                  {title}
                </h3>
                {showClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    aria-label="Close dialog"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            <div className="p-4 sm:p-6 overflow-y-auto flex-1">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
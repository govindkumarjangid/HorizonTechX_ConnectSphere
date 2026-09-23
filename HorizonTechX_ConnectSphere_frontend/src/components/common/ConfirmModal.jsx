import React from 'react';
import Modal from './Modal';

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDanger = true,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
        {message}
      </p>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm?.();
            onClose?.();
          }}
          className={`px-4 py-2 text-sm font-medium rounded-xl text-white transition-colors ${
            isDanger
              ? 'bg-rose-600 hover:bg-rose-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
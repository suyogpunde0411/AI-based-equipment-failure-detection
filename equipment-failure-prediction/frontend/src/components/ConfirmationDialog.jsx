import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  type = 'danger',
}) => {
  const typeColors = {
    danger: 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-600 hover:text-white focus:ring-red-500',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-600 hover:text-white focus:ring-amber-500',
    info: 'bg-enterprise-500/10 border-enterprise-500/30 text-enterprise-400 hover:bg-enterprise-600 hover:text-white focus:ring-enterprise-500',
  };

  const buttonColors = {
    danger: 'bg-red-600 hover:bg-red-500 text-white focus:ring-red-600',
    warning: 'bg-amber-600 hover:bg-amber-500 text-white focus:ring-amber-600',
    info: 'bg-enterprise-600 hover:bg-enterprise-500 text-white focus:ring-enterprise-600',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg border bg-slate-800/80 text-amber-500`}>
            <AlertTriangle size={20} />
          </div>
          <p className="text-sm text-slate-300 leading-relaxed pt-0.5">{message}</p>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-850">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold focus:outline-none transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors ${buttonColors[type]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;

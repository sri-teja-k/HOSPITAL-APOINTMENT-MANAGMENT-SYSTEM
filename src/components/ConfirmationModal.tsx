import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  reasonPrompt?: boolean;
  reasonValue?: string;
  onReasonChange?: (val: string) => void;
  errorMessage?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel,
  reasonPrompt = false,
  reasonValue = '',
  onReasonChange,
  errorMessage
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="bg-white rounded-lg shadow-xl max-w-md w-full border border-slate-200 overflow-hidden"
      >
        <div className="p-5 flex items-start gap-4">
          <div className={`p-2.5 rounded-full shrink-0 ${isDestructive ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
            <AlertTriangle size={22} />
          </div>
          <div className="flex-1">
            <h3 id="modal-title" className="text-base font-semibold text-slate-900">
              {title}
            </h3>
            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
              {message}
            </p>

            {errorMessage && (
              <div className="mt-2.5 p-2 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700">
                {errorMessage}
              </div>
            )}

            {reasonPrompt && (
              <div className="mt-3">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Reason for Cancellation
                </label>
                <textarea
                  value={reasonValue}
                  onChange={(e) => onReasonChange?.(e.target.value)}
                  placeholder="e.g. Patient schedule conflict, resolved symptoms, or emergency"
                  rows={2}
                  className="w-full text-sm border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-[#1E5AA8] focus:border-[#1E5AA8] outline-hidden"
                />
              </div>
            )}
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="bg-slate-50 px-5 py-3.5 flex justify-end gap-2.5 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100 focus:outline-hidden focus:ring-2 focus:ring-slate-400"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-hidden focus:ring-2 ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500'
                : 'bg-[#1E5AA8] hover:bg-[#164887] focus:ring-[#1E5AA8]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

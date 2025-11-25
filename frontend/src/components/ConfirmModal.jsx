import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, confirmLabel, cancelLabel, type, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    const isDestructive = type === 'destructive';

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] animate-fade-in">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-scale-in">
                <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${isDestructive ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                        <AlertTriangle size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{message}</p>
                    </div>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                    >
                        {cancelLabel || 'Cancelar'}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-white rounded-lg transition-colors font-medium ${isDestructive ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {confirmLabel || 'Confirmar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-mmh-investor-blue/90 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content - Full screen on mobile, centered on desktop */}
            <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-6xl bg-white rounded-none sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
                    {title && (
                        <h3 className="text-lg sm:text-xl font-serif font-bold text-primary">
                            {title}
                        </h3>
                    )}
                    <button
                        onClick={onClose}
                        className="ml-auto p-2 hover:bg-gray-100 rounded-full transition-colors touch-target"
                        aria-label="Close modal"
                    >
                        <X size={24} className="text-gray-600" />
                    </button>
                </div>

                {/* Content - Scrollable with horizontal overflow support */}
                <div className="flex-1 overflow-auto p-4 sm:p-6">
                    <div className="overflow-x-auto">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

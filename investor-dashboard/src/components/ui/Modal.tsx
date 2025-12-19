import React, { useEffect, useState } from 'react';
import { X, Maximize2, Minimize2, ZoomIn, ZoomOut } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isFitToScreen, setIsFitToScreen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Auto-enable fit-to-screen on mobile
            setIsFitToScreen(window.innerWidth < 768);
        } else {
            document.body.style.overflow = 'unset';
            setIsFullscreen(false);
            setIsFitToScreen(false);
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 lg:p-8">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-mmh-investor-blue/90 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={`relative bg-white shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${isFullscreen || window.innerWidth < 640
                        ? 'w-full h-full rounded-none'
                        : 'w-full h-auto max-h-[90vh] max-w-6xl rounded-2xl'
                    }`}
            >
                {/* Header with Controls */}
                <div className="flex items-center justify-between gap-4 p-4 sm:p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
                    {title && (
                        <h3 className="text-base sm:text-xl font-serif font-bold text-primary flex-shrink min-w-0">
                            {title}
                        </h3>
                    )}

                    {/* Control Buttons */}
                    <div className="flex items-center gap-2 ml-auto flex-shrink-0">
                        {/* Fit to Screen Toggle (Mobile) */}
                        <button
                            onClick={() => setIsFitToScreen(!isFitToScreen)}
                            className="hidden sm:flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors touch-target"
                            title={isFitToScreen ? "Normal Size" : "Fit to Screen"}
                        >
                            {isFitToScreen ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
                            <span className="hidden lg:inline">{isFitToScreen ? "Normal" : "Compact"}</span>
                        </button>

                        {/* Fullscreen Toggle (Desktop) */}
                        <button
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="hidden sm:flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors touch-target"
                            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                        >
                            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                            <span className="hidden lg:inline">{isFullscreen ? "Exit" : "Expand"}</span>
                        </button>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-target"
                            aria-label="Close modal"
                        >
                            <X size={20} className="text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Content - Scrollable with horizontal overflow support */}
                <div className="flex-1 overflow-auto p-4 sm:p-6">
                    <div
                        className={`overflow-x-auto ${isFitToScreen ? 'text-xs sm:text-sm' : 'text-sm'
                            }`}
                        style={{
                            WebkitOverflowScrolling: 'touch'
                        }}
                    >
                        {children}
                    </div>
                </div>

                {/* Scroll Indicator for Mobile */}
                <div className="sm:hidden sticky bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-mmh-gold/30 to-transparent pointer-events-none" />
            </div>
        </div>
    );
};

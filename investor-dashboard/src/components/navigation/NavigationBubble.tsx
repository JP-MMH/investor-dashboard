/**
 * Navigation Bubble Component
 * Mater Maria Homes - Global floating navigation
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Calculator, X } from 'lucide-react';

export const NavigationBubble = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const isResidentPage = location.pathname === '/residents';

    return (
        <div className="fixed top-6 left-6 z-50">
            {/* Main Bubble Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-heritage text-cloud px-6 py-3 rounded-full shadow-deep hover:shadow-soft transition-shadow duration-300 font-body font-medium text-sm flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Home className="w-4 h-4" />
                <span>Mater Maria Homes</span>
            </motion.button>

            {/* Popover Menu */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Menu Card */}
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="absolute top-full left-0 mt-3 bg-cloud rounded-xl shadow-deep border border-coolgrey/20 overflow-hidden min-w-[280px]"
                        >
                            {/* Header */}
                            <div className="px-4 py-3 border-b border-coolgrey/20 flex items-center justify-between">
                                <span className="font-heading text-heritage font-semibold text-lg">
                                    Navigate
                                </span>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-coolgrey hover:text-heritage transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Navigation Options */}
                            <div className="p-2">
                                <Link
                                    to="/residents"
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isResidentPage
                                        ? 'bg-heritage text-cloud shadow-soft'
                                        : 'hover:bg-sage/20 text-heritage'
                                        }`}
                                >
                                    <Home className="w-5 h-5" />
                                    <div className="flex-1">
                                        <div className="font-body font-semibold">Resident Calculator</div>
                                        <div className={`text-xs ${isResidentPage ? 'text-cloud/80' : 'text-coolgrey'}`}>
                                            Plan your stay at Mater Maria
                                        </div>
                                    </div>
                                    {isResidentPage && (
                                        <div className="w-2 h-2 rounded-full bg-gold" />
                                    )}
                                </Link>

                                <Link
                                    to="/"
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${!isResidentPage
                                        ? 'bg-heritage text-cloud shadow-soft'
                                        : 'hover:bg-sage/20 text-heritage'
                                        }`}
                                >
                                    <Calculator className="w-5 h-5" />
                                    <div className="flex-1">
                                        <div className="font-body font-semibold">Investor Calculator</div>
                                        <div className={`text-xs ${!isResidentPage ? 'text-cloud/80' : 'text-coolgrey'}`}>
                                            Explore investment opportunities
                                        </div>
                                    </div>
                                    {!isResidentPage && (
                                        <div className="w-2 h-2 rounded-full bg-gold" />
                                    )}
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

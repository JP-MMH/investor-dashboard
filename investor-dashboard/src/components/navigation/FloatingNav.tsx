import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as Popover from '@radix-ui/react-popover';
import { ChevronDown, TrendingUp, Home } from 'lucide-react';

export const FloatingNav: React.FC = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        {
            id: 'investor',
            title: 'Investor Calculator',
            subtitle: 'See projected ROI, IRR, and safety buffers for investors.',
            icon: TrendingUp,
            path: '/',
        },
        {
            id: 'resident',
            title: 'Resident Calculator',
            subtitle: 'Plan your stay, deposits, and yearly living cost as a resident.',
            icon: Home,
            path: '/residents',
        },
    ];

    const handleNavigate = (path: string) => {
        navigate(path);
        setOpen(false);
    };

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
            <Popover.Root open={open} onOpenChange={setOpen}>
                <Popover.Trigger asChild>
                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(16, 59, 50, 0.25)' }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-white/10"
                    >
                        <span className="font-serif font-bold text-lg">Mater Maria Homes</span>
                        <ChevronDown
                            size={18}
                            className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                        />
                    </motion.button>
                </Popover.Trigger>

                <AnimatePresence>
                    {open && (
                        <Popover.Portal forceMount>
                            <Popover.Content
                                align="center"
                                sideOffset={12}
                                className="z-50"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-white rounded-2xl shadow-2xl border border-border overflow-hidden"
                                    style={{ width: '480px' }}
                                >
                                    <div className="p-4 space-y-3">
                                        {navItems.map((item) => {
                                            const Icon = item.icon;
                                            const isActive = location.pathname === item.path;

                                            return (
                                                <motion.button
                                                    key={item.id}
                                                    onClick={() => handleNavigate(item.path)}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${isActive
                                                            ? 'bg-primary text-white shadow-md'
                                                            : 'bg-offwhite hover:bg-primary/5 border border-transparent hover:border-primary/20'
                                                        }`}
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-primary/10'
                                                            }`}>
                                                            <Icon
                                                                size={24}
                                                                className={isActive ? 'text-white' : 'text-primary'}
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className={`font-bold text-lg mb-1 ${isActive ? 'text-white' : 'text-primary'
                                                                }`}>
                                                                {item.title}
                                                            </div>
                                                            <div className={`text-sm ${isActive ? 'text-white/80' : 'text-secondary/70'
                                                                }`}>
                                                                {item.subtitle}
                                                            </div>
                                                        </div>
                                                        {isActive && (
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                className="w-2 h-2 bg-accent rounded-full mt-2"
                                                            />
                                                        )}
                                                    </div>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            </Popover.Content>
                        </Popover.Portal>
                    )}
                </AnimatePresence>
            </Popover.Root>
        </div>
    );
};

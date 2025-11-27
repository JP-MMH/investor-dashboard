import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Home, Heart, Shield } from 'lucide-react';

export const ResidentHero: React.FC = () => {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    const features = [
        { icon: Home, text: 'Premium amenities included' },
        { icon: Heart, text: 'On-site medical & spiritual care' },
        { icon: Shield, text: 'Transparent deposits & exits' },
    ];

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-offwhite to-accent/5 pt-32 pb-20">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="font-serif font-bold text-5xl lg:text-6xl text-primary mb-6 leading-tight">
                            Choose Your Home at{' '}
                            <span className="text-accent">Mater Maria</span>
                        </h1>

                        <p className="text-lg text-secondary/80 mb-6 leading-relaxed">
                            Plan your stay with confidence. Our resident calculator helps you understand
                            costs, deposits, and savings compared to traditional retirement options.
                        </p>

                        <p className="text-base text-secondary/70 mb-8 leading-relaxed">
                            Experience a community designed for dignity, wellness, and peace of mind—with
                            full transparency on what you pay and what you get back.
                        </p>

                        <div className="space-y-3 mb-10">
                            {features.map((feature, idx) => {
                                const Icon = feature.icon;
                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + idx * 0.1 }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Icon size={20} className="text-primary" />
                                        </div>
                                        <span className="text-secondary font-medium">{feature.text}</span>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => scrollToSection('preferences')}
                                className="px-8 py-4 bg-primary text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                Start with my preferences
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => scrollToSection('savings')}
                                className="px-8 py-4 bg-white text-primary border-2 border-primary rounded-full font-bold shadow-md hover:shadow-lg transition-all duration-300"
                            >
                                Compare with other options
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Right Column - Animated Cards */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative h-[500px] hidden lg:block"
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            {[
                                { title: '1 BHK Flat', sqft: '500 sq ft', color: 'from-primary/20 to-primary/5' },
                                { title: '2 BHK Villa', sqft: '800 sq ft', color: 'from-accent/20 to-accent/5' },
                                { title: 'Independent Villa', sqft: '1,200 sq ft', color: 'from-primary/30 to-primary/10' },
                            ].map((card, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ rotate: -10 + idx * 5, y: idx * 20 }}
                                    animate={{
                                        rotate: -5 + idx * 5,
                                        y: idx * 15,
                                    }}
                                    whileHover={{
                                        scale: 1.05,
                                        rotate: 0,
                                        zIndex: 10,
                                        boxShadow: '0 20px 60px rgba(16, 59, 50, 0.3)',
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className={`absolute w-80 h-48 bg-gradient-to-br ${card.color} rounded-2xl shadow-xl border border-primary/10 p-6 cursor-pointer`}
                                    style={{ left: `${idx * 30}px`, top: `${idx * 40}px` }}
                                >
                                    <div className="h-full flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-serif font-bold text-2xl text-primary mb-2">
                                                {card.title}
                                            </h3>
                                            <p className="text-secondary/70">{card.sqft}</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-primary/60">
                                            <Home size={20} />
                                            <span className="text-sm font-medium">Premium Living</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                        <ArrowDown size={32} className="text-primary/40" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

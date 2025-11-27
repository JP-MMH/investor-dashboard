/**
 * Hero Section - Resident Calculator
 * Mater Maria Homes
 */

import { motion } from 'framer-motion';
import { ChevronDown, Shield, Heart, Home as HomeIcon } from 'lucide-react';
import { useRef, useState } from 'react';

const HERO_FEATURES = [
    {
        icon: Shield,
        text: 'Premium amenities included',
    },
    {
        icon: Heart,
        text: 'On-site medical & spiritual care',
    },
    {
        icon: HomeIcon,
        text: 'Transparent deposits & exits',
    },
];

const FLOATING_CARDS = [
    {
        title: '1 BHK Flat',
        sqft: '500 sq ft',
        price: '₹35L',
        gradient: 'from-sage/30 to-cloud',
    },
    {
        title: '2 BHK Villa',
        sqft: '800 sq ft',
        price: '₹58L',
        gradient: 'from-gold/20 to-cloud',
    },
    {
        title: 'Independent Villa',
        sqft: '1200 sq ft',
        price: '₹75L',
        gradient: 'from-terra/20 to-cloud',
    },
];

export const HeroSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        setMousePosition({ x, y });
    };

    return (
        <section className="relative min-h-screen bg-cloud overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-sage/10 via-cloud to-gold/5" />

            <div className="container-custom relative z-10 pt-32 pb-20">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left Column - Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <h1 className="text-5xl md:text-6xl font-heading font-semibold tracking-tight text-heritage mb-6">
                            Choose Your Home at Mater Maria
                        </h1>

                        <p className="text-lg md:text-xl text-heritage/80 font-body mb-8 leading-relaxed">
                            A transparent cost calculator to help you plan your future. Compare our inclusive
                            pricing with traditional retirement options and see the Mater Maria difference.
                        </p>

                        {/* Feature Bullets */}
                        <div className="space-y-4 mb-10">
                            {HERO_FEATURES.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className="w-10 h-10 rounded-full bg-heritage/10 flex items-center justify-center flex-shrink-0">
                                        <feature.icon className="w-5 h-5 text-heritage" />
                                    </div>
                                    <span className="text-base md:text-lg font-body text-heritage/90">
                                        {feature.text}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Column - Floating Cards */}
                    <div
                        ref={containerRef}
                        onMouseMove={handleMouseMove}
                        className="relative h-[500px] lg:h-[600px]"
                    >
                        {FLOATING_CARDS.map((card, index) => {
                            const rotateX = mousePosition.y * (index === 1 ? 6 : 4);
                            const rotateY = mousePosition.x * (index === 1 ? -6 : -4);

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 50, rotateX: 0, rotateY: 0 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        rotateX,
                                        rotateY,
                                    }}
                                    transition={{
                                        delay: 0.4 + index * 0.15,
                                        type: 'spring',
                                        stiffness: 120,
                                        damping: 18,
                                    }}
                                    style={{
                                        transformStyle: 'preserve-3d',
                                        zIndex: 10 - index,
                                    }}
                                    className={`absolute ${index === 0
                                        ? 'top-0 left-0'
                                        : index === 1
                                            ? 'top-1/4 left-1/4'
                                            : 'top-1/2 left-1/2'
                                        } w-72 h-40`}
                                >
                                    <div
                                        className={`w-full h-full rounded-xl bg-gradient-to-br ${card.gradient} shadow-deep p-6 border border-coolgrey/10`}
                                    >
                                        <h3 className="font-heading text-xl font-semibold text-heritage mb-2">
                                            {card.title}
                                        </h3>
                                        <p className="text-sm text-coolgrey mb-3">{card.sqft}</p>
                                        <p className="text-2xl font-heading font-bold text-gold">{card.price}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                    <span className="text-sm text-coolgrey font-body">Scroll to explore</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    >
                        <ChevronDown className="w-6 h-6 text-heritage" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

/**
 * Life at Mater Maria - 3 Expandable Pillars
 * Mater Maria Homes
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Home, Sparkles, Plus, Minus } from 'lucide-react';

interface Pillar {
    id: string;
    title: string;
    icon: typeof Heart;
    description: string;
    amenities: string[];
    gradient: string;
}

const PILLARS: Pillar[] = [
    {
        id: 'medical',
        title: 'Medical & Safety',
        icon: Heart,
        description: 'Comprehensive healthcare and emergency support for peace of mind.',
        amenities: [
            'On-site medical care',
            '24/7 emergency response',
            'Health monitoring',
            'Medication management',
            'Regular health check-ups',
            'Physiotherapy services',
        ],
        gradient: 'from-sage/20 to-cloud',
    },
    {
        id: 'daily',
        title: 'Daily Living',
        icon: Home,
        description: 'Everything you need for comfortable, worry-free daily life.',
        amenities: [
            'Nutritious meals (3x daily)',
            'Housekeeping services',
            'Laundry services',
            'Gated security',
            'Common lounges',
            'Recreational facilities',
            'Transportation assistance',
        ],
        gradient: 'from-gold/15 to-cloud',
    },
    {
        id: 'spiritual',
        title: 'Spirituality & Community',
        icon: Sparkles,
        description: 'Nurture your spirit and build meaningful connections.',
        amenities: [
            'Spiritual care & chapel',
            'Community activities',
            'Library & reading room',
            'Companionship programs',
            'Cultural events',
            'Meditation spaces',
        ],
        gradient: 'from-terra/15 to-cloud',
    },
];

export const LifeAtMaterMaria = () => {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const togglePillar = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <section className="py-20 bg-cloud">
            <div className="container-custom">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-heading font-semibold text-heritage mb-4">
                        Life at Mater Maria
                    </h2>
                    <p className="text-lg text-heritage/80 font-body max-w-2xl mx-auto">
                        Every amenity is designed to support your health, happiness, and peace of mind.
                    </p>
                </motion.div>

                {/* Pillar Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    {PILLARS.map((pillar, index) => {
                        const isExpanded = expandedId === pillar.id;
                        const Icon = pillar.icon;

                        return (
                            <motion.div
                                key={pillar.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.45 }}
                                className="relative"
                            >
                                <motion.div
                                    layout
                                    onClick={() => togglePillar(pillar.id)}
                                    className={`bg-gradient-to-br ${pillar.gradient} rounded-xl shadow-soft border border-coolgrey/10 p-6 cursor-pointer transition-all duration-300 ${isExpanded ? 'shadow-deep' : 'hover:shadow-deep'
                                        }`}
                                    whileHover={{ y: -4, scale: 1.02 }}
                                >
                                    {/* Icon Circle */}
                                    <div className="w-14 h-14 rounded-full bg-heritage/10 flex items-center justify-center mb-4">
                                        <Icon className="w-7 h-7 text-heritage" />
                                    </div>

                                    {/* Title & Description */}
                                    <h3 className="font-heading text-xl font-semibold text-heritage mb-2">
                                        {pillar.title}
                                    </h3>
                                    <p className="text-sm text-heritage/70 font-body mb-4">
                                        {pillar.description}
                                    </p>

                                    {/* Expand/Collapse Button */}
                                    <button
                                        className="flex items-center gap-2 text-sm font-body font-medium text-heritage hover:text-gold transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            togglePillar(pillar.id);
                                        }}
                                    >
                                        {isExpanded ? (
                                            <>
                                                <Minus className="w-4 h-4" />
                                                <span>Show less</span>
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-4 h-4" />
                                                <span>Show more</span>
                                            </>
                                        )}
                                    </button>

                                    {/* Expanded Amenities */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="mt-6 pt-6 border-t border-coolgrey/20"
                                            >
                                                <div className="space-y-2">
                                                    {pillar.amenities.map((amenity, idx) => (
                                                        <motion.div
                                                            key={idx}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: idx * 0.06 }}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                                                            <span className="text-sm text-heritage/80 font-body">
                                                                {amenity}
                                                            </span>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

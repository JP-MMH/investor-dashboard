import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart, Shield, Utensils, Dumbbell,
    Church, Users, Stethoscope, Lock,
    Sparkles, Coffee, BookOpen, Sun
} from 'lucide-react';

interface Amenity {
    icon: typeof Heart;
    title: string;
    description: string;
    extendedDescription: string;
    category: 'medical' | 'daily' | 'wellness' | 'spiritual';
}

const AMENITIES: Amenity[] = [
    {
        icon: Stethoscope,
        title: 'On-site Medical Care',
        description: '24/7 medical support',
        extendedDescription: 'Qualified nurses and doctors on-call, regular health check-ups, and emergency response systems.',
        category: 'medical',
    },
    {
        icon: Shield,
        title: 'Emergency Response',
        description: 'Immediate assistance',
        extendedDescription: 'Round-the-clock emergency buttons in every unit, trained staff, and ambulance tie-ups.',
        category: 'medical',
    },
    {
        icon: Utensils,
        title: 'Nutritious Meals',
        description: '3 meals daily',
        extendedDescription: 'Chef-prepared, balanced meals with dietary customization and special occasion menus.',
        category: 'daily',
    },
    {
        icon: Sparkles,
        title: 'Housekeeping',
        description: 'Daily cleaning service',
        extendedDescription: 'Professional housekeeping, laundry services, and maintenance of common areas.',
        category: 'daily',
    },
    {
        icon: Dumbbell,
        title: 'Fitness & Wellness',
        description: 'Gym & yoga studio',
        extendedDescription: 'Modern fitness equipment, yoga classes, physiotherapy, and wellness programs.',
        category: 'wellness',
    },
    {
        icon: Sun,
        title: 'Outdoor Spaces',
        description: 'Gardens & walking paths',
        extendedDescription: 'Landscaped gardens, meditation zones, and safe walking trails for daily exercise.',
        category: 'wellness',
    },
    {
        icon: Church,
        title: 'Spiritual Care',
        description: 'Chapel & prayer spaces',
        extendedDescription: 'Daily mass, confession, spiritual counseling, and interfaith prayer rooms.',
        category: 'spiritual',
    },
    {
        icon: Users,
        title: 'Community Activities',
        description: 'Events & social programs',
        extendedDescription: 'Regular cultural events, hobby clubs, movie nights, and community celebrations.',
        category: 'spiritual',
    },
    {
        icon: Lock,
        title: 'Gated Security',
        description: '24/7 surveillance',
        extendedDescription: 'CCTV monitoring, trained security personnel, and controlled access for visitor safety.',
        category: 'daily',
    },
    {
        icon: Coffee,
        title: 'Common Lounges',
        description: 'Social gathering spaces',
        extendedDescription: 'Comfortable lounges, library, game rooms, and multipurpose halls for events.',
        category: 'daily',
    },
    {
        icon: BookOpen,
        title: 'Library & Reading',
        description: 'Curated book collection',
        extendedDescription: 'Extensive library with books, magazines, and quiet reading nooks.',
        category: 'wellness',
    },
    {
        icon: Heart,
        title: 'Companionship',
        description: 'Community living',
        extendedDescription: 'Built-in social network, peer support, and organized group activities.',
        category: 'spiritual',
    },
];

const CATEGORY_LABELS = {
    medical: 'Medical & Safety',
    daily: 'Daily Living',
    wellness: 'Wellness & Recreation',
    spiritual: 'Spiritual & Community',
};

export const AmenitiesGrid: React.FC = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <section className="py-20 bg-gradient-to-br from-offwhite to-white">
            <div className="container mx-auto px-6 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="font-serif font-bold text-4xl lg:text-5xl text-primary mb-4">
                        Life at Mater Maria
                    </h2>
                    <p className="text-lg text-secondary/70 max-w-2xl mx-auto">
                        Every amenity is designed to support your health, happiness, and peace of mind.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {AMENITIES.map((amenity, idx) => {
                        const Icon = amenity.icon;
                        const isHovered = hoveredIndex === idx;

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05, duration: 0.4 }}
                                onHoverStart={() => setHoveredIndex(idx)}
                                onHoverEnd={() => setHoveredIndex(null)}
                                className="relative group"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="h-full bg-white rounded-xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 border border-border cursor-pointer"
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary group-hover:scale-110 transition-all duration-300 flex items-center justify-center mb-4">
                                            <Icon size={28} className="text-primary group-hover:text-white transition-colors" />
                                        </div>

                                        <h3 className="font-bold text-lg text-primary mb-2">
                                            {amenity.title}
                                        </h3>

                                        <p className="text-sm text-secondary/70 mb-2">
                                            {amenity.description}
                                        </p>

                                        <div className="text-xs font-bold text-accent uppercase tracking-wider">
                                            {CATEGORY_LABELS[amenity.category]}
                                        </div>
                                    </div>

                                    {/* Extended Description Tooltip */}
                                    <AnimatePresence>
                                        {isHovered && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute z-10 left-1/2 -translate-x-1/2 top-full mt-2 w-64 bg-primary text-white text-xs p-4 rounded-lg shadow-2xl"
                                            >
                                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rotate-45" />
                                                <p className="relative z-10 leading-relaxed">
                                                    {amenity.extendedDescription}
                                                </p>
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

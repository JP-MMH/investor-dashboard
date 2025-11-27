/**
 * Growth Journey - 3D Stacked Phase Cards
 * Mater Maria Homes
 */

import { motion } from 'framer-motion';
import { Building2, Home, Sparkles } from 'lucide-react';

interface Phase {
    id: string;
    title: string;
    icon: typeof Building2;
    description: string;
    features: string[];
    gradient: string;
}

const PHASES: Phase[] = [
    {
        id: 'phase1',
        title: 'Foundational Community',
        icon: Building2,
        description: 'Phase 1: Building the heart of our community',
        features: [
            '60 residential units',
            'Community center',
            'Medical facilities',
            'Dining hall',
        ],
        gradient: 'from-sage/30 to-coolgrey/20',
    },
    {
        id: 'phase2',
        title: 'Premium Villas & Apartments',
        icon: Home,
        description: 'Phase 2: Expanding living options',
        features: [
            'Independent villas',
            'Premium apartments',
            'Enhanced amenities',
            'Wellness center',
        ],
        gradient: 'from-gold/25 to-cloud',
    },
    {
        id: 'phase3',
        title: 'Wellness & Guest Ecosystem',
        icon: Sparkles,
        description: 'Phase 3: Complete lifestyle integration',
        features: [
            'Guest accommodation',
            'Advanced wellness facilities',
            'Spiritual retreat spaces',
            'Community gardens',
        ],
        gradient: 'from-sage/20 to-cloud',
    },
];

export const GrowthJourney = () => {
    return (
        <section className="py-20 bg-gradient-to-br from-cloud via-sage/5 to-cloud">
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
                        Our Growth Journey
                    </h2>
                    <p className="text-lg text-heritage/80 font-body max-w-2xl mx-auto">
                        A phased approach to building a complete, sustainable community.
                    </p>
                </motion.div>

                {/* Phase Cards */}
                <div className="grid md:grid-cols-3 gap-8">
                    {PHASES.map((phase, index) => {
                        const Icon = phase.icon;

                        return (
                            <motion.div
                                key={phase.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    delay: index * 0.15,
                                    type: 'spring',
                                    stiffness: 120,
                                    damping: 18,
                                }}
                                className="relative"
                            >
                                {/* 3D Stack Effect - Shadow Layers */}
                                <div className="absolute inset-0 bg-coolgrey/10 rounded-xl blur-sm transform translate-y-2 translate-x-2" />
                                <div className="absolute inset-0 bg-coolgrey/5 rounded-xl blur-xs transform translate-y-1 translate-x-1" />

                                {/* Main Card */}
                                <motion.div
                                    whileHover={{
                                        y: -6,
                                        scale: 1.02,
                                        boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                                    }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    className={`relative bg-gradient-to-br ${phase.gradient} rounded-xl shadow-soft border border-coolgrey/10 p-6 z-10`}
                                >
                                    {/* Icon */}
                                    <div className="w-12 h-12 rounded-full bg-heritage/10 flex items-center justify-center mb-4">
                                        <Icon className="w-6 h-6 text-heritage" />
                                    </div>

                                    {/* Title & Description */}
                                    <h3 className="font-heading text-xl font-semibold text-heritage mb-2">
                                        {phase.title}
                                    </h3>
                                    <p className="text-sm text-coolgrey font-body mb-4">
                                        {phase.description}
                                    </p>

                                    {/* Features */}
                                    <ul className="space-y-2">
                                        {phase.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                                                <span className="text-sm text-heritage/80 font-body">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

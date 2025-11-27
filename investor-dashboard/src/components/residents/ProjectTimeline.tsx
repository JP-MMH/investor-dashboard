import React from 'react';
import { motion } from 'framer-motion';
import { Building2, TreePine, Heart } from 'lucide-react';

interface Phase {
    title: string;
    yearRange: string;
    icon: typeof Building2;
    highlights: string[];
    color: string;
}

const PHASES: Phase[] = [
    {
        title: 'Foundational Community',
        yearRange: '2025–2027',
        icon: Building2,
        highlights: [
            '40 Flats (1 & 2 BHK)',
            'Core amenities & dining',
            'Medical center & chapel',
            'Community spaces',
        ],
        color: 'from-primary/20 to-primary/5',
    },
    {
        title: 'Premium Villas & Apartments',
        yearRange: '2027–2029',
        icon: TreePine,
        highlights: [
            'Walk-in apartment villas',
            'Twin & independent villas',
            'Expanded wellness center',
            'Landscaped gardens',
        ],
        color: 'from-accent/20 to-accent/5',
    },
    {
        title: 'Wellness & Guest Ecosystem',
        yearRange: '2029–2031',
        icon: Heart,
        highlights: [
            'Guest house (20 rooms)',
            'Advanced wellness facilities',
            'Spiritual retreat spaces',
            'Full community integration',
        ],
        color: 'from-primary/30 to-primary/10',
    },
];

export const ProjectTimeline: React.FC = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="font-serif font-bold text-4xl lg:text-5xl text-primary mb-4">
                        Our Growth Journey
                    </h2>
                    <p className="text-lg text-secondary/70 max-w-2xl mx-auto">
                        Mater Maria is being built in phases, ensuring quality and sustainability
                        at every step of our community's evolution.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {PHASES.map((phase, idx) => {
                        const Icon = phase.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2, duration: 0.6 }}
                                whileHover={{ scale: 1.03, y: -5 }}
                                className="group"
                            >
                                <div className={`h-full bg-gradient-to-br ${phase.color} rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-primary/10`}>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 rounded-xl bg-primary/10 group-hover:bg-primary group-hover:scale-110 transition-all duration-300 flex items-center justify-center">
                                            <Icon size={28} className="text-primary group-hover:text-white transition-colors" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-accent uppercase tracking-wider mb-1">
                                                {phase.yearRange}
                                            </div>
                                            <h3 className="font-serif font-bold text-xl text-primary">
                                                {phase.title}
                                            </h3>
                                        </div>
                                    </div>

                                    <ul className="space-y-3">
                                        {phase.highlights.map((highlight, hIdx) => (
                                            <motion.li
                                                key={hIdx}
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: idx * 0.2 + hIdx * 0.1 }}
                                                className="flex items-start gap-2 text-secondary/80"
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                                <span className="text-sm leading-relaxed">{highlight}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

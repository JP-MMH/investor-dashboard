import React from 'react';
import { motion } from 'framer-motion';
import { Building, Shield, Users, FileText } from 'lucide-react';

const BENEFITS = [
    {
        icon: Building,
        title: 'Asset-Backed Structure',
        description: 'Your investment is backed by real land and buildings, not just promises.',
    },
    {
        icon: Shield,
        title: 'Transparent Governance',
        description: 'Clear rules, documented processes, and regular community updates.',
    },
    {
        icon: Users,
        title: 'Community Over Isolation',
        description: 'Live among peers with shared values, not alone in a house.',
    },
    {
        icon: FileText,
        title: 'Structured Exit & Refunds',
        description: 'Clear refund policies based on tenure, protecting your capital.',
    },
];

const NARRATIVE_POINTS = [
    'Mater Maria is not just a retirement home - it is a community built on dignity, faith, and mutual care.',
    'Unlike traditional options where costs are opaque and amenities are add-ons, we bundle everything into a transparent, predictable model.',
    'Your deposits are refundable based on clear tenure bands, and your monthly fees cover comprehensive care - no hidden charges.',
    'With on-site medical, spiritual, and wellness facilities, you are not just living - you are thriving in a supportive ecosystem.',
];

export const WhyThisWorks: React.FC = () => {
    return (
        <section className="py-20 bg-gradient-to-br from-primary/5 via-offwhite to-accent/5">
            <div className="container mx-auto px-6 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="font-serif font-bold text-4xl lg:text-5xl text-primary mb-4">
                        Why This Model Works
                    </h2>
                    <p className="text-lg text-secondary/70 max-w-2xl mx-auto">
                        Designed with transparency, safety, and community at its core.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left: Narrative */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3 className="font-serif font-bold text-2xl text-primary mb-6">
                            A Model Built for Peace of Mind
                        </h3>
                        <div className="space-y-4">
                            {NARRATIVE_POINTS.map((point, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-start gap-3"
                                >
                                    <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                                    <p className="text-secondary/80 leading-relaxed">{point}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right: Benefit Cards */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        {BENEFITS.map((benefit, idx) => {
                            const Icon = benefit.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-border"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <Icon size={24} className="text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-primary mb-2">
                                                {benefit.title}
                                            </h4>
                                            <p className="text-sm text-secondary/70 leading-relaxed">
                                                {benefit.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

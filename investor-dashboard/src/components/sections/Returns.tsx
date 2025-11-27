import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { TrendingUp, Users, ShieldCheck, Wallet } from 'lucide-react';

const steps = [
    {
        icon: Wallet,
        title: "Investor Capital In",
        desc: "Land acquisition + initial infra + working capital."
    },
    {
        icon: Users,
        title: "Residents Join",
        desc: "Pay share + refundable deposits; portion goes into FDs & Mutual Funds."
    },
    {
        icon: TrendingUp,
        title: "Financial Returns",
        desc: "Interest from FDs, market gains from mutual funds, operating surplus."
    },
    {
        icon: ShieldCheck,
        title: "Safety First",
        desc: "Provisioning for resident refund obligations."
    },
];

export const Returns: React.FC = () => {
    return (
        <section id="returns" className="py-20 bg-offwhite">
            <div className="container-custom">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-primary mb-4">Return Mechanics</h2>
                    <div className="w-16 h-1 bg-accent mx-auto mb-6" />
                    <p className="text-lg text-secondary/80 max-w-2xl mx-auto">
                        A transparent view of how investor returns are generated and protected.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="h-full relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
                                <div className="w-12 h-12 rounded-full bg-offwhite flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <step.icon size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-primary mb-2">{step.title}</h3>
                                <p className="text-sm text-secondary/80">{step.desc}</p>

                                {/* Connector Line (Desktop only, except last item) */}
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-border z-10" />
                                )}
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="bg-primary rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                        <div className="relative z-10">
                            <h3 className="text-2xl font-serif mb-2">Modelled IRR (Base Case)</h3>
                            <div className="text-5xl md:text-6xl font-bold text-accent mb-4 tracking-tight">8.68% <span className="text-2xl text-white/60 font-normal">p.a.</span></div>
                            <p className="text-white/80 max-w-xl mx-auto">
                                Assumes conservative interest and appreciation; no aggressive equity bets. CA-certified for a 15-year horizon.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

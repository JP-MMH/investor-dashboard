import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { Card } from '../ui/Card';

const metrics = [
    { label: 'Target IRR (Base Case)', value: '8.68%', sub: 'p.a.', tooltip: 'Internal Rate of Return based on conservative projections' },
    { label: 'Project Tenure', value: '15', sub: 'Years', tooltip: 'Standard investment horizon' },
    { label: 'Total Project Size', value: '₹61.39', sub: 'Cr', tooltip: 'Total resident refund liability / project scale' },
    { label: 'Year 15 Total Assets', value: '₹67.12', sub: 'Cr', tooltip: 'Projected value of FDs, Mutual Funds, and Real Assets' },
    { label: 'Year 15 Net Worth', value: '₹39.30', sub: 'Cr', tooltip: 'Shutdown scenario: Cash + WDV of Assets' },
    { label: 'Location', value: 'Kerala', sub: 'India', tooltip: 'Premium Senior Living Community' },
];

export const Hero: React.FC = () => {
    return (
        <section id="hero" className="relative min-h-screen flex items-center pt-24 pb-12 bg-offwhite overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-highlight/10 to-transparent pointer-events-none" />

            <div className="container-custom relative z-10">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4 tracking-wider uppercase">
                            Confidential Investor Memorandum
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
                            Mater Maria Investor Dashboard <br />
                            <span className="text-accent italic">15-Year Conservative Case</span>
                        </h1>
                        <p className="text-lg md:text-xl text-secondary/80 max-w-2xl mx-auto leading-relaxed">
                            CA-certified projections, stress-tested resident refunds, backed by real senior-living assets.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {metrics.map((metric, index) => (
                        <motion.div
                            key={metric.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                        >
                            <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-accent">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-sm font-medium text-secondary uppercase tracking-wide">{metric.label}</h3>
                                    <div className="group relative cursor-help">
                                        <Info size={16} className="text-border hover:text-primary transition-colors" />
                                        <div className="absolute bottom-full right-0 mb-2 w-48 bg-primary text-white text-xs p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                            {metric.tooltip}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl md:text-4xl font-bold text-primary font-serif">{metric.value}</span>
                                    <span className="text-sm font-medium text-secondary">{metric.sub}</span>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

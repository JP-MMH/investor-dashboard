import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { CheckCircle2, XCircle } from 'lucide-react';

export const Exit: React.FC = () => {
    return (
        <section id="exit" className="py-20 bg-white">
            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Left: Narrative */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl font-bold text-primary mb-4">Exit & Liquidity</h2>
                        <div className="w-16 h-1 bg-accent mb-6" />
                        <p className="text-lg text-secondary/80 mb-6 leading-relaxed">
                            We have structured the investment with a clear 15-year horizon, with multiple potential exit avenues for investors.
                        </p>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-primary mb-3 flex items-center gap-2">
                                    <CheckCircle2 className="text-accent" /> What is Guaranteed?
                                </h3>
                                <ul className="space-y-2 pl-8 text-secondary/80">
                                    <li>• Resident refunds are senior obligations.</li>
                                    <li>• FD and Mutual Fund corpus is ring-fenced for refunds.</li>
                                    <li>• Land ownership remains with the company until exit.</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-primary mb-3 flex items-center gap-2">
                                    <XCircle className="text-secondary/50" /> What is Not Guaranteed?
                                </h3>
                                <ul className="space-y-2 pl-8 text-secondary/80">
                                    <li>• Exact timing of secondary market sales.</li>
                                    <li>• Returns above the conservative base case (market dependent).</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Timeline */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Card className="bg-offwhite h-full">
                            <h3 className="text-xl font-bold text-primary mb-6">Potential Exit Scenarios</h3>
                            <div className="relative border-l-2 border-border ml-3 space-y-8 pl-8 py-2">
                                <div className="relative">
                                    <span className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-primary border-4 border-white" />
                                    <h4 className="font-bold text-primary">Strategic Sale</h4>
                                    <p className="text-sm text-secondary/80 mt-1">Sale of the entire operational project to a large senior living operator or hospital chain.</p>
                                </div>
                                <div className="relative">
                                    <span className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-primary border-4 border-white" />
                                    <h4 className="font-bold text-primary">Refinance / Buyout</h4>
                                    <p className="text-sm text-secondary/80 mt-1">Refinancing with long-term senior debt to buy out initial equity investors.</p>
                                </div>
                                <div className="relative">
                                    <span className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-primary border-4 border-white" />
                                    <h4 className="font-bold text-primary">Annuity Model</h4>
                                    <p className="text-sm text-secondary/80 mt-1">Transition to a dividend-yielding annuity model with structured buybacks over time.</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

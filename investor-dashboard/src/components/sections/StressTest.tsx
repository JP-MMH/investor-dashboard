import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { AlertTriangle } from 'lucide-react';

export const StressTest: React.FC = () => {
    return (
        <section id="stress-test" className="py-20 bg-white">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-primary mb-4">Year 15 Stress Test</h2>
                    <div className="w-16 h-1 bg-accent mx-auto mb-6" />
                    <p className="text-lg text-secondary/80 max-w-2xl mx-auto">
                        We model a complete shutdown scenario in Year 15 to ensure investor capital is protected even in the worst case.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Assets */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="h-full border-t-4 border-t-primary">
                            <h3 className="text-xl font-bold text-primary mb-6 border-b border-border pb-4">Year 15 – Assets</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-secondary">FD Value</span>
                                    <span className="font-bold text-primary">₹29.73 Cr</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-secondary">Mutual Fund Value</span>
                                    <span className="font-bold text-primary">₹37.11 Cr</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-secondary">Cash Reserve</span>
                                    <span className="font-bold text-primary">₹0.28 Cr</span>
                                </div>
                                <div className="pt-4 border-t border-border flex justify-between items-center bg-offwhite/50 p-3 rounded-lg">
                                    <span className="font-bold text-primary">Total Liquid Assets</span>
                                    <span className="font-bold text-primary text-lg">₹67.12 Cr</span>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Liabilities */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="h-full border-t-4 border-t-risk">
                            <h3 className="text-xl font-bold text-primary mb-6 border-b border-border pb-4">Year 15 – Liabilities</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-secondary">Resident Refund Obligations</span>
                                    <span className="font-bold text-risk">₹61.39 Cr</span>
                                </div>
                                <div className="flex justify-between items-center opacity-50">
                                    <span className="text-secondary">Other Liabilities</span>
                                    <span className="font-bold text-secondary">₹0.00 Cr</span>
                                </div>
                                <div className="pt-4 border-t border-border flex justify-between items-center bg-risk/5 p-3 rounded-lg">
                                    <span className="font-bold text-risk">Total Liabilities</span>
                                    <span className="font-bold text-risk text-lg">₹61.39 Cr</span>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>

                {/* Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Card className="bg-primary text-white border-none">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-accent mb-2">Net Worth in Shutdown Scenario</h3>
                                <p className="text-white/80 leading-relaxed">
                                    If the project is completely shut down in Year 15 and every resident is fully refunded, the company still retains approximately <strong className="text-white">₹39.30 Cr</strong> in net worth (cash balance + conservative written-down value of land and infrastructure).
                                </p>
                            </div>
                            <div className="text-right min-w-[200px]">
                                <div className="text-sm text-accent uppercase tracking-wider mb-1">Net Surplus</div>
                                <div className="text-5xl font-serif font-bold">₹39.30 Cr</div>
                                <div className="text-xs text-white/60 mt-2 flex items-center justify-end gap-1">
                                    <AlertTriangle size={12} />
                                    <span>Includes WDV of Assets</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
};

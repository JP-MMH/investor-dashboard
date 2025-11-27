import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Building, FileCheck, Shield, Eye } from 'lucide-react';

const governanceItems = [
    { icon: Building, text: "Project Company: Mater Maria Wellness Homes Pvt Ltd." },
    { icon: Shield, text: "Land ownership held directly in the project company." },
    { icon: FileCheck, text: "Annual audit by independent CA firm." },
    { icon: Eye, text: "Board oversight with investor observation rights." },
];

export const GovernanceExitSection: React.FC = () => {
    return (
        <section id="governance" className="py-20 bg-offwhite">
            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Governance */}
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-primary mb-6">Governance</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {governanceItems.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                >
                                    <Card className="h-full flex flex-col items-center text-center p-6">
                                        <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary mb-3">
                                            <item.icon size={20} />
                                        </div>
                                        <p className="text-secondary text-sm font-medium">{item.text}</p>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Exit Timeline */}
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-primary mb-6">Exit Scenarios</h2>
                        <Card className="h-full bg-white">
                            <div className="relative border-l-2 border-border ml-3 space-y-8 pl-8 py-2">
                                <div className="relative">
                                    <span className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-primary border-4 border-white" />
                                    <h4 className="font-bold text-primary">Operations & Distributions</h4>
                                    <p className="text-sm text-secondary/80 mt-1">Regular dividends from operating surplus and FD interest.</p>
                                </div>
                                <div className="relative">
                                    <span className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-primary border-4 border-white" />
                                    <h4 className="font-bold text-primary">Strategic Sale / Buyout</h4>
                                    <p className="text-sm text-secondary/80 mt-1">Sale to operator or refinance with senior debt to buy out equity.</p>
                                </div>
                                <div className="relative">
                                    <span className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-primary border-4 border-white" />
                                    <h4 className="font-bold text-primary">Year 15 Shutdown (Stress Test)</h4>
                                    <p className="text-sm text-secondary/80 mt-1">Full liquidation of assets covers all liabilities with surplus.</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                </div>
            </div>
        </section>
    );
};

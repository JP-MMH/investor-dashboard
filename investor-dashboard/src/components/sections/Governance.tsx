import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Building, FileCheck, PieChart, Shield, Eye } from 'lucide-react';

const items = [
    { icon: Building, text: "Project Company: Mater Maria Wellness Homes Pvt Ltd." },
    { icon: Shield, text: "Land ownership held directly in the project company." },
    { icon: FileCheck, text: "Annual audit by independent CA firm." },
    { icon: PieChart, text: "Quarterly investor dashboard: occupancy, FD/MF balances, cash position." },
    { icon: FileCheck, text: "Annual audited financials shared with all investors." },
    { icon: Eye, text: "Board oversight with investor observation rights." },
];

export const Governance: React.FC = () => {
    return (
        <section id="governance" className="py-20 bg-offwhite">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-primary mb-4">Governance & Structure</h2>
                    <div className="w-16 h-1 bg-accent mx-auto mb-6" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                            <Card className="h-full flex flex-col items-center text-center hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary mb-4">
                                    <item.icon size={24} />
                                </div>
                                <p className="text-secondary font-medium">{item.text}</p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

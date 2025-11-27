import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';

const inventory = [
    { type: 'App. Villa – Double', occupancy: 'Double', units: 40, sqft: 800, deposit: 5800000 },
    { type: 'App. Villa – Single', occupancy: 'Single', units: 10, sqft: 600, deposit: 5100000 },
    { type: 'Flat – Double', occupancy: 'Double', units: 10, sqft: 700, deposit: 4300000 },
    { type: 'Flat – Single', occupancy: 'Single', units: 10, sqft: 500, deposit: 3800000 },
    { type: 'Independent Villa – Double', occupancy: 'Double', units: 10, sqft: 1200, deposit: 8000000 },
    { type: 'Independent Villa – Double', occupancy: 'Double', units: 10, sqft: 1000, deposit: 7000000 },
    { type: 'Twin Villa – Double', occupancy: 'Double', units: 5, sqft: 800, deposit: 6000000 },
    { type: 'Twin Villa – Single', occupancy: 'Single', units: 5, sqft: 600, deposit: 5500000 },
];

const formatINR = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

export const Snapshot: React.FC = () => {
    return (
        <section id="snapshot" className="py-20 bg-white">
            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Narrative */}
                    <div className="lg:col-span-1 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-3xl font-bold text-primary mb-4">Project Snapshot</h2>
                            <div className="w-16 h-1 bg-accent mb-6" />
                            <ul className="space-y-4 text-secondary/80 leading-relaxed">
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 flex-shrink-0" />
                                    <span>Integrated senior-living campus with medical support.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 flex-shrink-0" />
                                    <span>Located in a high-demand micro-market in Kerala (NRI parents + ageing population).</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 flex-shrink-0" />
                                    <span>Long-term residency model with refundable deposits and share-based participation.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 flex-shrink-0" />
                                    <span>All numbers shown are from conservative, CA-reviewed financial models.</span>
                                </li>
                            </ul>
                        </motion.div>
                    </div>

                    {/* Right Column: Inventory Table */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <Card className="overflow-hidden p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-primary text-white">
                                            <tr>
                                                <th className="px-6 py-4 font-medium">Type</th>
                                                <th className="px-6 py-4 font-medium">Occupancy</th>
                                                <th className="px-6 py-4 font-medium">Units</th>
                                                <th className="px-6 py-4 font-medium">Sq. Ft.</th>
                                                <th className="px-6 py-4 font-medium text-right">Resident Deposit</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {inventory.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-offwhite/50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-primary">{item.type}</td>
                                                    <td className="px-6 py-4 text-secondary">{item.occupancy}</td>
                                                    <td className="px-6 py-4 text-secondary">{item.units}</td>
                                                    <td className="px-6 py-4 text-secondary">{item.sqft}</td>
                                                    <td className="px-6 py-4 text-right font-medium text-primary">{formatINR(item.deposit)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="bg-offwhite px-6 py-4 border-t border-border flex flex-wrap gap-6 justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-secondary uppercase tracking-wider">Total Keys</span>
                                        <span className="text-xl font-bold text-primary">100</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-secondary uppercase tracking-wider">Medical Deposits</span>
                                        <span className="text-xl font-bold text-primary">175</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-secondary uppercase tracking-wider">Car Parks</span>
                                        <span className="text-xl font-bold text-primary">40</span>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

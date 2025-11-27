import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '../ui/Card';

const data = [
    { name: 'Fixed Deposits', value: 44, color: '#103B32', initial: '₹15.00 Cr', rate: '6% p.a.', final: '₹29.73 Cr' },
    { name: 'Mutual Funds', value: 55, color: '#CBA35C', initial: '₹8.20 Cr', rate: '12-14% p.a.', final: '₹37.11 Cr' },
    { name: 'Cash Reserve', value: 1, color: '#E8D3A3', initial: '₹0.28 Cr', rate: 'N/A', final: '₹0.28 Cr' },
];

export const Allocation: React.FC = () => {
    return (
        <section id="allocation" className="py-20 bg-offwhite">
            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left: Explanation */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl font-bold text-primary mb-4">Capital Allocation</h2>
                        <div className="w-16 h-1 bg-accent mb-6" />
                        <p className="text-lg text-secondary/80 mb-6 leading-relaxed">
                            We prioritize capital safety while ensuring growth. A significant portion of resident deposits is ring-fenced in secure instruments.
                        </p>
                        <div className="space-y-4">
                            <Card className="border-l-4 border-l-primary">
                                <p className="text-secondary">
                                    <strong className="text-primary">Fixed Deposits:</strong> A minimum of ₹15 Cr is kept in FDs at ~6% p.a. for guaranteed liquidity and safety.
                                </p>
                            </Card>
                            <Card className="border-l-4 border-l-accent">
                                <p className="text-secondary">
                                    <strong className="text-primary">Mutual Funds:</strong> ₹8.2 Cr is allocated to conservative, large-cap funds, assuming 12–14% historical returns; modelled to reach ₹37.11 Cr by Year 15.
                                </p>
                            </Card>
                            <Card className="border-l-4 border-l-highlight">
                                <p className="text-secondary">
                                    <strong className="text-primary">Cash Reserves:</strong> Kept for operational safety and refund timing.
                                </p>
                            </Card>
                        </div>
                    </motion.div>

                    {/* Right: Chart */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Card className="flex flex-col items-center">
                            <h3 className="text-xl font-bold text-primary mb-6">Projected Asset Mix (Year 15)</h3>
                            <div className="w-full h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={120}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E0DED7', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            itemStyle={{ color: '#103B32' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="grid grid-cols-3 gap-4 w-full mt-6 text-center">
                                {data.map((item) => (
                                    <div key={item.name} className="flex flex-col items-center">
                                        <div className="w-3 h-3 rounded-full mb-2" style={{ backgroundColor: item.color }} />
                                        <span className="text-xs font-bold text-primary">{item.name}</span>
                                        <span className="text-xs text-secondary">{item.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

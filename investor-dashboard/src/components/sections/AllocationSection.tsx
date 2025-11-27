import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../lib/utils';

interface AllocationSectionProps {
    amount: number;
}

const data = [
    { name: 'Fixed Deposits', value: 44, color: '#103B32', rate: '6% p.a.' },
    { name: 'Mutual Funds', value: 55, color: '#CBA35C', rate: '12-14% p.a.' },
    { name: 'Cash Reserve', value: 1, color: '#E8D3A3', rate: 'N/A' },
];

export const AllocationSection: React.FC<AllocationSectionProps> = ({ amount }) => {

    // Calculate proportional amounts
    const fdAmount = amount * 0.44;
    const mfAmount = amount * 0.55;
    const cashAmount = amount * 0.01;

    return (
        <section id="allocation" className="py-20 bg-white">
            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left: Explanation */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl font-serif font-bold text-primary mb-4">Where your money actually goes</h2>
                        <div className="w-16 h-1 bg-accent mb-6" />
                        <p className="text-lg text-secondary/80 mb-6 leading-relaxed">
                            We prioritize capital safety while ensuring growth. Your investment is allocated across secure instruments to balance liquidity and returns.
                        </p>
                        <div className="space-y-4">
                            <Card className="border-l-4 border-l-primary py-4">
                                <p className="text-secondary text-sm">
                                    <strong className="text-primary block text-lg mb-1">Fixed Deposits (~44%)</strong>
                                    Guaranteed liquidity and safety.
                                </p>
                            </Card>
                            <Card className="border-l-4 border-l-accent py-4">
                                <p className="text-secondary text-sm">
                                    <strong className="text-primary block text-lg mb-1">Mutual Funds (~55%)</strong>
                                    Conservative, large-cap funds for growth.
                                </p>
                            </Card>
                            <Card className="border-l-4 border-l-highlight py-4">
                                <p className="text-secondary text-sm">
                                    <strong className="text-primary block text-lg mb-1">Cash Reserves (~1%)</strong>
                                    Operational safety buffer.
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
                            <h3 className="text-xl font-bold text-primary mb-6">Your Allocation</h3>
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
                                            formatter={(value, name) => {
                                                const absoluteAmount = amount * (Number(value) / 100);
                                                return [`${value}% (${formatCurrency(absoluteAmount)})`, name];
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="grid grid-cols-3 gap-4 w-full mt-6 text-center">
                                <div className="flex flex-col items-center">
                                    <div className="w-3 h-3 rounded-full mb-2 bg-[#103B32]" />
                                    <span className="text-xs font-bold text-primary">FD</span>
                                    <span className="text-xs text-secondary">{formatCurrency(fdAmount)}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-3 h-3 rounded-full mb-2 bg-[#CBA35C]" />
                                    <span className="text-xs font-bold text-primary">MF</span>
                                    <span className="text-xs text-secondary">{formatCurrency(mfAmount)}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-3 h-3 rounded-full mb-2 bg-[#E8D3A3]" />
                                    <span className="text-xs font-bold text-primary">Cash</span>
                                    <span className="text-xs text-secondary">{formatCurrency(cashAmount)}</span>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

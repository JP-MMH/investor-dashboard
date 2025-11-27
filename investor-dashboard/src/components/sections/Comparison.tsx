import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card } from '../ui/Card';
import { Check, X } from 'lucide-react';

const chartData = [
    { name: 'Bank FD', value: 2.39, rate: '6%' }, // 1 * 1.06^15
    { name: 'Govt Bonds', value: 2.75, rate: '7%' }, // 1 * 1.07^15
    { name: 'Mater Maria', value: 3.49, rate: '8.68%' }, // 1 * 1.0868^15
    { name: 'Conservative MF', value: 4.17, rate: '10%' }, // 1 * 1.10^15
    { name: 'Aggressive Equity', value: 6.25, rate: '13%' }, // 1 * 1.13^15
];

const comparisonTable = [
    { option: 'Bank FD', pros: 'Guaranteed, very safe', cons: 'Low returns, inflation risk' },
    { option: 'Govt Bonds', pros: 'Stable, slightly higher than FD', cons: 'No real-asset upside' },
    { option: 'Conservative Mutual Funds', pros: 'Better long-term growth', cons: 'Market volatility' },
    { option: 'Aggressive Equity', pros: 'Highest upside potential', cons: 'High drawdown risk, emotional stress' },
    { option: 'Mater Maria', pros: 'Backed by real senior-living asset, stress-tested refunds', cons: 'Less liquid than FDs/MFs, 15-year horizon' },
];

export const Comparison: React.FC = () => {
    return (
        <section id="comparison" className="py-20 bg-white">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-primary mb-4">Market Comparison</h2>
                    <div className="w-16 h-1 bg-accent mx-auto mb-6" />
                    <p className="text-lg text-secondary/80 max-w-2xl mx-auto">
                        How Mater Maria compares to standard investment options over a 15-year horizon.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Card className="h-full">
                            <h3 className="text-xl font-bold text-primary mb-6">Value of ₹1 Cr After 15 Years</h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                        <XAxis type="number" hide />
                                        <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E0DED7' }}
                                            formatter={(value: number) => [`₹${value} Cr`, 'Projected Value']}
                                        />
                                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.name === 'Mater Maria' ? '#CBA35C' : '#103B32'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <p className="text-xs text-secondary/60 text-center mt-4">*Pre-tax values based on nominal annual rates.</p>
                        </Card>
                    </motion.div>

                    {/* Table */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="space-y-4">
                            {comparisonTable.map((item, index) => (
                                <div key={index} className={`p-4 rounded-xl border ${item.option === 'Mater Maria' ? 'bg-primary text-white border-primary' : 'bg-offwhite border-border'}`}>
                                    <div className="font-bold mb-2 flex justify-between">
                                        <span>{item.option}</span>
                                        {item.option === 'Mater Maria' && <span className="text-xs bg-accent text-primary px-2 py-0.5 rounded">Recommended</span>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-start gap-2">
                                            <Check size={16} className={item.option === 'Mater Maria' ? 'text-accent' : 'text-green-600'} />
                                            <span className={item.option === 'Mater Maria' ? 'text-white/80' : 'text-secondary'}>{item.pros}</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <X size={16} className={item.option === 'Mater Maria' ? 'text-white/60' : 'text-red-500'} />
                                            <span className={item.option === 'Mater Maria' ? 'text-white/80' : 'text-secondary'}>{item.cons}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

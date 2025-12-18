import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card } from '../ui/Card';

const sensitivityData = [
    { occupancy: '60%', cashFlow: 0 },
    { occupancy: '70%', cashFlow: 0.2 },
    { occupancy: '80%', cashFlow: 0.5 },
    { occupancy: '90%', cashFlow: 0.8 },
    { occupancy: '100%', cashFlow: 1.0 },
];

export const Demand: React.FC = () => {
    return (
        <section id="demand" className="py-20 bg-offwhite">
            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left: Narrative */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl font-bold text-primary mb-4">Demand & Viability</h2>
                        <div className="w-16 h-1 bg-accent mb-6" />
                        <ul className="space-y-4 text-secondary/80 leading-relaxed">
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 flex-shrink-0" />
                                <span><strong>Market Drivers:</strong> Kerala has a rapidly ageing demographic. With many children living abroad (NRIs), there is a critical need for managed care.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 flex-shrink-0" />
                                <span><strong>Supply Gap:</strong> While "old-age homes" exist, there is a massive shortage of premium, medically integrated retirement communities that offer a dignified lifestyle.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 flex-shrink-0" />
                                <span><strong>Pricing Power:</strong> Our "Asset-Backed + Liquid Pool" model allows us to offer competitive entry points while maintaining high service standards, unlike pure real estate plays.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 flex-shrink-0" />
                                <span><strong>Transparency:</strong> We report quarterly on occupancy, cash pool status, and refund liabilities, ensuring you are never in the dark.</span>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Right: Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Card>
                            <h3 className="text-xl font-bold text-primary mb-6">Occupancy Sensitivity</h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={sensitivityData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="occupancy" />
                                        <YAxis hide />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E0DED7' }}
                                            formatter={(value: number) => [value > 0 ? 'Positive' : 'Neutral', 'Cash Flow Index']}
                                        />
                                        <ReferenceLine x="70%" stroke="#B9373C" strokeDasharray="3 3" label={{ value: 'Breakeven', position: 'top', fill: '#B9373C', fontSize: 12 }} />
                                        <Line type="monotone" dataKey="cashFlow" stroke="#103B32" strokeWidth={3} dot={{ r: 6, fill: '#CBA35C' }} activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <p className="text-xs text-secondary/60 text-center mt-4">Operational breakeven estimated at ~65-70% occupancy.</p>
                        </Card>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

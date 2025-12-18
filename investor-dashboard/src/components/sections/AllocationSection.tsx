import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../lib/utils';
import { getAllocationSplit, getRiskDescription, type RiskModel } from '../../lib/financialModel';

interface AllocationSectionProps {
    amount: number;
}

const COLORS = {
    FD: '#103B32',
    MF: '#CBA35C',
    Cash: '#E8D3A3'
};

const RISK_MODELS: { id: RiskModel; label: string }[] = [
    { id: 'AGGRESSIVE', label: 'Aggressive' },
    { id: 'MODERATE', label: 'Moderate' },
    { id: 'CONSERVATIVE', label: 'Conservative' },
];

export const AllocationSection: React.FC<AllocationSectionProps> = ({ amount }) => {
    const [riskModel, setRiskModel] = useState<RiskModel>('MODERATE');

    // Get allocation split based on risk model
    const split = getAllocationSplit(riskModel);

    // Calculate absolute amounts
    const fdAmount = amount * split.fd;
    const mfAmount = amount * split.mf;
    const cashAmount = amount * split.cash;

    const data = [
        { name: 'Fixed Deposits', value: split.fd * 100, color: COLORS.FD, rate: '6% p.a.' },
        { name: 'Mutual Funds', value: split.mf * 100, color: COLORS.MF, rate: '12-14% p.a.' },
        { name: 'Cash Reserve', value: split.cash * 100, color: COLORS.Cash, rate: 'N/A' },
    ].filter(item => item.value > 0); // Hide 0% segments

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

                        {/* Risk Model Selector */}
                        <div className="mb-8">
                            <div className="text-xs uppercase tracking-wider mb-2 font-bold text-secondary/60">Select Allocation Strategy</div>
                            <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200 inline-flex w-full md:w-auto">
                                {RISK_MODELS.map((model) => (
                                    <button
                                        key={model.id}
                                        onClick={() => setRiskModel(model.id)}
                                        className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-md transition-all ${riskModel === model.id
                                                ? 'bg-primary text-white shadow-sm'
                                                : 'text-secondary/60 hover:text-primary hover:bg-gray-200'
                                            }`}
                                    >
                                        {model.label}
                                    </button>
                                ))}
                            </div>
                            <p className="mt-2 text-sm text-secondary/60 italic">
                                {getRiskDescription(riskModel)}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <Card className={`border-l-4 border-l-[#103B32] py-4 ${split.fd === 0 ? 'opacity-50' : ''}`}>
                                <p className="text-secondary text-sm">
                                    <strong className="text-primary block text-lg mb-1">Fixed Deposits (~{(split.fd * 100).toFixed(0)}%)</strong>
                                    Guaranteed liquidity and safety.
                                </p>
                            </Card>
                            <Card className={`border-l-4 border-l-[#CBA35C] py-4 ${split.mf === 0 ? 'opacity-50' : ''}`}>
                                <p className="text-secondary text-sm">
                                    <strong className="text-primary block text-lg mb-1">Mutual Funds (~{(split.mf * 100).toFixed(0)}%)</strong>
                                    Conservative, large-cap funds for growth.
                                </p>
                            </Card>
                            <Card className="border-l-4 border-l-[#E8D3A3] py-4">
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
                        <Card className="flex flex-col items-center p-8">
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
                                            stroke="none"
                                        >
                                            {data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E0DED7', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            itemStyle={{ color: '#103B32' }}
                                            formatter={(value, name) => {
                                                const percentage = Number(value);
                                                const absoluteAmount = amount * (percentage / 100);
                                                return [`${percentage.toFixed(0)}% (${formatCurrency(absoluteAmount)})`, name];
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="grid grid-cols-3 gap-4 w-full mt-6 text-center">
                                <div className={`flex flex-col items-center ${split.fd === 0 ? 'opacity-30' : ''}`}>
                                    <div className="w-3 h-3 rounded-full mb-2 bg-[#103B32]" />
                                    <span className="text-xs font-bold text-primary">FD</span>
                                    <span className="text-xs text-secondary">{formatCurrency(fdAmount)}</span>
                                </div>
                                <div className={`flex flex-col items-center ${split.mf === 0 ? 'opacity-30' : ''}`}>
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

                            <div className="mt-6 pt-4 border-t border-gray-100 w-full text-center">
                                <p className="text-[10px] text-secondary/50 italic">
                                    Allocation shown is portfolio allocation of funds; operational deployments happen as per board policy.
                                </p>
                            </div>
                        </Card>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

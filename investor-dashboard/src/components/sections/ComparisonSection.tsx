import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../lib/utils';
import { YearlyProjectionChart } from './YearlyProjectionChart';
import { BreakdownTable } from './BreakdownTable';
import { calculateYearlyBreakdown, calculateInvestorMetrics, getRiskDescription, type PlanType, type RiskModel } from '../../lib/financialModel';

interface ComparisonSectionProps {
    amount: number;
    selectedPlan: PlanType;
    lots: number;
}

const RISK_MODELS: { id: RiskModel; label: string }[] = [
    { id: 'AGGRESSIVE', label: 'Aggressive' },
    { id: 'MODERATE', label: 'Moderate' },
    { id: 'CONSERVATIVE', label: 'Conservative' },
];

export const ComparisonSection: React.FC<ComparisonSectionProps> = ({ amount, selectedPlan, lots }) => {
    const [riskModel, setRiskModel] = useState<RiskModel>('MODERATE');
    const planName = selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1);

    // Calculate breakdown data
    const breakdownData = calculateYearlyBreakdown(amount, selectedPlan, lots, riskModel);
    const metrics = calculateInvestorMetrics(selectedPlan, lots, riskModel);

    // Get Year 15 values for the table
    const year15 = breakdownData[breakdownData.length - 1];

    return (
        <section id="comparison" className="py-20 bg-offwhite">
            <div className="container-custom">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif font-bold text-primary mb-4">Investment Model Comparison</h2>
                    <div className="w-16 h-1 bg-accent mx-auto mb-6" />
                    <p className="text-lg text-secondary/80 max-w-2xl mx-auto">
                        See how Mater Maria stacks up against traditional investment instruments in terms of returns, safety, and asset backing.
                    </p>

                    {/* Risk Model Selector */}
                    <div className="mt-8 flex flex-col items-center">
                        <div className="text-xs uppercase tracking-wider mb-2 font-bold text-secondary/60">Select Scenario</div>
                        <div className="bg-white p-1 rounded-lg border border-gray-200 inline-flex shadow-sm">
                            {RISK_MODELS.map((model) => (
                                <button
                                    key={model.id}
                                    onClick={() => setRiskModel(model.id)}
                                    className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${riskModel === model.id
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'text-secondary/60 hover:text-primary hover:bg-gray-100'
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
                </div>

                <div className="overflow-x-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <table className="w-full bg-white rounded-xl shadow-sm border border-border overflow-hidden">
                            <thead className="bg-primary text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left font-serif text-lg">Instrument</th>
                                    <th className="px-6 py-4 text-left font-serif text-lg">Est. Value (Year 15)</th>
                                    <th className="px-6 py-4 text-left font-serif text-lg">Approx. IRR</th>
                                    <th className="px-6 py-4 text-left font-serif text-lg">Safety</th>
                                    <th className="px-6 py-4 text-left font-serif text-lg">Volatility</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                <tr className="hover:bg-offwhite/30">
                                    <td className="px-6 py-4 font-medium text-primary">Bank Fixed Deposit</td>
                                    <td className="px-6 py-4 text-secondary">{formatCurrency(year15.fdValue)}</td>
                                    <td className="px-6 py-4 text-secondary">~6.0%</td>
                                    <td className="px-6 py-4 text-green-600 font-medium">High</td>
                                    <td className="px-6 py-4 text-green-600 font-medium">Low</td>
                                </tr>
                                <tr className="hover:bg-offwhite/30">
                                    <td className="px-6 py-4 font-medium text-primary">Govt. Bonds</td>
                                    <td className="px-6 py-4 text-secondary">{formatCurrency(year15.bondValue)}</td>
                                    <td className="px-6 py-4 text-secondary">~7.0%</td>
                                    <td className="px-6 py-4 text-green-600 font-medium">High</td>
                                    <td className="px-6 py-4 text-green-600 font-medium">Low</td>
                                </tr>
                                <tr className="hover:bg-offwhite/30">
                                    <td className="px-6 py-4 font-medium text-primary">Conservative Mutual Fund</td>
                                    <td className="px-6 py-4 text-secondary">{formatCurrency(year15.mfValue)}</td>
                                    <td className="px-6 py-4 text-secondary">~10.0%</td>
                                    <td className="px-6 py-4 text-yellow-600 font-medium">Moderate</td>
                                    <td className="px-6 py-4 text-yellow-600 font-medium">Medium</td>
                                </tr>
                                <tr className="hover:bg-offwhite/30">
                                    <td className="px-6 py-4 font-medium text-primary">Aggressive Equity</td>
                                    <td className="px-6 py-4 text-secondary">{formatCurrency(year15.equityValue)}</td>
                                    <td className="px-6 py-4 text-secondary">~13.0%</td>
                                    <td className="px-6 py-4 text-red-600 font-medium">Low</td>
                                    <td className="px-6 py-4 text-red-600 font-medium">High</td>
                                </tr>
                                <tr className="bg-primary/5 border-l-4 border-l-accent">
                                    <td className="px-6 py-4 font-bold text-primary flex items-center gap-2">
                                        Mater Maria – {planName}
                                        <span className="bg-accent text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Recommended</span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-accent text-xl">{formatCurrency(year15.closingValue)}</td>
                                    <td className="px-6 py-4 font-bold text-primary">{metrics.irrDisplay}</td>
                                    <td className="px-6 py-4 text-green-700 font-bold">High (Asset Backed)</td>
                                    <td className="px-6 py-4 text-green-700 font-bold">Low</td>
                                </tr>
                            </tbody>
                        </table>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <YearlyProjectionChart
                        amount={amount}
                        mmRate={metrics.expectedCagr}
                        planName={planName}
                    />
                    <div className="mt-12">
                        <BreakdownTable data={breakdownData} />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../lib/utils';
import { getProjectTotals, type RiskModel, formatCurrencyINR } from '../../lib/financialModel';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

interface RefundSafetySectionProps {
    amount: number;
}

const RISK_MODELS: { id: RiskModel; label: string }[] = [
    { id: 'AGGRESSIVE', label: 'Aggressive' },
    { id: 'MODERATE', label: 'Moderate' },
    { id: 'CONSERVATIVE', label: 'Conservative' },
];

export const RefundSafetySection: React.FC<RefundSafetySectionProps> = ({ amount }) => {
    const [riskModel, setRiskModel] = useState<RiskModel>('MODERATE');

    // Get project totals based on risk model
    const totals = getProjectTotals(riskModel);

    const totalRefundLiability = totals.liabilityInmates;
    const totalAssets = totals.fdPool + totals.currentAssets;
    const safetyBuffer = totals.safetyBuffer;
    const coverageRatio = totalAssets / totalRefundLiability;
    const isShortfall = safetyBuffer < 0;

    // Calculate investor's proportional share (illustrative)
    const investorShareRatio = amount / totalRefundLiability;
    const investorBufferShare = Math.max(0, safetyBuffer * investorShareRatio); // 0 if shortfall

    return (
        <section id="safety" className="py-20 bg-offwhite">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-serif font-bold text-primary mb-4">How Refunds Are Protected</h2>
                    <div className="w-16 h-1 bg-accent mx-auto mb-6" />
                    <p className="text-lg text-secondary/80 max-w-2xl mx-auto">
                        Even in a worst-case shutdown scenario in Year 15, we aim for assets to exceed liabilities.
                    </p>

                    {/* Risk Model Selector */}
                    <div className="mt-8 flex justify-center">
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
                    </div>
                </div>

                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Card className="p-8">
                            <div className="space-y-8">

                                {/* Bar 1: Liability */}
                                <div>
                                    <div className="flex justify-between text-sm font-bold text-secondary mb-2">
                                        <span>Liability – Inmates (Refund Obligation)</span>
                                        <span>{formatCurrencyINR(totalRefundLiability)}</span>
                                    </div>
                                    <div className="h-12 w-full bg-gray-100 rounded-full overflow-hidden relative border border-gray-200">
                                        <div className="h-full bg-risk w-full rounded-full relative flex items-center px-4">
                                            <span className="text-white text-xs font-bold">Max Liability</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Bar 2: Assets */}
                                <div>
                                    <div className="flex justify-between text-sm font-bold text-secondary mb-2">
                                        <span>Assets Available (FD Pool + Current Assets)</span>
                                        <span className={isShortfall ? 'text-red-600' : 'text-primary'}>
                                            {formatCurrencyINR(totalAssets)}
                                        </span>
                                    </div>
                                    <div className="h-12 w-full bg-gray-100 rounded-full overflow-hidden relative border border-gray-200 flex">
                                        {/* Asset Bar Width = (Assets / Liability) * 100, capped at 100% for visual sanity if surplus, but maybe show overflow? 
                                            Let's keep it simple: relative to liability bar which is 100% width.
                                        */}
                                        <div
                                            className={`h-full flex items-center px-4 transition-all duration-500 ${isShortfall ? 'bg-red-500' : 'bg-primary'}`}
                                            style={{ width: `${Math.min(100, coverageRatio * 100)}%` }}
                                        >
                                            <span className="text-white/90 text-xs font-bold">
                                                {isShortfall ? 'Shortfall' : 'Covered'}
                                            </span>
                                        </div>

                                        {/* Surplus Segment if any */}
                                        {!isShortfall && coverageRatio > 1 && (
                                            <div
                                                className="h-full bg-accent flex items-center justify-center relative group cursor-help transition-all duration-500"
                                                style={{ width: `${Math.min(20, (coverageRatio - 1) * 100)}%` }} // Cap visual surplus width
                                            >
                                                <span className="text-primary text-[10px] font-bold px-1">Buffer</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Detailed Cards Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        <div className="text-[10px] text-secondary/60 uppercase tracking-wider mb-1">FD Pool (CA)</div>
                                        <div className="font-bold text-primary text-sm md:text-base">{formatCurrencyINR(totals.fdPool)}</div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        <div className="text-[10px] text-secondary/60 uppercase tracking-wider mb-1">Current Assets</div>
                                        <div className="font-bold text-primary text-sm md:text-base">{formatCurrencyINR(totals.currentAssets)}</div>
                                    </div>
                                    <div className={`p-4 rounded-lg border ${isShortfall ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                                        <div className={`text-[10px] uppercase tracking-wider mb-1 ${isShortfall ? 'text-red-600/60' : 'text-green-700/60'}`}>Safety Buffer</div>
                                        <div className={`font-bold text-sm md:text-base ${isShortfall ? 'text-red-600' : 'text-green-700'}`}>
                                            {isShortfall ? 'SHORTFALL' : formatCurrencyINR(totals.safetyBuffer)}
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                        <div className="text-[10px] text-blue-800/60 uppercase tracking-wider mb-1">Coverage Ratio</div>
                                        <div className="font-bold text-blue-900 text-sm md:text-base">{coverageRatio.toFixed(2)}x</div>
                                    </div>
                                </div>

                                <div className="bg-offwhite rounded-xl p-6 border border-border mt-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isShortfall ? 'bg-red-100 text-red-600' : 'bg-accent/20 text-accent'}`}>
                                            {isShortfall ? <AlertTriangle size={20} /> : <ShieldCheck size={20} />}
                                        </div>
                                        <div>
                                            <h4 className={`font-bold mb-1 ${isShortfall ? 'text-red-700' : 'text-primary'}`}>
                                                {isShortfall ? 'Coverage Shortfall Warning' : 'Safety Cushion Analysis'}
                                            </h4>
                                            <p className="text-sm text-secondary/80 leading-relaxed">
                                                {isShortfall
                                                    ? `Under the ${riskModel.toLowerCase()} model (100% FD), the projected assets of ₹${(totalAssets / 10000000).toFixed(2)} Cr fall short of the ₹61.39 Cr liability. This results in a negative safety buffer.`
                                                    : `Under the ${riskModel.toLowerCase()} model, total liquid assets of ₹${(totalAssets / 10000000).toFixed(2)} Cr would cover maximum refunds of ₹61.39 Cr and still leave a surplus of ₹${(totals.safetyBuffer / 10000000).toFixed(2)} Cr.`
                                                }
                                            </p>

                                            <div className="mt-3 pt-3 border-t border-border/50 flex justify-between items-center">
                                                <div className="text-sm font-medium text-primary">
                                                    Project Dividend Paid: <span className="font-bold">{totals.dividendPaidLabel}</span>
                                                </div>
                                                {!isShortfall && (
                                                    <div className="text-xs text-secondary/60">
                                                        Your share of buffer: <span className="text-accent font-bold">{formatCurrency(investorBufferShare)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </Card>
                    </motion.div>
                </div>
            </div>
        </section >
    );
};

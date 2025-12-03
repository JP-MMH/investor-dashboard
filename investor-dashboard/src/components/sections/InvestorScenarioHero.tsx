import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../lib/utils';
import { Minus, Plus, CheckCircle2, Download } from 'lucide-react';
import { DividendCard } from './DividendCard';
import { generateInvestorPDF } from '../../lib/pdfGenerator';
import {
    calculateYearlyBreakdown,
    formatCurrencyINR,
    PLANS as MODEL_PLANS,
    SCENARIOS,
    PROJECT_IRR_BASE,
    getTotalCommitment,
    getEconomicValueYear15,
    getMoneyMultiple,
    getEquityStakePct,
    getSafetyBufferShare,
    getStrategicSaleTotalValue,
    type PlanType,
    type ScenarioId,
    type SaleMultiple,
} from '../../lib/financialModel';

interface InvestorScenarioHeroProps {
    selectedPlan: PlanType;
    setSelectedPlan: (plan: PlanType) => void;
    lots: number;
    setLots: (lots: number) => void;
}

// UI display data (privileges, schedules) - separate from calculation model
const PLAN_UI_DATA = {
    platinum: {
        name: 'Founding Partner', tier: 'Platinum', price: 3000000, color: '#102333', accent: '#D4B66A',
        privileges: [
            '5 days free stay in Guest House yearly',
            '30% discount on guest room rents',
            '20% discount on family tour packages',
            '1 day free usage of multipurpose hall',
            '15% discount on wellness packages'
        ],
        exitRule: 'Share sale allowed after 5 years, with 6 months’ notice, disbursed in 3 installments.',
        schedule: [
            { installment: '1st', amount: 500000, timing: 'At Joining', type: 'Share Capital' },
            { installment: '2nd', amount: 500000, timing: '+1 month', type: 'Deposit' },
            { installment: '3rd', amount: 500000, timing: '+4 months after 2nd', type: 'Share Capital' },
            { installment: '4th', amount: 500000, timing: '+5 months after 3rd', type: 'Deposit' },
            { installment: '5th', amount: 500000, timing: '+5 months after 4th', type: 'Share Capital' },
            { installment: '6th', amount: 500000, timing: '+6 months after 5th', type: 'Share Capital' },
        ]
    },
    gold: {
        name: 'Core Investor', tier: 'Gold', price: 2000000, color: '#102333', accent: '#D4B66A',
        privileges: [
            '3 days free stay in Guest House yearly',
            '20% discount on guest room rents',
            '15% discount on family tour packages',
            '1 day free usage of multipurpose hall',
            '10% discount on wellness packages'
        ],
        exitRule: 'Share sale allowed after 5 years, with 6 months’ notice, disbursed in 2 installments.',
        schedule: [
            { installment: '1st', amount: 500000, timing: 'At Joining', type: 'Share Capital' },
            { installment: '2nd', amount: 500000, timing: '+2 months after 1st', type: 'Deposit' },
            { installment: '3rd', amount: 500000, timing: '+4 months after 2nd', type: 'Share Capital' },
            { installment: '4th', amount: 500000, timing: '+6 months after 3rd', type: 'Deposit' },
        ]
    },
    silver: {
        name: 'Early Contributor', tier: 'Silver', price: 1000000, color: '#102333', accent: '#D4B66A',
        privileges: [
            '1 day free stay in Guest House yearly',
            '10% discount on guest room rents',
            '10% discount on family tour packages',
            '10% discount on wellness packages'
        ],
        exitRule: 'Share sale allowed after 5 years, with 6 months’ notice.',
        schedule: [
            { installment: '1st', amount: 400000, timing: 'At Joining', type: 'Share Capital' },
            { installment: '2nd', amount: 250000, timing: '+1 month', type: 'Deposit' },
            { installment: '3rd', amount: 350000, timing: '+6 months after 2nd', type: 'Share Capital' },
        ]
    }
};

export const InvestorScenarioHero: React.FC<InvestorScenarioHeroProps> = ({
    selectedPlan, setSelectedPlan,
    lots, setLots
}) => {
    // Scenario state (replaces isShutdown)
    const [scenario, setScenario] = useState<ScenarioId>('base');
    const saleMultiple: SaleMultiple = '10x';  // Default, will add selector UI later

    const planUI = PLAN_UI_DATA[selectedPlan];
    const planModel = MODEL_PLANS[selectedPlan];

    // Calculate scenario-aware metrics
    const totalCommitment = getTotalCommitment(planModel, lots);
    const equityStakePct = getEquityStakePct(planModel, lots);

    // Scenario-specific calculations
    let roiYear15: number;
    let irrDisplay: string;
    let moneyMultiple: number;
    let chipText: string;

    if (scenario === 'base') {
        // Base Case: CA-reviewed model
        roiYear15 = getEconomicValueYear15(planModel, lots);
        irrDisplay = (PROJECT_IRR_BASE * 100).toFixed(2) + '%';  // 9.43%
        moneyMultiple = getMoneyMultiple(planModel, lots);
        chipText = 'Based on CA-reviewed investor return model';
    } else {
        // Strategic Sale: Cash + sale proceeds
        roiYear15 = getStrategicSaleTotalValue(planModel, lots, saleMultiple);
        irrDisplay = '~10–12%';  // Illustrative range
        moneyMultiple = roiYear15 / totalCommitment;
        chipText = 'Exit valuation as per CA assumptions';
    }

    // Calculate Dividends for Card
    const totalInvestment = totalCommitment; // For backward compatibility
    const breakdown = calculateYearlyBreakdown(totalInvestment, selectedPlan, lots, false);
    const totalDividends = breakdown.reduce((sum, row) => sum + row.dividend, 0);
    const avgAnnualDividend = totalDividends / 15;
    const returnPercentage = (totalDividends / totalInvestment) * 100;
    const totalDepositInterest = breakdown.reduce((sum, row) => sum + row.depositInterest, 0);

    const handleDownloadPDF = () => {
        generateInvestorPDF({
            planName: planUI.name,
            lots,
            totalCommitment,
            ownershipPercentage: equityStakePct,
            isShutdown: scenario === 'shutdown',
            roiYear15,
            irr: irrDisplay,
            multiple: moneyMultiple,
            schedule: planUI.schedule,
            breakdown,
            totalDepositInterest,
            totalDividends,
            privileges: planUI.privileges,
            exitRule: planUI.exitRule
        });
    };

    return (
        <section className="relative pt-32 pb-20 overflow-hidden bg-mmh-investor-blue">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2700&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-b from-mmh-investor-blue/90 via-mmh-investor-blue/95 to-mmh-investor-blue" />

            <div className="container-custom relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Left: Plan Selector */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="space-y-4">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl lg:text-5xl font-serif font-bold text-mmh-ivory leading-tight"
                            >
                                Investor Scenario Builder
                            </motion.h1>
                            <p className="text-mmh-ivory/80 text-lg max-w-xl">
                                Select a plan and number of units to see your projected returns, ownership share, and privileges.
                            </p>
                        </div>

                        {/* Plan Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {(Object.keys(PLAN_UI_DATA) as PlanType[]).map((planKey) => (
                                <div
                                    key={planKey}
                                    onClick={() => setSelectedPlan(planKey)}
                                    className={`cursor-pointer relative p-6 rounded-xl transition-all duration-300 ${selectedPlan === planKey
                                        ? 'bg-mmh-investor-blue border-2 border-mmh-gold shadow-2xl transform scale-105'
                                        : 'bg-mmh-investor-blue/10 border border-mmh-investor-blue/20 hover:bg-mmh-investor-blue/20 hover:border-mmh-gold/30'
                                        }`}
                                >
                                    {/* Emblem watermark - only visible on selected card */}
                                    {selectedPlan === planKey && (
                                        <div
                                            className="absolute inset-0 opacity-[0.08] bg-center bg-contain bg-no-repeat rounded-xl pointer-events-none"
                                            style={{ backgroundImage: 'url(/logo-emblem.png)' }}
                                        />
                                    )}

                                    {/* Golden tick marker for selected card */}
                                    {selectedPlan === planKey && (
                                        <div className="absolute -top-3 -right-3 bg-mmh-gold rounded-full p-1.5 shadow-lg z-10">
                                            <CheckCircle2 size={20} className="text-mmh-investor-blue" />
                                        </div>
                                    )}

                                    {/* Card content */}
                                    <div className="relative z-[1]">
                                        <div className={`text-xs uppercase tracking-wider mb-2 ${selectedPlan === planKey ? 'text-mmh-gold/80' : 'text-mmh-investor-blue/60'
                                            }`}>
                                            {PLAN_UI_DATA[planKey].tier}
                                        </div>
                                        <div className={`font-serif font-bold text-lg mb-3 ${selectedPlan === planKey ? 'text-mmh-ivory' : 'text-mmh-investor-blue'
                                            }`}>
                                            {PLAN_UI_DATA[planKey].name}
                                        </div>
                                        <div className={`font-bold text-2xl ${selectedPlan === planKey ? 'text-mmh-gold' : 'text-mmh-investor-blue/70'
                                            }`}>
                                            {formatCurrency(PLAN_UI_DATA[planKey].price)}
                                        </div>
                                        <div className={`text-[10px] mt-1 ${selectedPlan === planKey ? 'text-mmh-ivory/60' : 'text-mmh-investor-blue/40'
                                            }`}>
                                            per unit
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Lots Selector */}
                        <div className="bg-mmh-investor-blue/50 border border-mmh-gold/30 rounded-xl p-6 flex items-center justify-between">
                            <div>
                                <div className="text-mmh-ivory font-bold mb-1">Number of Lots</div>
                                <div className="text-mmh-ivory/60 text-sm">Multiply your investment units</div>
                            </div>
                            <div className="flex items-center gap-4 bg-mmh-investor-blue/80 rounded-lg p-2 border border-mmh-gold/20">
                                <button
                                    onClick={() => setLots(Math.max(1, lots - 1))}
                                    className="p-2 hover:bg-mmh-gold/20 rounded-lg text-mmh-gold transition-colors"
                                    disabled={lots <= 1}
                                >
                                    <Minus size={20} />
                                </button>
                                <div className="w-16 text-center font-bold text-2xl text-mmh-gold">{lots}</div>
                                <button
                                    onClick={() => setLots(lots + 1)}
                                    className="p-2 hover:bg-mmh-gold/20 rounded-lg text-mmh-gold transition-colors"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Metrics Panel */}
                    <div className="lg:col-span-5">
                        <Card className="bg-mmh-investor-blue/95 border-mmh-gold/20 backdrop-blur-sm p-8 relative overflow-hidden rounded-[20px]">
                            {/* Scenario Tabs & Download */}
                            <div className="flex justify-between items-start mb-8">
                                {/* Scenario Tabs - Premium Gold Pills */}
                                <div className="flex gap-3">
                                    {SCENARIOS.map((scenarioOption) => (
                                        <button
                                            key={scenarioOption.id}
                                            onClick={() => setScenario(scenarioOption.id)}
                                            className={`px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${scenario === scenarioOption.id
                                                ? 'bg-mmh-gold text-mmh-investor-blue shadow-lg'
                                                : 'border-2 border-mmh-gold text-mmh-gold hover:bg-mmh-gold/10'
                                                }`}
                                        >
                                            {scenarioOption.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Download Button */}
                                <button
                                    onClick={handleDownloadPDF}
                                    className="flex items-center gap-2 text-mmh-gold hover:text-mmh-ivory transition-colors text-xs font-bold uppercase tracking-wider"
                                >
                                    <Download size={16} />
                                    Download PDF
                                </button>
                            </div>

                            {/* ROI and Metrics */}
                            <div className="relative z-10">
                                <div className="text-mmh-ivory/60 text-sm font-medium mb-2">ROI at Year 15</div>
                                <div className="text-4xl lg:text-5xl font-serif font-bold text-mmh-gold mb-2">
                                    {formatCurrencyINR(roiYear15)}
                                </div>
                                <div className="inline-flex items-center gap-2 bg-mmh-ivory/10 px-3 py-1 rounded-full text-[10px] text-mmh-ivory/80 mb-8">
                                    {chipText}
                                </div>

                                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-mmh-ivory/10">
                                    <div>
                                        <div className="text-mmh-ivory/60 text-xs font-medium mb-1">Target IRR</div>
                                        <div className="text-2xl font-serif font-bold text-mmh-ivory">{irrDisplay}</div>
                                    </div>
                                    <div>
                                        <div className="text-mmh-ivory/60 text-xs font-medium mb-1">Money Multiple</div>
                                        <div className="text-2xl font-serif font-bold text-mmh-ivory">{moneyMultiple.toFixed(2)}x</div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-mmh-ivory/10 flex justify-between items-end">
                                    <div>
                                        <div className="text-mmh-ivory/40 text-[10px] uppercase tracking-wider mb-1">Total Commitment</div>
                                        <div className="text-lg font-bold text-mmh-ivory">{formatCurrencyINR(totalCommitment)}</div>
                                        <div className="text-mmh-gold text-[10px] font-medium mt-1">
                                            Ownership in Project: {equityStakePct.toFixed(2)}% of total equity pool
                                        </div>
                                    </div>
                                </div>

                                {/* Enhanced Metrics (CA-Grade) */}
                                <div className="mt-4 pt-4 border-t border-mmh-ivory/10 space-y-3 text-xs">
                                    {/* Total Cash Distributions */}
                                    <div className="flex justify-between items-center">
                                        <div className="text-mmh-ivory/60">Total Cash Distributed (15 yrs)</div>
                                        <div className="text-mmh-ivory font-bold">
                                            {formatCurrencyINR((planModel.interestTotal + planModel.dividendsTotal + planModel.profitShareTotal) * lots)}
                                        </div>
                                    </div>

                                    {/* Residual Value */}
                                    <div className="flex justify-between items-center">
                                        <div className="text-mmh-ivory/60">Residual Stake Value (Yr 15)</div>
                                        <div className="text-mmh-ivory font-bold">
                                            {formatCurrencyINR(planModel.residualValue * lots)}
                                        </div>
                                    </div>

                                    {/* Safety Buffer Share */}
                                    <div className={`flex justify-between items-center p-2 rounded ${scenario === 'shutdown' ? 'bg-red-500/10 border border-red-500/20' : 'bg-mmh-ivory/5'}`}>
                                        <div className={scenario === 'shutdown' ? 'text-red-300 font-bold' : 'text-mmh-ivory/40 text-[10px]'}>
                                            {scenario === 'shutdown' ? 'Your Share of Safety Surplus' : 'Safety Buffer (if liquidated)'}
                                        </div>
                                        <div className={scenario === 'shutdown' ? 'text-red-200 font-bold' : 'text-mmh-ivory/40'}>
                                            {formatCurrencyINR(getSafetyBufferShare(planModel, lots))}
                                        </div>
                                    </div>

                                    {/* Coverage Ratio (footer note) */}
                                    <div className="pt-2 mt-2 border-t border-mmh-ivory/5">
                                        <div className="text-mmh-ivory/40 text-[10px] leading-relaxed">
                                            <strong className="text-mmh-ivory/60">Resident refund coverage at Year 15:</strong> ₹67.12 Cr assets vs ₹61.39 Cr liabilities (Coverage ratio: 1.09×)
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                <DividendCard
                    breakdown={breakdown}
                    totalDividends={totalDividends}
                    avgAnnualDividend={avgAnnualDividend}
                    returnPercentage={returnPercentage}
                />
            </div>
        </section >
    );
};

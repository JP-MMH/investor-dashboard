import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../lib/utils';
import { Minus, Plus, CheckCircle2, Download, AlertTriangle } from 'lucide-react';
import { DividendCard } from './DividendCard';
import { generateInvestorPDF } from '../../lib/pdfGenerator';
import {
    calculateYearlyBreakdown,
    formatCurrencyINR,
    PLANS as MODEL_PLANS,
    SCENARIOS,
    PROJECT_IRR_BASE,
    TOTAL_EQUITY_POOL,
    RESIDENT_REFUND_LIABILITY,
    FINANCIAL_ASSETS_YEAR15,
    getTotalCommitment,
    getTotalCashDistributions,
    getResidualValue,
    getEconomicValueYear15,
    getMoneyMultiple,
    getEquityStakePct,
    getSafetyBufferShare,
    getStrategicSaleProceeds,
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
        name: 'Founding Partner', tier: 'Platinum', price: 3000000, color: '#103B32', accent: '#CBA35C',
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
        name: 'Core Investor', tier: 'Gold', price: 2000000, color: '#153F35', accent: '#E8D3A3',
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
        name: 'Early Contributor', tier: 'Silver', price: 1000000, color: '#475569', accent: '#94a3b8',
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
    const [saleMultiple, setSaleMultiple] = useState<SaleMultiple>('10x');

    const planUI = PLAN_UI_DATA[selectedPlan];
    const planModel = MODEL_PLANS[selectedPlan];

    // Calculate scenario-aware metrics
    const totalCommitment = getTotalCommitment(planModel, lots);
    const equityStakePct = getEquityStakePct(planModel, lots);
    const totalCashDistributions = getTotalCashDistributions(planModel, lots);
    const residualValue = getResidualValue(planModel, lots);

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

    } else if (scenario === 'shutdown') {
        // Shutdown: Only safety buffer share
        roiYear15 = getSafetyBufferShare(planModel, lots);
        irrDisplay = 'Negative (partial capital recovery)';
        moneyMultiple = roiYear15 / totalCommitment;
        chipText = 'Based on liquidation surplus after full resident refunds';

    } else {
        // Strategic Sale: Cash + sale proceeds
        roiYear15 = getStrategicSaleTotalValue(planModel, lots, saleMultiple);
        irrDisplay = '~10–12%';  // Illustrative range
        moneyMultiple = roiYear15 / totalCommitment;
        chipText = 'Based on assumed strategic exit valuation';
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
        <section className="relative pt-32 pb-20 overflow-hidden bg-primary">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2700&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/95 to-primary" />

            <div className="container-custom relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Left: Plan Selector */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="space-y-4">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl lg:text-5xl font-serif font-bold text-white leading-tight"
                            >
                                Investor Scenario Builder
                            </motion.h1>
                            <p className="text-white/80 text-lg max-w-xl">
                                Select a plan and number of units to see your projected returns, ownership share, and privileges.
                            </p>
                        </div>

                        {/* Plan Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {(Object.keys(PLAN_UI_DATA) as PlanType[]).map((planKey) => (
                                <div
                                    key={planKey}
                                    onClick={() => setSelectedPlan(planKey)}
                                    className={`cursor-pointer relative p-6 rounded-xl border transition-all duration-300 ${selectedPlan === planKey
                                        ? 'shadow-xl transform scale-105'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                        }`}
                                    style={{
                                        backgroundColor: selectedPlan === planKey ? PLAN_UI_DATA[planKey].color : undefined,
                                        borderColor: selectedPlan === planKey ? PLAN_UI_DATA[planKey].accent : 'rgba(255, 255, 255, 0.1)'
                                    }}
                                >
                                    {selectedPlan === planKey && (
                                        <div className="absolute -top-3 -right-3 bg-accent text-primary p-1 rounded-full">
                                            <CheckCircle2 size={20} />
                                        </div>
                                    )}
                                    <div className="text-xs uppercase tracking-wider opacity-70">{PLAN_UI_DATA[planKey].tier}</div>
                                    <div className="font-serif font-bold text-lg">{PLAN_UI_DATA[planKey].name}</div>
                                    <div className="font-bold">{formatCurrency(PLAN_UI_DATA[planKey].price)}</div>
                                    <div className="text-[10px] text-white/40 mt-1">per unit</div>
                                </div>
                            ))}
                        </div>

                        {/* Lots Selector */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-center justify-between">
                            <div>
                                <div className="text-white font-bold mb-1">Number of Lots</div>
                                <div className="text-white/60 text-sm">Multiply your investment units</div>
                            </div>
                            <div className="flex items-center gap-4 bg-black/20 rounded-lg p-2">
                                <button
                                    onClick={() => setLots(Math.max(1, lots - 1))}
                                    className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors"
                                >
                                    <Minus size={20} />
                                </button>
                                <span className="text-2xl font-bold text-white w-8 text-center">{lots}</span>
                                <button
                                    onClick={() => setLots(Math.min(10, lots + 1))}
                                    className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Metrics Panel */}
                    <div className="lg:col-span-5">
                        <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-8 relative overflow-hidden">
                            {/* Toggle & Download */}
                            <div className="flex justify-between items-start mb-6">
                                {/* Scenario Selector */}
                                <div className="flex gap-2 mb-6">
                                    {SCENARIOS.map((scenarioOption) => (
                                        <button
                                            key={scenarioOption.id}
                                            onClick={() => setScenario(scenarioOption.id)}
                                            className={`flex-1 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${scenario === scenarioOption.id
                                                ? scenarioOption.badgeColor === 'danger'
                                                    ? 'bg-red-500 text-white shadow-lg'
                                                    : scenarioOption.badgeColor === 'accent'
                                                        ? 'bg-accent text-primary shadow-lg'
                                                        : 'bg-primary text-white shadow-lg'
                                                : 'bg-white/10 text-white/60 hover:bg-white/20'
                                                }`}
                                        >
                                            {scenarioOption.label}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={handleDownloadPDF}
                                    className="flex items-center gap-2 text-accent hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
                                >
                                    <Download size={16} />
                                    Download PDF
                                </button>
                            </div>

                            {scenario === 'shutdown' && (
                                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                                    <AlertTriangle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-red-200/80 leading-relaxed">
                                        <strong>Shutdown Mode:</strong> Assumes Year 15 closure with full resident refunds and liquidation of financial assets. For illustration only.
                                    </p>
                                </div>
                            )}

                            <div className="relative z-10">
                                <div className="text-white/60 text-sm font-medium mb-2">ROI at Year 15</div>
                                <div className="text-4xl lg:text-5xl font-serif font-bold text-accent mb-2">
                                    {formatCurrencyINR(roiYear15)}
                                </div>
                                <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-[10px] text-white/80 mb-8">
                                    {chipText}
                                </div>

                                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
                                    <div>
                                        <div className="text-white/60 text-xs font-medium mb-1">Target IRR</div>
                                        <div className="text-2xl font-serif font-bold text-white">{irrDisplay}</div>
                                    </div>
                                    <div>
                                        <div className="text-white/60 text-xs font-medium mb-1">Money Multiple</div>
                                        <div className="text-2xl font-serif font-bold text-white">{moneyMultiple.toFixed(2)}x</div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-end">
                                    <div>
                                        <div className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Total Commitment</div>
                                        <div className="text-lg font-bold text-white">{formatCurrencyINR(totalCommitment)}</div>
                                        <div className="text-accent text-[10px] font-medium mt-1">
                                            Ownership in Project: {equityStakePct.toFixed(2)}% of total equity pool
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <DividendCard
                            breakdown={breakdown}
                            totalDividends={totalDividends}
                            avgAnnualDividend={avgAnnualDividend}
                            returnPercentage={returnPercentage}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

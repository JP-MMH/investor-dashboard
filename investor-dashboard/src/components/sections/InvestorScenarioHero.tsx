import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../lib/utils';
import { Minus, Plus, CheckCircle2, Download, AlertTriangle, ShieldCheck } from 'lucide-react';
import { DividendCard } from './DividendCard';
import { generateInvestorPDF } from '../../lib/pdfGenerator';
import {
    calculateYearlyBreakdown,
    formatCurrencyINR,
    SCENARIOS,
    calculateInvestorMetrics,
    getRiskDescription,
    type PlanType,
    type ScenarioId,
    type RiskModel,
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

const RISK_MODELS: { id: RiskModel; label: string }[] = [
    { id: 'AGGRESSIVE', label: 'Aggressive' },
    { id: 'MODERATE', label: 'Moderate' },
    { id: 'CONSERVATIVE', label: 'Conservative' },
];

export const InvestorScenarioHero: React.FC<InvestorScenarioHeroProps> = ({
    selectedPlan, setSelectedPlan,
    lots, setLots
}) => {
    // Scenario state
    const [scenario, setScenario] = useState<ScenarioId>('base');
    const [riskModel, setRiskModel] = useState<RiskModel>('MODERATE');

    const planUI = PLAN_UI_DATA[selectedPlan];

    // Calculate metrics using new CA model
    const metrics = calculateInvestorMetrics(selectedPlan, lots, riskModel);

    // Scenario-specific display values
    let roiYear15: number;
    let irrDisplay: string;
    let moneyMultiple: number;
    let chipText: string;

    if (scenario === 'base') {
        // Base Case: CA-reviewed model
        roiYear15 = metrics.roiYear15;
        irrDisplay = metrics.irrDisplay;
        moneyMultiple = metrics.moneyMultiple;
        chipText = 'CA-reviewed consolidated investor return';
    } else {
        // Shutdown Scenario
        roiYear15 = metrics.shutdownValue;
        irrDisplay = 'Negative';
        moneyMultiple = metrics.shutdownMultiple;
        chipText = 'Conservative stress test (Liquidation)';
    }

    // Calculate Breakdown for Charts (Display Only)
    const breakdown = calculateYearlyBreakdown(metrics.initialInvestment, selectedPlan, lots, riskModel);

    // For Dividend Card (Displaying Total Cash now)
    const totalCashDistributed = metrics.totalCashReceived;
    const avgAnnualCash = totalCashDistributed / 15;
    const returnPercentage = (totalCashDistributed / metrics.initialInvestment) * 100;

    const handleDownloadPDF = () => {
        generateInvestorPDF({
            planName: planUI.name,
            lots,
            totalCommitment: metrics.initialInvestment,
            ownershipPercentage: 0, // Not used in new model display
            isShutdown: scenario === 'shutdown',
            roiYear15,
            irr: irrDisplay,
            multiple: moneyMultiple,
            schedule: planUI.schedule,
            breakdown,
            totalDepositInterest: 0, // merged into total cash
            totalDividends: totalCashDistributed,
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {(Object.keys(PLAN_UI_DATA) as PlanType[]).map((planKey) => (
                                <div
                                    key={planKey}
                                    onClick={() => setSelectedPlan(planKey)}
                                    className={`cursor-pointer relative p-6 rounded-2xl transition-all duration-300 ${selectedPlan === planKey
                                        ? 'bg-mmh-investor-blue border-2 border-mmh-gold shadow-2xl transform scale-105'
                                        : 'bg-mmh-investor-blue/30 border border-mmh-gold/40 hover:bg-mmh-investor-blue/40 hover:border-mmh-gold/60'
                                        }`}
                                >
                                    {/* Emblem watermark - only visible on selected card */}
                                    {selectedPlan === planKey && (
                                        <div
                                            className="absolute inset-0 opacity-[0.08] bg-center bg-contain bg-no-repeat rounded-2xl pointer-events-none"
                                            style={{ backgroundImage: 'url(/logo-emblem.png)' }}
                                        />
                                    )}

                                    {/* Golden tick marker for selected card */}
                                    {selectedPlan === planKey && (
                                        <div className="absolute -top-3 -right-3 bg-mmh-gold rounded-full p-1.5 shadow-lg z-10">
                                            <CheckCircle2 size={20} className="text-mmh-investor-blue" />
                                        </div>
                                    )}

                                    {/* Card content - ALWAYS VISIBLE */}
                                    <div className="relative z-[1]">
                                        <div className={`text-xs uppercase tracking-wider mb-2 font-semibold ${selectedPlan === planKey ? 'text-mmh-gold' : 'text-mmh-gold/80'
                                            }`}>
                                            {PLAN_UI_DATA[planKey].tier}
                                        </div>
                                        <div className={`font-serif font-bold text-lg mb-3 ${selectedPlan === planKey ? 'text-mmh-ivory' : 'text-mmh-ivory/90'
                                            }`}>
                                            {PLAN_UI_DATA[planKey].name}
                                        </div>
                                        <div className={`font-bold text-2xl ${selectedPlan === planKey ? 'text-mmh-gold' : 'text-mmh-gold/85'
                                            }`}>
                                            {formatCurrency(PLAN_UI_DATA[planKey].price)}
                                        </div>
                                        <div className={`text-[10px] mt-1 font-medium ${selectedPlan === planKey ? 'text-mmh-ivory/70' : 'text-mmh-ivory/65'
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
                        <Card className="bg-mmh-investor-blue/95 border-mmh-gold/20 backdrop-blur-sm p-8 relative overflow-hidden rounded-2xl">

                            {/* RISK MODEL SELECTOR */}
                            <div className="mb-6">
                                <div className="text-mmh-ivory/60 text-xs uppercase tracking-wider mb-2 font-semibold">Select Risk Model</div>
                                <div className="flex bg-mmh-investor-blue/50 p-1 rounded-lg border border-mmh-gold/10">
                                    {RISK_MODELS.map((model) => (
                                        <button
                                            key={model.id}
                                            onClick={() => setRiskModel(model.id)}
                                            className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${riskModel === model.id
                                                    ? 'bg-mmh-gold text-mmh-investor-blue shadow-sm'
                                                    : 'text-mmh-ivory/60 hover:text-mmh-ivory hover:bg-mmh-ivory/5'
                                                }`}
                                        >
                                            {model.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-2 text-[10px] text-mmh-ivory/50 text-center italic">
                                    {getRiskDescription(riskModel)}
                                </div>
                            </div>

                            {/* Scenario Tabs & Download - ALIGNED IN ONE ROW */}
                            <div className="flex items-center justify-between gap-4 mb-8">
                                {/* Scenario Tabs - Premium Gold Pills */}
                                <div className="flex gap-2">
                                    {SCENARIOS.map((scenarioOption) => (
                                        <button
                                            key={scenarioOption.id}
                                            onClick={() => setScenario(scenarioOption.id)}
                                            className={`px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${scenario === scenarioOption.id
                                                ? scenarioOption.id === 'shutdown'
                                                    ? 'bg-red-600 text-white shadow-lg'
                                                    : 'bg-mmh-gold text-mmh-investor-blue shadow-lg'
                                                : 'border-2 border-mmh-gold text-mmh-gold hover:bg-mmh-gold/10'
                                                }`}
                                        >
                                            {scenarioOption.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Download Button - SAME HEIGHT AS TABS */}
                                <button
                                    onClick={handleDownloadPDF}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-mmh-gold text-mmh-gold hover:bg-mmh-gold/10 transition-all text-sm font-bold uppercase tracking-wider"
                                >
                                    <Download size={16} />
                                    PDF
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

                                {/* SHUTDOWN WARNING BANNER */}
                                {scenario === 'shutdown' && (
                                    <div className="mb-6 p-3 bg-red-900/40 border border-red-500/30 rounded-lg text-red-200 text-xs leading-relaxed">
                                        <strong>⚠️ Shutdown Scenario:</strong> Shutdown scenario assumes full resident refunds and distribution of residual surplus only. This is a conservative stress test, not a projection.
                                        {metrics.isShortfall && (
                                            <div className="mt-2 font-bold text-red-300 flex items-center gap-1">
                                                <AlertTriangle size={12} />
                                                SHORTFALL DETECTED: Exit due capped by available assets.
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-mmh-ivory/10">
                                    <div>
                                        <div className="text-mmh-ivory/60 text-xs font-medium mb-1">Expected CAGR (CA)</div>
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
                                        <div className="text-lg font-bold text-mmh-ivory">{formatCurrencyINR(metrics.initialInvestment)}</div>
                                    </div>
                                </div>

                                {/* Enhanced Metrics (CA-Grade) */}
                                <div className="mt-4 pt-4 border-t border-mmh-ivory/10 space-y-3 text-xs">
                                    {/* Total Cash Distributions */}
                                    <div className="flex justify-between items-center">
                                        <div className="text-mmh-ivory/60">Total Cash Distributed Over 15 Years (CA Model)</div>
                                        <div className="text-mmh-ivory font-bold">
                                            {/* Cash paid is historical, so it remains same in Shutdown unless specified otherwise, but prompt says "show the same cash paid" */}
                                            {formatCurrencyINR(metrics.totalCashReceived)}
                                        </div>
                                    </div>

                                    {/* Residual Value */}
                                    <div className="flex justify-between items-center">
                                        <div className="text-mmh-ivory/60">Amount Due on Exit (Year 15)</div>
                                        <div className={`font-bold ${scenario === 'shutdown' && metrics.isShortfall ? 'text-red-300' : 'text-mmh-ivory'}`}>
                                            {scenario === 'shutdown' ? formatCurrencyINR(metrics.shutdownValue) : formatCurrencyINR(metrics.residualValue)}
                                        </div>
                                    </div>

                                    {/* Coverage Ratio (footer note) */}
                                    <div className="pt-2 mt-2 border-t border-mmh-ivory/5">
                                        <div className="flex items-center gap-2 mb-1">
                                            <ShieldCheck size={12} className={metrics.coverageRatio >= 1 ? "text-green-500" : "text-red-500"} />
                                            <span className="text-mmh-ivory/60 font-bold">Refund coverage at Year 15</span>
                                        </div>
                                        <div className="text-mmh-ivory/40 text-[10px] leading-relaxed">
                                            Assets vs Liability (Coverage ratio: <span className={metrics.coverageRatio >= 1 ? "text-green-400" : "text-red-400"}>{metrics.coverageRatio.toFixed(2)}×</span>)
                                            {metrics.isShortfall && <span className="text-red-400 ml-1">- SHORTFALL</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Dividend Returns Section - PROPER SPACING */}
                <div className="mt-12">
                    <DividendCard
                        breakdown={breakdown}
                        totalDividends={totalCashDistributed}
                        avgAnnualDividend={avgAnnualCash}
                        returnPercentage={returnPercentage}
                    />
                </div>
            </div>
        </section >
    );
};

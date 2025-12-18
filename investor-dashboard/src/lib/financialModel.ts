/**
 * Financial Model - Investor Scenario Builder
 * STRICT CA-REVIEWED DATA MODEL
 * NO FORMULAS - ONLY LOOKUP TABLES
 */

import {
    getCAOutcome,
    getPlanAmount,
    getProjectTotals,
    getRiskDescription,
    getAllocationSplit,
    type RiskModel,
    type PlanTier,
    type CAOutcome
} from '../data/caModel';

export {
    getCAOutcome,
    getPlanAmount,
    getProjectTotals,
    getRiskDescription,
    getAllocationSplit,
    type RiskModel,
    type PlanTier,
    type CAOutcome
};

// ============================================================================
// CORE DATA MODEL
// ============================================================================

export type PlanType = 'platinum' | 'gold' | 'silver';
export type ScenarioId = 'base' | 'shutdown';

// Re-export types from CA model for convenience
// Types are already exported above

// Mapping between lowercase plan keys and uppercase CA model keys
export const PLAN_KEY_MAP: Record<PlanType, PlanTier> = {
    platinum: 'PLATINUM',
    gold: 'GOLD',
    silver: 'SILVER'
};

export interface Plan {
    id: string;
    label: string;
    unitInvestment: number;       // ₹ per unit
}

export interface ScenarioConfig {
    id: ScenarioId;
    label: string;
    badgeColor?: 'default' | 'danger' | 'accent';
    description: string;
}

// Basic Plan Info (Amounts come from CA Model now)
export const PLANS: Record<PlanType, Plan> = {
    platinum: {
        id: "platinum",
        label: "Platinum – Founding Partner",
        unitInvestment: getPlanAmount('PLATINUM')
    },
    gold: {
        id: "gold",
        label: "Gold – Core Investor",
        unitInvestment: getPlanAmount('GOLD')
    },
    silver: {
        id: "silver",
        label: "Silver – Early Contributor",
        unitInvestment: getPlanAmount('SILVER')
    }
};

// ============================================================================
// PROJECT-LEVEL CONSTANTS
// ============================================================================

// Comparison rates for other instruments (Fixed Assumptions)
export const COMPARISON_RATES = {
    bankFD: 0.06,           // 6% p.a.
    govtBond: 0.07,         // 7% p.a.
    conservativeMF: 0.10,   // 10% p.a.
    aggressiveEquity: 0.13  // 13% p.a.
};

// ============================================================================
// SCENARIO CONFIGURATION
// ============================================================================

export const SCENARIOS: ScenarioConfig[] = [
    {
        id: 'base',
        label: 'Base Case',
        badgeColor: 'default',
        description: 'Project runs as planned for 15 years with CA-reviewed occupancy, returns and distributions.'
    },
    {
        id: 'shutdown',
        label: 'Shutdown (Yr 15)',
        badgeColor: 'danger',
        description: 'Company closes in Year 15, residents fully refunded first, only surplus distributed to investors.'
    }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function formatCurrencyINR(value: number): string {
    return "₹" + Math.round(value).toLocaleString("en-IN");
}

// ============================================================================
// CORE CALCULATION ENGINE (LOOKUP ONLY)
// ============================================================================

export interface InvestorMetrics {
    plan: Plan;
    units: number;
    initialInvestment: number;

    // Base Case Metrics
    roiYear15: number;
    totalCashReceived: number;
    residualValue: number;
    moneyMultiple: number;
    irrDisplay: string;

    // Shutdown Metrics
    shutdownValue: number;
    shutdownMultiple: number;
    isShortfall: boolean;
    coverageRatio: number;

    // Risk Model Info
    riskModel: RiskModel;
    expectedCagr: number;
}

export function calculateInvestorMetrics(
    planKey: PlanType,
    lotsInput: number,
    riskModel: RiskModel = 'MODERATE' // Default to Moderate
): InvestorMetrics {
    const plan = PLANS[planKey];
    const units = Math.max(1, Number(lotsInput) || 1);
    const planTier = PLAN_KEY_MAP[planKey];

    const initialInvestment = plan.unitInvestment * units;

    // Get CA Outcome
    const caOutcome = getCAOutcome(riskModel, planTier, units);
    const projectTotals = getProjectTotals(riskModel);

    // Base Case Lookups
    const roiYear15 = caOutcome.roiYear15;
    const totalCashReceived = caOutcome.totalCashPaid;
    const residualValue = caOutcome.exitDue;
    const moneyMultiple = roiYear15 / initialInvestment;
    const irrDisplay = caOutcome.expectedCagr.toFixed(2) + "%";

    // Shutdown Logic
    // Liquidation Assets = FD Pool + Current Assets
    const liquidationAssets = projectTotals.fdPool + projectTotals.currentAssets;
    const liability = projectTotals.liabilityInmates;
    const safetyBuffer = projectTotals.safetyBuffer;

    const coverageRatio = liquidationAssets / liability;
    const isShortfall = safetyBuffer < 0;

    let shutdownValue: number;

    if (!isShortfall) {
        // If buffer is positive, investor gets full exit due (CA assumption)
        shutdownValue = residualValue;
    } else {
        // If shortfall, cap exit due proportionally
        // maxPayableRatio = liquidationAssets / liability (This logic seems slightly off in prompt vs reality, 
        // usually strictly it's surplus only, but prompt says "apply this ratio to exit due")
        // Prompt: "maxPayableRatio = liquidationAssets / liability ... apply this ratio to exit due"
        const maxPayableRatio = Math.max(0, coverageRatio);
        shutdownValue = residualValue * maxPayableRatio;
    }

    const shutdownMultiple = shutdownValue / initialInvestment;

    return {
        plan,
        units,
        initialInvestment,
        roiYear15,
        totalCashReceived,
        residualValue,
        moneyMultiple,
        irrDisplay,
        shutdownValue,
        shutdownMultiple,
        isShortfall,
        coverageRatio,
        riskModel,
        expectedCagr: caOutcome.expectedCagr
    };
}

// ============================================================================
// OCCUPANCY SENSITIVITY (DISPLAY ONLY)
// ============================================================================

export interface OccupancyScenario {
    label: string;
    color: string;
}

export function getOccupancyScenario(occupancyPercent: number): OccupancyScenario {
    if (occupancyPercent >= 100) return { label: "Optimized", color: "text-green-500" };
    if (occupancyPercent >= 90) return { label: "Strong", color: "text-green-500" };
    if (occupancyPercent >= 80) return { label: "Base", color: "text-blue-500" };
    if (occupancyPercent >= 70) return { label: "Breakeven", color: "text-yellow-500" };
    return { label: "Stress", color: "text-red-500" };
}

// ============================================================================
// YEARLY BREAKDOWN (FOR CHARTS - LINEAR INTERPOLATION FOR DISPLAY)
// ============================================================================

export interface YearlyBreakdownRow {
    year: number;
    mmhValue: number;
    fdValue: number;
    mfValue: number;
    // UI Compatibility Fields
    openingValue: number;
    depositInterest: number;
    dividend: number;
    closingValue: number;
    bondValue: number;
    equityValue: number;
}

export const calculateYearlyBreakdown = (
    _amount: number,
    planKey: PlanType,
    lots: number,
    riskModel: RiskModel = 'MODERATE'
): YearlyBreakdownRow[] => {
    const metrics = calculateInvestorMetrics(planKey, lots, riskModel);

    const breakdown: YearlyBreakdownRow[] = [];
    const initial = metrics.initialInvestment;
    const finalMMH = metrics.roiYear15;
    const totalCash = metrics.totalCashReceived;

    // Calculate CAGR for chart interpolation only
    const mmhCAGR = Math.pow(finalMMH / initial, 1 / 15) - 1;

    // Distribute cash roughly over years 6-15 for display
    const annualCash = totalCash / 10;

    for (let i = 1; i <= 15; i++) {
        const openingValue = initial * Math.pow(1 + mmhCAGR, i - 1);
        const closingValue = initial * Math.pow(1 + mmhCAGR, i);

        // Simple distribution for table display
        const isPayoutYear = i >= 6;
        const dividend = isPayoutYear ? annualCash : 0;

        breakdown.push({
            year: i,
            mmhValue: closingValue,
            fdValue: initial * Math.pow(1 + COMPARISON_RATES.bankFD, i),
            mfValue: initial * Math.pow(1 + COMPARISON_RATES.aggressiveEquity, i),

            // UI Compatibility
            openingValue,
            depositInterest: 0, // Simplified to 0, all in dividend/cash
            dividend,
            closingValue,
            bondValue: initial * Math.pow(1 + COMPARISON_RATES.govtBond, i),
            equityValue: initial * Math.pow(1 + COMPARISON_RATES.aggressiveEquity, i)
        });
    }

    return breakdown;
};

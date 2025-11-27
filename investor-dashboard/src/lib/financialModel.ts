/**
 * Financial Model - Wrapper around investorEngine
 * Maps UI concepts to CA plan calculations
 */

import {
    computeInvestorScenario,
    calculateFDScenario,
    calculateMFScenario,
    type ShareClass,
    PROJECT_CONSTANTS,
} from '../utils/investorEngine';

// Re-export for compatibility
export type PlanType = 'platinum' | 'gold' | 'silver';

export interface YearlyBreakdownRow {
    year: number;
    openingValue: number;
    depositInterest: number;
    dividend: number;
    closingValue: number;
    fdValue: number;
    bondValue: number;
    mfValue: number;
    equityValue: number;
}

// Map UI plan types to ShareClass
const mapPlanToShareClass = (plan: PlanType): ShareClass => {
    switch (plan) {
        case 'platinum':
            return 'PLATINUM';
        case 'gold':
            return 'GOLD';
        case 'silver':
            return 'SILVER';
    }
};

/**
 * Calculate yearly breakdown using CA plan formulas
 * @param amount Total investment amount (principal × lots)
 * @param plan Share class (platinum/gold/silver)
 * @param lots Number of shares
 * @param isShutdown Not used in CA plan, kept for compatibility
 */
export const calculateYearlyBreakdown = (
    amount: number,
    plan: PlanType,
    lots: number,
    _isShutdown: boolean  // Kept for API compatibility but not used in CA plan
): YearlyBreakdownRow[] => {
    const shareClass = mapPlanToShareClass(plan);

    // Get investor scenario from CA engine
    const scenario = computeInvestorScenario({
        shareClass,
        numberOfShares: lots,
        horizonYears: 15,
    });

    // Calculate FD and MF scenarios for comparison
    const fdScenario = calculateFDScenario(amount, 15, PROJECT_CONSTANTS.FD_RATE);
    const mfScenario = calculateMFScenario(amount, 15, PROJECT_CONSTANTS.MF_RATE);

    // Bond rate (7%) and Equity rate (13%) for other comparisons
    const bondScenario = calculateFDScenario(amount, 15, 0.07);
    const equityScenario = calculateMFScenario(amount, 15, 0.13);

    const breakdown: YearlyBreakdownRow[] = [];

    // For each year, build the breakdown
    for (let i = 1; i <= 15; i++) {
        const yearIndex = i - 1;

        // From CA plan: all dividends/interest paid at year 15
        const depositInterest = i === 15 ? scenario.cashFlowsByYear.yearlyInterest[yearIndex] : 0;
        const dividend = i === 15 ? scenario.cashFlowsByYear.yearlyDividends[yearIndex] : 0;

        // Opening value (year 0 is the investment, subsequent years grow by IRR)
        const openingValue = i === 1 ? amount : amount * Math.pow(1 + scenario.irr, i - 1);

        // Closing value at year i
        // For visualization, show growth trajectory even though cash paid at end
        let closingValue: number;
        if (i === 15) {
            // Final year: actual total value including all cash
            closingValue = scenario.totalReturn;
        } else {
            // Intermediate years: show principal growing at IRR
            closingValue = amount * Math.pow(1 + scenario.irr, i);
        }

        breakdown.push({
            year: i,
            openingValue,
            depositInterest,
            dividend,
            closingValue,
            fdValue: fdScenario.yearlyValues[yearIndex],
            bondValue: bondScenario.yearlyValues[yearIndex],
            mfValue: mfScenario.yearlyValues[yearIndex],
            equityValue: equityScenario.yearlyValues[yearIndex],
        });
    }

    return breakdown;
};

/**
 * Calculate shutdown metrics (not part of CA plan, kept for compatibility)
 * In CA plan, the surplus and capital are already accounted for in the scenario
 */
export const calculateShutdownMetrics = (amount: number) => {
    // This function is for UI display only, not used in CA calculations
    const SHUTDOWN_SURPLUS = 57_300_000;
    const SHUTDOWN_WDV = 393_000_000;
    const TOTAL_EQUITY_POOL = 200_000_000;

    const ownershipShare = amount / TOTAL_EQUITY_POOL;
    const shareOfSurplus = SHUTDOWN_SURPLUS * ownershipShare;
    const shareOfWDV = SHUTDOWN_WDV * ownershipShare;
    const totalShutdownValue = shareOfSurplus + shareOfWDV;

    return {
        shareOfSurplus,
        shareOfWDV,
        totalShutdownValue,
    };
};

/**
 * Get total return and IRR for display
 */
export const getInvestorMetrics = (plan: PlanType, lots: number) => {
    const shareClass = mapPlanToShareClass(plan);

    const scenario = computeInvestorScenario({
        shareClass,
        numberOfShares: lots,
        horizonYears: 15,
    });

    return {
        totalInvested: scenario.totalInvested,
        totalDividends: scenario.totalDividends,
        totalInterest: scenario.totalInterest,
        totalCashDuringTerm: scenario.totalCashInHandDuringTerm,
        netWorthAtYear15: scenario.finalNetWorthAtHorizon,
        totalReturn: scenario.totalReturn,
        irr: scenario.irr,
        irrPercent: (scenario.irr * 100).toFixed(2),
    };
};

/**
 * Investor Calculation Engine
 * Single source of truth for all investor calculations
 * Based on Chartered Accountant's Investor Return Plan
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ShareClass = 'PLATINUM' | 'GOLD' | 'SILVER';

export interface SharePlanConstants {
    principal: number;          // Initial investment per share
    interestTotal: number;      // Total interest over 15 years
    dividendTotal: number;      // Total dividends over 15 years
    surplusAtYear15: number;    // Share of surplus at year 15
    irr: number;                // Internal rate of return
}

export interface InvestorInput {
    shareClass: ShareClass;
    numberOfShares: number;
    horizonYears: number;       // Investment horizon (default 15)
    appreciationRate?: number;  // Optional asset appreciation % (default 0)
}

export interface CashFlowBreakdown {
    yearlyDividends: number[];      // Annual dividend payments
    yearlyInterest: number[];       // Annual interest payments
    finalCapitalReturn: number;     // Capital returned at horizon
    finalSurplusShare: number;      // Share of surplus at horizon
}

export interface InvestorOutput {
    totalInvested: number;
    totalDividends: number;
    totalInterest: number;
    totalCashInHandDuringTerm: number;
    finalNetWorthAtHorizon: number;
    totalReturn: number;
    irr: number;
    cashFlowsByYear: CashFlowBreakdown;
}

// ============================================================================
// BASELINE CONSTANTS FROM CA PLAN
// ============================================================================

// Project-level constants
export const PROJECT_CONSTANTS = {
    PROJECT_COST: 664_872_000,
    SHARE_CAPITAL: 200_000_000,
    ADVANCE_FROM_INMATES: 671_000_000,
    PROFIT_15_YEARS: 681_006_479,
    INCOME_TAX_PAID: 170_251_620,
    NET_PROFIT_AFTER_TAX: 510_754_859,
    DIVIDEND_PAID_15_YEARS: 370_000_000,
    RESERVE_SURPLUS_YEAR_15: 140_754_859,

    // Financial instruments
    FD_RATE: 0.06,  // 6% p.a.
    MF_RATE: 0.14,  // 14% p.a.

    // Year 15 position
    FD_BALANCE_YEAR_15: 181_601_640,
    MF_BALANCE_YEAR_15: 433_048_710,
    TOTAL_FINANCIAL_ASSETS: 614_650_350,
    REFUNDABLE_DEPOSIT: 613_850_000,
    NET_AVAILABLE_AFTER_DEPOSITS: 800_350,
    NET_CURRENT_ASSETS: 4_261_691,
    FIXED_ASSETS_WDV: 335_692_818,
    TOTAL_SHAREHOLDER_AMOUNT: 340_754_859,
};

// Share class distribution
export const BASELINE_DISTRIBUTION = {
    PLATINUM: { count: 40, capitalPerShare: 3_000_000, totalCapital: 120_000_000 },
    GOLD: { count: 30, capitalPerShare: 2_000_000, totalCapital: 60_000_000 },
    SILVER: { count: 20, capitalPerShare: 1_000_000, totalCapital: 20_000_000 },
};

// Per-share constants for each class (15-year baseline)
const SHARE_CONSTANTS: Record<ShareClass, SharePlanConstants> = {
    PLATINUM: {
        principal: 3_000_000,
        interestTotal: 400_000,
        dividendTotal: 5_550_000,
        surplusAtYear15: 2_068_023,
        irr: 0.0906,  // 9.06%
    },
    GOLD: {
        principal: 2_000_000,
        interestTotal: 200_000,
        dividendTotal: 3_700_000,
        surplusAtYear15: 1_445_348,
        irr: 0.0906,
    },
    SILVER: {
        principal: 1_000_000,
        interestTotal: 100_000,
        dividendTotal: 1_850_000,
        surplusAtYear15: 722_674,
        irr: 0.0906,
    },
};

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Get share plan constants for a given share class
 */
export function getSharePlanConstants(shareClass: ShareClass): SharePlanConstants {
    return SHARE_CONSTANTS[shareClass];
}

/**
 * Build baseline cash flows for an investor
 * Based on CA plan: All cash (dividends + interest) is paid at END of horizon,
 * not as annual payments. This gives the stated IRR of 9.06%.
 */
export function buildBaselineCashFlows(
    shareClass: ShareClass,
    numberOfShares: number,
    horizonYears: number
): CashFlowBreakdown {
    const constants = getSharePlanConstants(shareClass);

    // For the CA plan, dividends and interest are NOT distributed annually
    // They are paid as a lump sum at the end of the 15-year period
    // This structure gives the 9.06% IRR

    const effectiveHorizon = Math.min(horizonYears, 15);

    // Create arrays with zeros for annual payments
    const yearlyDividends: number[] = new Array(effectiveHorizon).fill(0);
    const yearlyInterest: number[] = new Array(effectiveHorizon).fill(0);

    // All dividends and interest are paid in the final year
    if (effectiveHorizon > 0) {
        yearlyDividends[effectiveHorizon - 1] = constants.dividendTotal * numberOfShares;
        yearlyInterest[effectiveHorizon - 1] = constants.interestTotal * numberOfShares;
    }

    // Final capital and surplus
    const finalCapitalReturn = constants.principal * numberOfShares;
    const finalSurplusShare = horizonYears >= 15
        ? constants.surplusAtYear15 * numberOfShares
        : (constants.surplusAtYear15 * numberOfShares * horizonYears) / 15;  // Pro-rata for shorter horizons

    return {
        yearlyDividends,
        yearlyInterest,
        finalCapitalReturn,
        finalSurplusShare,
    };
}

/**
 * Calculate IRR using Newton-Raphson method
 * @param cashflows Array of cash flows (negative = outflow, positive = inflow)
 * @returns IRR as decimal (e.g., 0.0906 for 9.06%)
 */
export function calculateIRR(cashflows: number[]): number {
    const maxIterations = 100;
    const tolerance = 1e-7;

    // Initial guess
    let rate = 0.1;

    for (let i = 0; i < maxIterations; i++) {
        let npv = 0;
        let derivative = 0;

        for (let t = 0; t < cashflows.length; t++) {
            const discountFactor = Math.pow(1 + rate, t);
            npv += cashflows[t] / discountFactor;
            derivative -= (t * cashflows[t]) / Math.pow(1 + rate, t + 1);
        }

        if (Math.abs(npv) < tolerance) {
            return rate;
        }

        // Newton-Raphson update
        rate = rate - npv / derivative;

        // Bounds check
        if (rate < -0.99) rate = -0.99;
        if (rate > 10) rate = 10;
    }

    return rate;  // Return best estimate even if not fully converged
}

/**
 * Compute complete investor scenario
 */
export function computeInvestorScenario(input: InvestorInput): InvestorOutput {
    const constants = getSharePlanConstants(input.shareClass);
    const cashFlows = buildBaselineCashFlows(
        input.shareClass,
        input.numberOfShares,
        input.horizonYears
    );

    // Calculate totals
    const totalInvested = constants.principal * input.numberOfShares;
    const totalDividends = cashFlows.yearlyDividends.reduce((sum, val) => sum + val, 0);
    const totalInterest = cashFlows.yearlyInterest.reduce((sum, val) => sum + val, 0);
    const totalCashInHandDuringTerm = totalDividends + totalInterest;
    const finalNetWorthAtHorizon = cashFlows.finalCapitalReturn + cashFlows.finalSurplusShare;

    // Total return = cash during term + value at end
    const totalReturn = totalCashInHandDuringTerm + finalNetWorthAtHorizon;

    // Build cash flow array for IRR calculation
    // Year 0: Initial investment (negative)
    // Years 1-14: Annual dividend + interest
    // Year 15: Annual dividend + interest + capital return + surplus
    const irrCashflows: number[] = [-totalInvested];

    const effectiveHorizon = Math.min(input.horizonYears, cashFlows.yearlyDividends.length);

    for (let year = 1; year <= effectiveHorizon; year++) {
        const yearIndex = year - 1;
        const annualDividend = cashFlows.yearlyDividends[yearIndex] || 0;
        const annualInterest = cashFlows.yearlyInterest[yearIndex] || 0;

        if (year === effectiveHorizon) {
            // Final year: regular cash flow + return of capital + surplus
            irrCashflows.push(
                annualDividend +
                annualInterest +
                cashFlows.finalCapitalReturn +
                cashFlows.finalSurplusShare
            );
        } else {
            // Regular year: just annual dividend and interest
            irrCashflows.push(annualDividend + annualInterest);
        }
    }

    const irr = calculateIRR(irrCashflows);

    return {
        totalInvested,
        totalDividends,
        totalInterest,
        totalCashInHandDuringTerm,
        finalNetWorthAtHorizon,
        totalReturn,
        irr,
        cashFlowsByYear: cashFlows,
    };
}

/**
 * Compute project-wide aggregates for multiple investors
 */
export interface ProjectAggregates {
    totalCapital: number;
    totalDividends: number;
    totalInterest: number;
    totalCashDistributed: number;
    totalShareholderNetWorth: number;
}

export function computeProjectAggregates(scenarios: InvestorOutput[]): ProjectAggregates {
    return scenarios.reduce(
        (agg, scenario) => ({
            totalCapital: agg.totalCapital + scenario.totalInvested,
            totalDividends: agg.totalDividends + scenario.totalDividends,
            totalInterest: agg.totalInterest + scenario.totalInterest,
            totalCashDistributed: agg.totalCashDistributed + scenario.totalCashInHandDuringTerm,
            totalShareholderNetWorth: agg.totalShareholderNetWorth + scenario.finalNetWorthAtHorizon,
        }),
        {
            totalCapital: 0,
            totalDividends: 0,
            totalInterest: 0,
            totalCashDistributed: 0,
            totalShareholderNetWorth: 0,
        }
    );
}

/**
 * Calculate FD (Fixed Deposit) comparison scenario
 * @param principal Initial investment
 * @param years Investment horizon
 * @param rate Annual interest rate (default 6%)
 */
export function calculateFDScenario(principal: number, years: number, rate: number = PROJECT_CONSTANTS.FD_RATE) {
    const yearlyValues: number[] = [];
    let balance = principal;

    for (let i = 1; i <= years; i++) {
        balance = balance * (1 + rate);
        yearlyValues.push(balance);
    }

    return {
        finalValue: balance,
        yearlyValues,
        totalReturn: balance - principal,
    };
}

/**
 * Calculate MF (Mutual Fund) comparison scenario
 * @param principal Initial investment
 * @param years Investment horizon
 * @param rate Annual return rate (default 14%)
 */
export function calculateMFScenario(principal: number, years: number, rate: number = PROJECT_CONSTANTS.MF_RATE) {
    const yearlyValues: number[] = [];
    let balance = principal;

    for (let i = 1; i <= years; i++) {
        balance = balance * (1 + rate);
        yearlyValues.push(balance);
    }

    return {
        finalValue: balance,
        yearlyValues,
        totalReturn: balance - principal,
    };
}

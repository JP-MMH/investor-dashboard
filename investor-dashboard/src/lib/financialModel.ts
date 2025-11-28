/**
 * Financial Model - Investor Scenario Builder
 * New model with 8.45% compound rate and updated plan structures
 */

// ============================================================================
// CORE DATA MODEL
// ============================================================================

export type PlanType = 'platinum' | 'gold' | 'silver';

export interface Plan {
    id: string;
    label: string;
    unitInvestment: number;      // Investment per lot
    roi15: number;               // Value at year 15 (compounded at 8.45%)
    interestTotal: number;       // Total interest over 15 years
    dividendTotal: number;       // Total dividends over 15 years
    profitShareTotal: number;    // Total profit share over 15 years
    residualValue: number;       // Remaining value in company at Y15
    years: number;               // Investment horizon
    assumedRate: number;         // Annual compound rate (8.45%)
}

export const PLANS: Record<PlanType, Plan> = {
    platinum: {
        id: "platinum",
        label: "Platinum – Founding Partner",
        unitInvestment: 3000000,      // ₹30,00,000 per lot
        roi15: 10128955,              // ₹1,01,28,955 at year 15
        interestTotal: 400000,        // ₹4,00,000 total interest
        dividendTotal: 4170000,       // ₹41,70,000 total dividends
        profitShareTotal: 4570000,    // ₹45,70,000 total profit share
        residualValue: 2558955,       // ₹25,58,955 residual
        years: 15,
        assumedRate: 0.0845          // 8.45% p.a.
    },
    gold: {
        id: "gold",
        label: "Gold – Core Investor",
        unitInvestment: 2000000,      // ₹20,00,000
        roi15: 6752636,               // ₹67,52,636
        interestTotal: 200000,        // ₹2,00,000
        dividendTotal: 2780000,       // ₹27,80,000
        profitShareTotal: 2980000,    // ₹29,80,000
        residualValue: 1772636,       // ₹17,72,636
        years: 15,
        assumedRate: 0.0845
    },
    silver: {
        id: "silver",
        label: "Silver – Early Contributor",
        unitInvestment: 1000000,      // ₹10,00,000
        roi15: 3376318,               // ₹33,76,318
        interestTotal: 100000,        // ₹1,00,000
        dividendTotal: 1390000,       // ₹13,90,000
        profitShareTotal: 1490000,    // ₹14,90,000
        residualValue: 886318,        // ₹8,86,318
        years: 15,
        assumedRate: 0.0845
    }
};

// ============================================================================
// PROJECT-LEVEL CONSTANTS
// ============================================================================

export const EQUITY_POOL = 2000000000;              // ₹20 Cr total equity
export const RESIDENT_REFUND_OBLIGATION = 6138000000; // ₹61.38 Cr
export const FINANCIAL_ASSETS_AT_15 = 6712000000;     // ₹67.12 Cr (FD + MF + cash)

// Comparison rates for other instruments
export const COMPARISON_RATES = {
    bankFD: 0.06,           // 6% p.a.
    govtBond: 0.07,         // 7% p.a.
    conservativeMF: 0.10,   // 10% p.a.
    aggressiveEquity: 0.13  // 13% p.a.
};

// Asset allocation percentages
export const ALLOCATION = {
    fd: 0.44,    // 44%
    mf: 0.55,    // 55%
    cash: 0.01   // 1%
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format amount in Indian Rupees with proper number formatting
 * @param value Amount to format
 * @returns Formatted string like ₹10,00,000
 */
export function formatCurrencyINR(value: number): string {
    return "₹" + Math.round(value).toLocaleString("en-IN");
}

/**
 * Build dividend schedule for a plan
 * No dividends in Years 1-5, equal annual dividends Years 6-15
 * @param plan Plan configuration
 * @returns Array of 15 values (index 0 = Year 1)
 */
export function buildDividendSchedule(plan: Plan): number[] {
    const years = plan.years; // 15
    const schedule = new Array(years).fill(0); // index 0 = year 1

    const startYear = 6;
    const dividendYears = years - startYear + 1; // 10 years (6-15)
    const perYear = plan.dividendTotal / dividendYears;

    for (let y = startYear; y <= years; y++) {
        schedule[y - 1] = perYear;
    }
    return schedule;
}

// Pre-build dividend schedules for all plans
export const DIVIDENDS_BY_PLAN: Record<PlanType, number[]> = {
    platinum: buildDividendSchedule(PLANS.platinum),
    gold: buildDividendSchedule(PLANS.gold),
    silver: buildDividendSchedule(PLANS.silver)
};

// ============================================================================
// CORE CALCULATION ENGINE
// ============================================================================

export interface InvestorMetrics {
    plan: Plan;
    units: number;
    initialInvestment: number;
    year15Value: number;
    interestTotal: number;
    dividendTotal: number;
    profitShareTotal: number;
    totalCashReceived: number;
    residualValue: number;
    cashMultiple: number;
    economicMultiple: number;
    approxAnnualReturnCash: number;
    approxAnnualReturnEconomic: number;
}

/**
 * Calculate all investor metrics for given plan and number of lots
 * @param planKey Plan type (platinum/gold/silver)
 * @param lotsInput Number of lots/units
 * @returns Complete metrics object
 */
export function calculateInvestorMetrics(
    planKey: PlanType,
    lotsInput: number
): InvestorMetrics {
    const plan = PLANS[planKey];
    const units = Math.max(1, Number(lotsInput) || 1); // at least 1

    const initialInvestment = plan.unitInvestment * units;

    // Notional value of share capital at year 15 (compounded at 8.45%)
    const year15Value = plan.roi15 * units;

    // Cash flows over 15 years
    const interestTotal = plan.interestTotal * units;
    const dividendTotal = plan.dividendTotal * units;
    const profitShareTotal = plan.profitShareTotal * units;

    const totalCashReceived = interestTotal + dividendTotal + profitShareTotal;

    // Residual value still in the company at year 15
    const residualValue = plan.residualValue * units;

    // Multiples
    const cashMultiple = totalCashReceived / initialInvestment;
    const economicMultiple = (totalCashReceived + residualValue) / initialInvestment;

    const n = plan.years;
    const approxAnnualReturnCash = Math.pow(cashMultiple, 1 / n) - 1;
    const approxAnnualReturnEconomic = Math.pow(economicMultiple, 1 / n) - 1;

    return {
        plan,
        units,
        initialInvestment,
        year15Value,
        interestTotal,
        dividendTotal,
        profitShareTotal,
        totalCashReceived,
        residualValue,
        cashMultiple,
        economicMultiple,
        approxAnnualReturnCash,
        approxAnnualReturnEconomic
    };
}

// ============================================================================
// OCCUPANCY SENSITIVITY
// ============================================================================

export interface OccupancyScenario {
    label: string;
    irrRange: string;
    coverage: string;
}

/**
 * Map occupancy percentage to scenario details
 * @param occupancyPercent Occupancy rate (0-100)
 * @returns Scenario details
 */
export function getOccupancyScenario(occupancyPercent: number): OccupancyScenario {
    const o = occupancyPercent;

    if (o >= 90) {
        return {
            label: "Safe",
            irrRange: "8.5–9.0%",
            coverage: "≥ 1.10× resident refunds"
        };
    } else if (o >= 80) {
        return {
            label: "Caution",
            irrRange: "7.0–8.5%",
            coverage: "≈ 1.00–1.10× resident refunds"
        };
    } else if (o >= 70) {
        return {
            label: "Stress",
            irrRange: "5.0–7.0%",
            coverage: "≈ 0.95–1.00× resident refunds"
        };
    } else {
        return {
            label: "High Risk",
            irrRange: "< 5.0%",
            coverage: "< 0.95× resident refunds"
        };
    }
}

// ============================================================================
// COMPARISON SCENARIOS
// ============================================================================

export interface ComparisonSeries {
    label: string;
    values: number[];  // Values for years 1-15
}

/**
 * Generate comparison data for all instruments
 * @param initialInvestment Starting investment amount
 * @param years Investment horizon (15)
 * @returns Series for each instrument including Mater Maria
 */
export function generateComparisonSeries(
    initialInvestment: number,
    years: number,
    planKey: PlanType
): Record<string, ComparisonSeries> {
    const plan = PLANS[planKey];

    // Mater Maria (8.45% compound)
    const mmhValues: number[] = [];
    for (let y = 1; y <= years; y++) {
        mmhValues.push(initialInvestment * Math.pow(1 + plan.assumedRate, y));
    }

    // Bank FD (6%)
    const fdValues: number[] = [];
    for (let y = 1; y <= years; y++) {
        fdValues.push(initialInvestment * Math.pow(1 + COMPARISON_RATES.bankFD, y));
    }

    // Govt Bonds (7%)
    const bondValues: number[] = [];
    for (let y = 1; y <= years; y++) {
        bondValues.push(initialInvestment * Math.pow(1 + COMPARISON_RATES.govtBond, y));
    }

    // Conservative MF (10%)
    const mfValues: number[] = [];
    for (let y = 1; y <= years; y++) {
        mfValues.push(initialInvestment * Math.pow(1 + COMPARISON_RATES.conservativeMF, y));
    }

    // Aggressive Equity (13%)
    const equityValues: number[] = [];
    for (let y = 1; y <= years; y++) {
        equityValues.push(initialInvestment * Math.pow(1 + COMPARISON_RATES.aggressiveEquity, y));
    }

    return {
        materMaria: { label: "Mater Maria", values: mmhValues },
        bankFD: { label: "Bank FD", values: fdValues },
        govtBond: { label: "Govt Bonds", values: bondValues },
        conservativeMF: { label: "Conservative MF", values: mfValues },
        aggressiveEquity: { label: "Aggressive Equity", values: equityValues }
    };
}

// ============================================================================
// YEARLY BREAKDOWN (for tables/charts)
// ============================================================================

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

/**
 * Calculate yearly breakdown for display
 * @param amount Total investment
 * @param plan Plan type
 * @param lots Number of lots
 * @param _isShutdown Kept for compatibility, not used
 * @returns Array of yearly breakdown data
 */
export const calculateYearlyBreakdown = (
    amount: number,
    plan: PlanType,
    lots: number,
    _isShutdown: boolean  // Kept for API compatibility
): YearlyBreakdownRow[] => {
    const comparison = generateComparisonSeries(amount, 15, plan);
    const metrics = calculateInvestorMetrics(plan, lots);
    const dividendSchedule = DIVIDENDS_BY_PLAN[plan];

    const breakdown: YearlyBreakdownRow[] = [];

    for (let i = 1; i <= 15; i++) {
        const yearIndex = i - 1;

        // Interest and dividends based on schedule
        const depositInterest = (metrics.interestTotal / 15); // Spread evenly for display
        const dividend = dividendSchedule[yearIndex] * lots;

        // Opening and closing values
        const openingValue = i === 1 ? amount : amount * Math.pow(1.0845, i - 1);
        const closingValue = amount * Math.pow(1.0845, i);

        breakdown.push({
            year: i,
            openingValue,
            depositInterest,
            dividend,
            closingValue: i === 15 ? metrics.year15Value : closingValue,
            fdValue: comparison.bankFD.values[yearIndex],
            bondValue: comparison.govtBond.values[yearIndex],
            mfValue: comparison.conservativeMF.values[yearIndex],
            equityValue: comparison.aggressiveEquity.values[yearIndex],
        });
    }

    return breakdown;
};

/**
 * Get investor metrics (wrapper for compatibility)
 */
export const getInvestorMetrics = (plan: PlanType, lots: number) => {
    const metrics = calculateInvestorMetrics(plan, lots);

    return {
        totalInvested: metrics.initialInvestment,
        totalDividends: metrics.dividendTotal,
        totalInterest: metrics.interestTotal,
        totalCashDuringTerm: metrics.totalCashReceived,
        netWorthAtYear15: metrics.year15Value,
        totalReturn: metrics.year15Value,
        irr: metrics.approxAnnualReturnEconomic,
        irrPercent: (metrics.approxAnnualReturnEconomic * 100).toFixed(2),
    };
};

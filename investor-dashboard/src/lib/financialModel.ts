/**
 * Financial Model - Investor Scenario Builder
 * New model with 8.45% compound rate and updated plan structures
 */

// ============================================================================
// CORE DATA MODEL
// ============================================================================

export type PlanType = 'platinum' | 'gold' | 'silver';
export type PlanId = PlanType;  // Alias for consistency

// Scenario types
export type ScenarioId = 'base' | 'shutdown' | 'strategicSale';
export type SaleMultiple = '8x' | '10x' | '12x';

export interface Plan {
    id: string;
    label: string;
    unitInvestment: number;       // ₹ per unit
    equitySharePct: number;       // % of total equity per 1 unit
    finalValueYear15: number;     // compounded at 8.45% for 15 yrs
    interestTotal: number;        // total interest over 15 yrs
    dividendsTotal: number;       // total dividends over 15 yrs (renamed from dividendTotal)
    profitShareTotal: number;     // total profit share over 15 yrs
    residualValue: number;        // residual stake at Yr 15
    years: number;                // Investment horizon (15)
    assumedRate: number;          // Annual compound rate (8.45%)
}

export interface ScenarioConfig {
    id: ScenarioId;
    label: string;
    badgeColor?: 'default' | 'danger' | 'accent';
    description: string;
}

export const PLANS: Record<PlanType, Plan> = {
    platinum: {
        id: "platinum",
        label: "Platinum – Founding Partner",
        unitInvestment: 3000000,       // ₹30,00,000 per lot
        equitySharePct: 1.5,           // 1.5% of equity pool per unit
        finalValueYear15: 10128955,    // ₹1,01,28,955 at year 15 (8.45% compound)
        interestTotal: 400000,         // ₹4,00,000 total interest
        dividendsTotal: 4170000,       // ₹41,70,000 total dividends
        profitShareTotal: 4570000,     // ₹45,70,000 total profit share
        residualValue: 2558955,        // ₹25,58,955 residual
        years: 15,
        assumedRate: 0.0845           // 8.45% p.a.
    },
    gold: {
        id: "gold",
        label: "Gold – Core Investor",
        unitInvestment: 2000000,       // ₹20,00,000
        equitySharePct: 1.0,           // 1.0% of equity pool per unit
        finalValueYear15: 6752636,     // ₹67,52,636
        interestTotal: 200000,         // ₹2,00,000
        dividendsTotal: 2780000,       // ₹27,80,000
        profitShareTotal: 2980000,     // ₹29,80,000
        residualValue: 1772636,        // ₹17,72,636
        years: 15,
        assumedRate: 0.0845
    },
    silver: {
        id: "silver",
        label: "Silver – Early Contributor",
        unitInvestment: 1000000,       // ₹10,00,000
        equitySharePct: 0.5,           // 0.5% of equity pool per unit
        finalValueYear15: 3376318,     // ₹33,76,318
        interestTotal: 100000,         // ₹1,00,000
        dividendsTotal: 1390000,       // ₹13,90,000
        profitShareTotal: 1490000,     // ₹14,90,000
        residualValue: 886318,         // ₹8,86,318
        years: 15,
        assumedRate: 0.0845
    }
};

// ============================================================================
// PROJECT-LEVEL CONSTANTS
// ============================================================================

export const TOTAL_EQUITY_POOL = 2000000000;              // ₹20 Cr total equity pool
export const SURPLUS_AFTER_RESIDENT_REFUNDS = 57300000;   // ₹5.73 Cr surplus
export const RESIDENT_REFUND_LIABILITY = 6139000000;      // ₹61.39 Cr
export const FINANCIAL_ASSETS_YEAR15 = 6712000000;        // ₹67.12 Cr (FD + MF + cash)
export const PROJECT_IRR_BASE = 0.0943;                   // 9.43% base case IRR

// Legacy aliases for backward compatibility
export const EQUITY_POOL = TOTAL_EQUITY_POOL;
export const RESIDENT_REFUND_OBLIGATION = RESIDENT_REFUND_LIABILITY;
export const FINANCIAL_ASSETS_AT_15 = FINANCIAL_ASSETS_YEAR15;

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
        description: 'Year 15 closure with full resident refunds and liquidation of financial assets at book value.'
    },
    {
        id: 'strategicSale',
        label: 'Strategic Sale (Yr 15)',
        badgeColor: 'accent',
        description: 'Year 15 sale of the operating company to a strategic buyer at an EBITDA / asset-based multiple.'
    }
];

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
 * Get total commitment for given plan and lots
 */
export function getTotalCommitment(plan: Plan, lots: number): number {
    return plan.unitInvestment * lots;
}

/**
 * Get total cash distributions (interest + dividends + profit share)
 */
export function getTotalCashDistributions(plan: Plan, lots: number): number {
    return (plan.interestTotal + plan.dividendsTotal + plan.profitShareTotal) * lots;
}

/**
 * Get residual stake value at Year 15
 */
export function getResidualValue(plan: Plan, lots: number): number {
    return plan.residualValue * lots;
}

/**
 * Get economic value at Year 15 (cash + residual)
 */
export function getEconomicValueYear15(plan: Plan, lots: number): number {
    return getTotalCashDistributions(plan, lots) + getResidualValue(plan, lots);
}

/**
 * Get money multiple (total economic value / initial investment)
 */
export function getMoneyMultiple(plan: Plan, lots: number): number {
    const invested = getTotalCommitment(plan, lots);
    const totalValue = getEconomicValueYear15(plan, lots);
    return totalValue / invested;
}

/**
 * Get equity stake percentage in project
 */
export function getEquityStakePct(plan: Plan, lots: number): number {
    return plan.equitySharePct * lots;
}

/**
 * Get investor's share of safety buffer (₹5.73 Cr surplus) in shutdown scenario
 * This is the investor's proportional share of surplus after resident refunds
 */
export function getSafetyBufferShare(plan: Plan, lots: number): number {
    const equityForThisInvestor = getTotalCommitment(plan, lots);
    const ratio = SURPLUS_AFTER_RESIDENT_REFUNDS / TOTAL_EQUITY_POOL;
    return equityForThisInvestor * ratio;
}

/**
 * Get strategic sale proceeds for investor
 * @param plan Selected plan
 * @param lots Number of lots
 * @param saleMultiple Sale multiple (8x, 10x, 12x)
 * @returns Sale proceeds for this investor
 */
export function getStrategicSaleProceeds(plan: Plan, lots: number, saleMultiple: SaleMultiple): number {
    // Assumed equity valuations at sale
    const equityValueAtSale =
        saleMultiple === '8x' ? 600000000 :   // ₹60 Cr
            saleMultiple === '10x' ? 800000000 :  // ₹80 Cr
                1000000000;                           // ₹100 Cr (12x)

    const equityStakePct = getEquityStakePct(plan, lots);
    return equityValueAtSale * (equityStakePct / 100);
}

/**
 * Get total value in strategic sale scenario (cash distributions + sale proceeds)
 */
export function getStrategicSaleTotalValue(plan: Plan, lots: number, saleMultiple: SaleMultiple): number {
    const cashDistributions = getTotalCashDistributions(plan, lots);
    const saleProceeds = getStrategicSaleProceeds(plan, lots, saleMultiple);
    return cashDistributions + saleProceeds;
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
    const perYear = plan.dividendsTotal / dividendYears;

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
    dividendsTotal: number;
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
    const year15Value = plan.finalValueYear15 * units;

    // Cash flows over 15 years
    const interestTotal = plan.interestTotal * units;
    const dividendTotal = plan.dividendsTotal * units;
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
        dividendsTotal: dividendTotal,
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
        totalDividends: metrics.dividendsTotal,
        totalInterest: metrics.interestTotal,
        totalCashDuringTerm: metrics.totalCashReceived,
        netWorthAtYear15: metrics.year15Value,
        totalReturn: metrics.year15Value,
        irr: metrics.approxAnnualReturnEconomic,
        irrPercent: (metrics.approxAnnualReturnEconomic * 100).toFixed(2),
    };
};

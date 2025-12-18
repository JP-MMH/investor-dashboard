/**
 * AUTHORITATIVE CA FINANCIAL MODEL
 * Source of Truth for Investor Dashboard
 * 
 * STRICTLY HARDCODED VALUES - NO FORMULAS FOR CORE RETURNS
 */

export type RiskModel = 'AGGRESSIVE' | 'MODERATE' | 'CONSERVATIVE';
export type PlanTier = 'PLATINUM' | 'GOLD' | 'SILVER';

export interface CAOutcome {
    roiYear15: number;
    totalCashPaid: number;
    exitDue: number;
    expectedCagr: number;
}

export interface ProjectTotals {
    fdPool: number;
    liabilityInmates: number;
    safetyBuffer: number;
    currentAssets: number;
    dividendPaidLabel: string; // e.g., "37 Cr"
    fdRate: number;
    mfRate: number;
}

// ============================================================================
// 1. RETURN MATRICES (Per Unit Base)
// ============================================================================

// Base Unit Amounts
const PLAN_AMOUNTS: Record<PlanTier, number> = {
    PLATINUM: 3000000, // 30L
    GOLD: 2000000,     // 20L
    SILVER: 1000000    // 10L
};

// Aggressive Model (MF 60% / FD 40%)
const AGGRESSIVE_DATA: Record<PlanTier, CAOutcome> = {
    PLATINUM: {
        roiYear15: 11139880,
        totalCashPaid: 5950000,
        exitDue: 5189880,
        expectedCagr: 9.14
    },
    GOLD: {
        roiYear15: 7426586,
        totalCashPaid: 3900000,
        exitDue: 3526586,
        expectedCagr: 9.14
    },
    SILVER: {
        roiYear15: 3713293,
        totalCashPaid: 1950000,
        exitDue: 1763293,
        expectedCagr: 9.14
    }
};

// Moderate Model (MF 30% / FD 70%) - RECOMMENDED
const MODERATE_DATA: Record<PlanTier, CAOutcome> = {
    PLATINUM: {
        roiYear15: 10128955,
        totalCashPaid: 4570000,
        exitDue: 5558955,
        expectedCagr: 8.45
    },
    GOLD: {
        roiYear15: 6752636,
        totalCashPaid: 2980000,
        exitDue: 3772636,
        expectedCagr: 8.45
    },
    SILVER: {
        roiYear15: 3376318,
        totalCashPaid: 1490000,
        exitDue: 1886318,
        expectedCagr: 8.45
    }
};

// Conservative Model (100% FD)
const CONSERVATIVE_DATA: Record<PlanTier, CAOutcome> = {
    PLATINUM: {
        roiYear15: 7448269,
        totalCashPaid: 3430000,
        exitDue: 4018269,
        expectedCagr: 6.25
    },
    GOLD: {
        roiYear15: 4965512,
        totalCashPaid: 2220000,
        exitDue: 2745512,
        expectedCagr: 6.25
    },
    SILVER: {
        roiYear15: 2482756,
        totalCashPaid: 1110000,
        exitDue: 1372756,
        expectedCagr: 6.25
    }
};

// ============================================================================
// 2. PROJECT TOTALS (For Safety Section)
// ============================================================================

const PROJECT_TOTALS: Record<RiskModel, ProjectTotals> = {
    AGGRESSIVE: {
        fdPool: 624085021,
        liabilityInmates: 613850000,
        safetyBuffer: 10235021,
        currentAssets: 3028023,
        dividendPaidLabel: "37 Cr",
        fdRate: 0.06,
        mfRate: 0.14
    },
    MODERATE: {
        fdPool: 649924388,
        liabilityInmates: 613850000,
        safetyBuffer: 36074388,
        currentAssets: 1707358,
        dividendPaidLabel: "27.80 Cr",
        fdRate: 0.06,
        mfRate: 0.14
    },
    CONSERVATIVE: {
        fdPool: 547126919,
        liabilityInmates: 613850000,
        safetyBuffer: -66723081, // Negative buffer (Shortfall)
        currentAssets: 1181725,
        dividendPaidLabel: "20.20 Cr",
        fdRate: 0.065,
        mfRate: 0.0
    }
};

// ============================================================================
// 3. ACCESSOR FUNCTIONS
// ============================================================================

export function getPlanAmount(tier: PlanTier): number {
    return PLAN_AMOUNTS[tier];
}

export function getCAOutcome(risk: RiskModel, tier: PlanTier, lots: number = 1): CAOutcome {
    let baseData: CAOutcome;

    switch (risk) {
        case 'AGGRESSIVE':
            baseData = AGGRESSIVE_DATA[tier];
            break;
        case 'MODERATE':
            baseData = MODERATE_DATA[tier];
            break;
        case 'CONSERVATIVE':
            baseData = CONSERVATIVE_DATA[tier];
            break;
    }

    // Multiply by lots
    return {
        roiYear15: baseData.roiYear15 * lots,
        totalCashPaid: baseData.totalCashPaid * lots,
        exitDue: baseData.exitDue * lots,
        expectedCagr: baseData.expectedCagr // Rate doesn't multiply
    };
}

export function getProjectTotals(risk: RiskModel): ProjectTotals {
    return PROJECT_TOTALS[risk];
}

export function getRiskDescription(risk: RiskModel): string {
    switch (risk) {
        case 'AGGRESSIVE': return "60% in Mutual Funds, 40% in Bank FD";
        case 'MODERATE': return "30% in Mutual Funds, 70% in Bank FD";
        case 'CONSERVATIVE': return "100% in Bank FD";
    }
}

export function getAllocationSplit(risk: RiskModel): { fd: number, mf: number, cash: number } {
    // Cash is fixed at 1% of portfolio
    // Remaining 99% is split according to model
    const cash = 0.01;
    const portfolio = 0.99;

    switch (risk) {
        case 'AGGRESSIVE':
            return { fd: portfolio * 0.40, mf: portfolio * 0.60, cash };
        case 'MODERATE':
            return { fd: portfolio * 0.70, mf: portfolio * 0.30, cash };
        case 'CONSERVATIVE':
            return { fd: portfolio * 1.00, mf: 0, cash };
    }
}

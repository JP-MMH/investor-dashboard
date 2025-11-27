/**
 * Unit tests for Investor Calculation Engine
 * Regression tests to ensure calculations match CA plan exactly
 */

import { describe, it, expect } from 'vitest';
import {
    computeInvestorScenario,
    getSharePlanConstants,
    calculateIRR,
    computeProjectAggregates,
    calculateFDScenario,
    calculateMFScenario,
    PROJECT_CONSTANTS,
    type InvestorInput,
} from './investorEngine';

describe('Investor Calculation Engine', () => {
    // Tolerance for floating-point comparisons
    const AMOUNT_TOLERANCE = 1000;  // ₹1,000
    const IRR_TOLERANCE = 0.0001;   // 0.01%

    describe('Share Plan Constants', () => {
        it('should return correct constants for Platinum class', () => {
            const constants = getSharePlanConstants('PLATINUM');
            expect(constants.principal).toBe(3_000_000);
            expect(constants.interestTotal).toBe(400_000);
            expect(constants.dividendTotal).toBe(5_550_000);
            expect(constants.surplusAtYear15).toBe(2_068_023);
            expect(constants.irr).toBe(0.0906);
        });

        it('should return correct constants for Gold class', () => {
            const constants = getSharePlanConstants('GOLD');
            expect(constants.principal).toBe(2_000_000);
            expect(constants.interestTotal).toBe(200_000);
            expect(constants.dividendTotal).toBe(3_700_000);
            expect(constants.surplusAtYear15).toBe(1_445_348);
            expect(constants.irr).toBe(0.0906);
        });

        it('should return correct constants for Silver class', () => {
            const constants = getSharePlanConstants('SILVER');
            expect(constants.principal).toBe(1_000_000);
            expect(constants.interestTotal).toBe(100_000);
            expect(constants.dividendTotal).toBe(1_850_000);
            expect(constants.surplusAtYear15).toBe(722_674);
            expect(constants.irr).toBe(0.0906);
        });
    });

    describe('Test 1: Platinum Baseline (1 share, 15 years)', () => {
        const input: InvestorInput = {
            shareClass: 'PLATINUM',
            numberOfShares: 1,
            horizonYears: 15,
        };

        const output = computeInvestorScenario(input);

        it('should calculate correct total invested', () => {
            expect(output.totalInvested).toBe(3_000_000);
        });

        it('should calculate correct total dividends', () => {
            expect(output.totalDividends).toBeCloseTo(5_550_000, -2);
        });

        it('should calculate correct total interest', () => {
            expect(output.totalInterest).toBeCloseTo(400_000, -2);
        });

        it('should calculate correct cash in hand during term', () => {
            expect(output.totalCashInHandDuringTerm).toBeCloseTo(5_950_000, -2);
        });

        it('should calculate correct final net worth at horizon', () => {
            expect(output.finalNetWorthAtHorizon).toBeCloseTo(5_068_023, -2);
        });

        it('should calculate correct total return', () => {
            expect(output.totalReturn).toBeCloseTo(11_018_023, -2);
        });

        it('should calculate IRR close to 9.06%', () => {
            expect(output.irr).toBeCloseTo(0.0906, 4);
        });

        it('should have IRR within tolerance', () => {
            expect(Math.abs(output.irr - 0.0906)).toBeLessThan(IRR_TOLERANCE);
        });
    });

    describe('Test 2: Gold Baseline (1 share, 15 years)', () => {
        const input: InvestorInput = {
            shareClass: 'GOLD',
            numberOfShares: 1,
            horizonYears: 15,
        };

        const output = computeInvestorScenario(input);

        it('should calculate correct total invested', () => {
            expect(output.totalInvested).toBe(2_000_000);
        });

        it('should calculate correct total dividends', () => {
            expect(output.totalDividends).toBeCloseTo(3_700_000, -2);
        });

        it('should calculate correct total interest', () => {
            expect(output.totalInterest).toBeCloseTo(200_000, -2);
        });

        it('should calculate correct total return', () => {
            expect(output.totalReturn).toBeCloseTo(7_345_348, -2);
        });

        it('should calculate IRR close to 9.06%', () => {
            expect(output.irr).toBeCloseTo(0.0906, 4);
        });
    });

    describe('Test 3: Silver Baseline (1 share, 15 years)', () => {
        const input: InvestorInput = {
            shareClass: 'SILVER',
            numberOfShares: 1,
            horizonYears: 15,
        };

        const output = computeInvestorScenario(input);

        it('should calculate correct total invested', () => {
            expect(output.totalInvested).toBe(1_000_000);
        });

        it('should calculate correct total dividends', () => {
            expect(output.totalDividends).toBeCloseTo(1_850_000, -2);
        });

        it('should calculate correct total interest', () => {
            expect(output.totalInterest).toBeCloseTo(100_000, -2);
        });

        it('should calculate correct total return', () => {
            expect(output.totalReturn).toBeCloseTo(3_672_674, -2);
        });

        it('should calculate IRR close to 9.06%', () => {
            expect(output.irr).toBeCloseTo(0.0906, 4);
        });
    });

    describe('Test 4: Multi-share Scenario (2 Platinum shares)', () => {
        const input: InvestorInput = {
            shareClass: 'PLATINUM',
            numberOfShares: 2,
            horizonYears: 15,
        };

        const output = computeInvestorScenario(input);

        it('should scale total invested by share count', () => {
            expect(output.totalInvested).toBe(6_000_000);
        });

        it('should scale total dividends by share count', () => {
            expect(output.totalDividends).toBeCloseTo(11_100_000, -2);
        });

        it('should scale total interest by share count', () => {
            expect(output.totalInterest).toBeCloseTo(800_000, -2);
        });

        it('should scale surplus by share count', () => {
            expect(output.cashFlowsByYear.finalSurplusShare).toBeCloseTo(4_136_046, -2);
        });

        it('should calculate correct net worth', () => {
            expect(output.finalNetWorthAtHorizon).toBeCloseTo(10_136_046, -2);
        });

        it('should calculate correct total return', () => {
            expect(output.totalReturn).toBeCloseTo(22_036_046, -2);
        });

        it('should have same IRR as single share (invariant)', () => {
            expect(output.irr).toBeCloseTo(0.0906, 4);
        });
    });

    describe('Test 5: Project Aggregate (40P + 30G + 20S)', () => {
        it('should sum to total shareholder amount at year 15', () => {
            // Create scenarios for baseline distribution
            const platinumOutputs = Array.from({ length: 40 }, () =>
                computeInvestorScenario({
                    shareClass: 'PLATINUM',
                    numberOfShares: 1,
                    horizonYears: 15,
                })
            );

            const goldOutputs = Array.from({ length: 30 }, () =>
                computeInvestorScenario({
                    shareClass: 'GOLD',
                    numberOfShares: 1,
                    horizonYears: 15,
                })
            );

            const silverOutputs = Array.from({ length: 20 }, () =>
                computeInvestorScenario({
                    shareClass: 'SILVER',
                    numberOfShares: 1,
                    horizonYears: 15,
                })
            );

            const allScenarios = [...platinumOutputs, ...goldOutputs, ...silverOutputs];
            const aggregates = computeProjectAggregates(allScenarios);

            // Total capital should be ₹200,000,000
            expect(aggregates.totalCapital).toBe(200_000_000);

            // Total shareholder net worth should equal ₹340,754,859
            expect(aggregates.totalShareholderNetWorth).toBeCloseTo(340_754_859, -3);

            // Verify reserve & surplus calculation
            // Surplus = NetWorth - Capital = 340,754,859 - 200,000,000 = 140,754,859
            const totalSurplus = aggregates.totalShareholderNetWorth - aggregates.totalCapital;
            expect(totalSurplus).toBeCloseTo(PROJECT_CONSTANTS.RESERVE_SURPLUS_YEAR_15, -3);
        });

        it('should match surplus validation formula', () => {
            // 40 × 2,068,023 + 30 × 1,445,348 + 20 × 722,674 ≈ 140,754,859
            const platinumSurplus = 40 * 2_068_023;
            const goldSurplus = 30 * 1_445_348;
            const silverSurplus = 20 * 722_674;
            const totalSurplus = platinumSurplus + goldSurplus + silverSurplus;

            expect(totalSurplus).toBeCloseTo(140_754_859, -2);
        });
    });

    describe('IRR Calculator', () => {
        it('should calculate simple IRR correctly', () => {
            // Example: invest ₹100, get back ₹110 after 1 year = 10% return
            const cashflows = [-100, 110];
            const irr = calculateIRR(cashflows);
            expect(irr).toBeCloseTo(0.10, 6);
        });

        it('should calculate multi-year IRR correctly', () => {
            // Invest ₹1000, get ₹100/year for 3 years, then ₹1000 back
            // This should be approximately 10% IRR
            const cashflows = [-1000, 100, 100, 1100];
            const irr = calculateIRR(cashflows);
            expect(irr).toBeCloseTo(0.10, 4);
        });
    });

    describe('FD and MF Comparison Scenarios', () => {
        it('should calculate FD scenario at 6% correctly', () => {
            const fd = calculateFDScenario(1_000_000, 15);
            // 1M at 6% for 15 years = 1M × (1.06)^15
            const expected = 1_000_000 * Math.pow(1.06, 15);
            expect(fd.finalValue).toBeCloseTo(expected, -2);
        });

        it('should calculate MF scenario at 14% correctly', () => {
            const mf = calculateMFScenario(1_000_000, 15);
            // 1M at 14% for 15 years = 1M × (1.14)^15
            const expected = 1_000_000 * Math.pow(1.14, 15);
            expect(mf.finalValue).toBeCloseTo(expected, -2);
        });
    });

    describe('Cash Flow Breakdown', () => {
        it('should generate correct number of yearly entries', () => {
            const output = computeInvestorScenario({
                shareClass: 'PLATINUM',
                numberOfShares: 1,
                horizonYears: 15,
            });

            expect(output.cashFlowsByYear.yearlyDividends).toHaveLength(15);
            expect(output.cashFlowsByYear.yearlyInterest).toHaveLength(15);
        });

        it('should distribute dividends equally over 15 years', () => {
            const output = computeInvestorScenario({
                shareClass: 'PLATINUM',
                numberOfShares: 1,
                horizonYears: 15,
            });

            const expectedAnnual = 5_550_000 / 15;  // ₹370,000 per year
            output.cashFlowsByYear.yearlyDividends.forEach(dividend => {
                expect(dividend).toBeCloseTo(expectedAnnual, -2);
            });
        });

        it('should distribute interest equally over 15 years', () => {
            const output = computeInvestorScenario({
                shareClass: 'PLATINUM',
                numberOfShares: 1,
                horizonYears: 15,
            });

            const expectedAnnual = 400_000 / 15;  // ₹26,666.67 per year
            output.cashFlowsByYear.yearlyInterest.forEach(interest => {
                expect(interest).toBeCloseTo(expectedAnnual, -2);
            });
        });
    });
});

import { useMemo } from 'react';
import type { UnitType } from '../config/residentPricing';
import {
    SERVICE_FEE_PER_MONTH_PER_PERSON,
    GST_RATE,
    PARKING_FEE_PER_CAR_PER_MONTH,
    DEPOSIT_PERCENTAGE,
    MEDICAL_CAUTION_DEPOSIT,
    GENERAL_CAUTION_DEPOSIT,
    getRefundPercentage,
} from '../config/residentPricing';

export interface ResidentCalculation {
    // Upfront
    buyIn: number;
    depositAmount: number;
    cautionDeposits: number;
    totalUpfront: number;

    // Annual
    servicePerYear: number;
    serviceWithGST: number;
    parkingPerYear: number;
    totalAnnual: number;
    monthlyEquivalent: number;
    perResidentMonthly: number;

    // Over Stay
    totalServiceCost: number;
    totalCostBeforeRefund: number;

    // Exit
    refundPercentage: number;
    refundedDeposit: number;
    effectiveNetCost: number;
    effectiveCostPerYear: number;
    effectiveCostPerMonth: number;

    // Year-by-year
    yearByYear: Array<{
        year: number;
        serviceCost: number;
        cumulativeCost: number;
        notes: string;
    }>;
}

export const useResidentCalculator = (
    selectedUnit: UnitType | null,
    numResidents: number,
    numCars: number,
    years: number
): ResidentCalculation | null => {
    return useMemo(() => {
        if (!selectedUnit) return null;

        // Upfront Calculations
        const buyIn = selectedUnit.basePrice;
        const depositAmount = buyIn * DEPOSIT_PERCENTAGE;
        const cautionDeposits = MEDICAL_CAUTION_DEPOSIT + GENERAL_CAUTION_DEPOSIT;
        const totalUpfront = buyIn + cautionDeposits;

        // Annual Calculations
        const servicePerYear = SERVICE_FEE_PER_MONTH_PER_PERSON * 12 * numResidents;
        const serviceWithGST = servicePerYear * (1 + GST_RATE);
        const parkingPerYear = PARKING_FEE_PER_CAR_PER_MONTH * 12 * numCars;
        const totalAnnual = serviceWithGST + parkingPerYear;
        const monthlyEquivalent = totalAnnual / 12;
        const perResidentMonthly = monthlyEquivalent / numResidents;

        // Total Over Stay
        const totalServiceCost = totalAnnual * years;
        const totalCostBeforeRefund = totalUpfront + totalServiceCost;

        // Exit & Refund
        const refundPercentage = getRefundPercentage(years);
        const refundedDeposit = depositAmount * refundPercentage;
        const effectiveNetCost = totalCostBeforeRefund - refundedDeposit;
        const effectiveCostPerYear = effectiveNetCost / years;
        const effectiveCostPerMonth = effectiveCostPerYear / 12;

        // Year-by-Year Breakdown
        const yearByYear = [];
        let cumulativeCost = totalUpfront;

        for (let year = 1; year <= years; year++) {
            const serviceCost = totalAnnual;
            cumulativeCost += serviceCost;

            let notes = '';
            if (year === 1) notes = 'Initial buy-in + first year service';
            else if (year === years) notes = `Exit refund: ${(refundPercentage * 100).toFixed(0)}%`;

            yearByYear.push({
                year,
                serviceCost,
                cumulativeCost,
                notes,
            });
        }

        return {
            buyIn,
            depositAmount,
            cautionDeposits,
            totalUpfront,
            servicePerYear,
            serviceWithGST,
            parkingPerYear,
            totalAnnual,
            monthlyEquivalent,
            perResidentMonthly,
            totalServiceCost,
            totalCostBeforeRefund,
            refundPercentage,
            refundedDeposit,
            effectiveNetCost,
            effectiveCostPerYear,
            effectiveCostPerMonth,
            yearByYear,
        };
    }, [selectedUnit, numResidents, numCars, years]);
};

/**
 * Core calculation functions for Resident Calculator
 * Mater Maria Homes
 */

import {
    SERVICE_FEE_PER_MONTH_PER_PERSON,
    GST_RATE,
    PARKING_FEE_PER_CAR_PER_MONTH,
    DEPOSIT_PERCENTAGE,
    MEDICAL_CAUTION_DEPOSIT,
    GENERAL_CAUTION_DEPOSIT,
} from '../config/residentPricing';
import { calculateRefundAmount } from './depositLogic';

/**
 * Calculate upfront cost (deposit + parking deposit)
 * @param unitPrice - Unit price in rupees
 * @param cars - Number of cars
 * @returns Upfront cost in lakhs
 */
export const calculateUpfrontCost = (
    unitPrice: number,
    cars: number
): number => {
    const depositRupees = unitPrice * DEPOSIT_PERCENTAGE;
    const cautionDeposits = MEDICAL_CAUTION_DEPOSIT + GENERAL_CAUTION_DEPOSIT;
    const parkingDeposit = cars * 50000; // ₹50,000 per car deposit (placeholder)

    const totalRupees = depositRupees + cautionDeposits + parkingDeposit;
    return totalRupees / 100000; // Convert to lakhs
};

/**
 * Calculate annual cost (service fees + GST + parking)
 * @param residents - Number of residents
 * @param cars - Number of cars
 * @returns Annual cost in lakhs
 */
export const calculateAnnualCost = (
    residents: number,
    cars: number
): number => {
    const monthlyServiceFee = SERVICE_FEE_PER_MONTH_PER_PERSON * residents;
    const annualServiceFee = monthlyServiceFee * 12;
    const gst = annualServiceFee * GST_RATE;
    const annualParking = PARKING_FEE_PER_CAR_PER_MONTH * cars * 12;

    const totalRupees = annualServiceFee + gst + annualParking;
    return totalRupees / 100000; // Convert to lakhs
};

/**
 * Calculate total cost over stay duration
 * @param upfrontCostLakhs - Upfront cost in lakhs
 * @param annualCostLakhs - Annual cost in lakhs
 * @param stayYears - Length of stay in years
 * @returns Total cost in lakhs
 */
export const calculateTotalCost = (
    upfrontCostLakhs: number,
    annualCostLakhs: number,
    stayYears: number
): number => {
    return upfrontCostLakhs + (annualCostLakhs * stayYears);
};

/**
 * Calculate effective net cost (total cost - deposit refund)
 * @param unitPrice - Unit price in rupees
 * @param upfrontCostLakhs - Upfront cost in lakhs
 * @param annualCostLakhs - Annual cost in lakhs
 * @param stayYears - Length of stay in years
 * @returns Effective net cost in lakhs
 */
export const calculateEffectiveNetCost = (
    unitPrice: number,
    upfrontCostLakhs: number,
    annualCostLakhs: number,
    stayYears: number
): number => {
    const totalCost = calculateTotalCost(upfrontCostLakhs, annualCostLakhs, stayYears);
    const depositLakhs = (unitPrice * DEPOSIT_PERCENTAGE) / 100000;
    const refundLakhs = calculateRefundAmount(depositLakhs, stayYears);

    return totalCost - refundLakhs;
};

/**
 * Year-by-year breakdown entry
 */
export interface YearBreakdown {
    year: number;
    serviceCostLakh: number;
    cumulativeLakh: number;
    notes?: string;
}

/**
 * Generate year-by-year breakdown
 * @param annualCostLakhs - Annual cost in lakhs
 * @param upfrontCostLakhs - Upfront cost in lakhs
 * @param stayYears - Length of stay in years
 * @returns Array of year-by-year breakdown
 */
export const generateYearByYearBreakdown = (
    annualCostLakhs: number,
    upfrontCostLakhs: number,
    stayYears: number
): YearBreakdown[] => {
    const breakdown: YearBreakdown[] = [];

    for (let year = 1; year <= stayYears; year++) {
        const serviceCostLakh = annualCostLakhs;
        const cumulativeLakh = upfrontCostLakhs + (annualCostLakhs * year);

        let notes: string | undefined;
        if (year === 1) {
            notes = 'Includes upfront deposit';
        } else if (year === 10) {
            notes = 'Refund band changes to 80%';
        } else if (year === 20) {
            notes = 'Refund band changes to 70%';
        }

        breakdown.push({
            year,
            serviceCostLakh,
            cumulativeLakh,
            notes,
        });
    }

    return breakdown;
};

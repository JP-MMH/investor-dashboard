/**
 * Deposit refund logic for Mater Maria Homes
 * Refund bands based on length of stay
 */

export interface RefundBands {
    '0_10': number;   // 0-10 years: 90% refund
    '10_20': number;  // 10-20 years: 80% refund
    '20_25': number;  // 20-25 years: 70% refund
}

export const DEFAULT_REFUND_BANDS: RefundBands = {
    '0_10': 0.90,
    '10_20': 0.80,
    '20_25': 0.70,
};

/**
 * Calculate deposit refund percentage based on stay duration
 * @param stayYears - Length of stay in years
 * @param refundBands - Custom refund bands (optional)
 * @returns Refund percentage (0.0 to 1.0)
 */
export const calculateRefundPercentage = (
    stayYears: number,
    refundBands: RefundBands = DEFAULT_REFUND_BANDS
): number => {
    if (stayYears < 10) {
        return refundBands['0_10'];
    } else if (stayYears < 20) {
        return refundBands['10_20'];
    } else {
        return refundBands['20_25'];
    }
};

/**
 * Calculate actual refund amount
 * @param depositAmount - Total deposit in lakhs
 * @param stayYears - Length of stay in years
 * @param refundBands - Custom refund bands (optional)
 * @returns Refund amount in lakhs
 */
export const calculateRefundAmount = (
    depositAmount: number,
    stayYears: number,
    refundBands: RefundBands = DEFAULT_REFUND_BANDS
): number => {
    const refundPercentage = calculateRefundPercentage(stayYears, refundBands);
    return depositAmount * refundPercentage;
};

/**
 * Get refund band description
 * @param stayYears - Length of stay in years
 * @returns Human-readable refund band description
 */
export const getRefundBandDescription = (stayYears: number): string => {
    const percentage = calculateRefundPercentage(stayYears);
    const percentDisplay = (percentage * 100).toFixed(0);

    if (stayYears < 10) {
        return `0–10 years: ${percentDisplay}% refunded`;
    } else if (stayYears < 20) {
        return `10–20 years: ${percentDisplay}% refunded`;
    } else {
        return `20+ years: ${percentDisplay}% refunded`;
    }
};

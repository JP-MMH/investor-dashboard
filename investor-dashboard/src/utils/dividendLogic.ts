/**
 * Dividend calculation logic for Investor Calculator
 * Mater Maria Homes - Fixed math logic
 */

/**
 * Base dividend rate (8.68% per annum)
 */
export const BASE_DIVIDEND_RATE = 0.0868;

/**
 * Dividend start year
 */
export const DIVIDEND_START_YEAR = 2030;

/**
 * Calculate annual dividend
 * @param shareCapitalPerUnit - Share capital per unit in lakhs
 * @param numberOfUnits - Number of units invested
 * @param dividendRateMultiplier - Multiplier for dividend rate (default: 1.0)
 * @returns Annual dividend in lakhs
 */
export const calculateAnnualDividend = (
    shareCapitalPerUnit: number,
    numberOfUnits: number,
    dividendRateMultiplier: number = 1.0
): number => {
    const totalShareCapital = shareCapitalPerUnit * numberOfUnits;
    const effectiveRate = BASE_DIVIDEND_RATE * dividendRateMultiplier;
    return totalShareCapital * effectiveRate;
};

/**
 * Calculate cumulative dividends from start year to current year
 * @param shareCapitalPerUnit - Share capital per unit in lakhs
 * @param numberOfUnits - Number of units invested
 * @param currentYear - Current year
 * @param dividendRateMultiplier - Multiplier for dividend rate (default: 1.0)
 * @returns Cumulative dividends in lakhs
 */
export const calculateCumulativeDividends = (
    shareCapitalPerUnit: number,
    numberOfUnits: number,
    currentYear: number,
    dividendRateMultiplier: number = 1.0
): number => {
    if (currentYear < DIVIDEND_START_YEAR) {
        return 0;
    }

    const yearsOfDividends = currentYear - DIVIDEND_START_YEAR + 1;
    const annualDividend = calculateAnnualDividend(
        shareCapitalPerUnit,
        numberOfUnits,
        dividendRateMultiplier
    );

    return annualDividend * yearsOfDividends;
};

/**
 * Check if dividends should be paid for a given year
 * @param year - Year to check
 * @returns True if dividends are paid in this year
 */
export const shouldPayDividends = (year: number): boolean => {
    return year >= DIVIDEND_START_YEAR;
};

/**
 * Number and currency formatting utilities
 * Mater Maria Homes - Brand-compliant formatters
 */

/**
 * Format number as Indian Rupees in Lakhs
 * @param value - Value in lakhs
 * @param decimals - Number of decimal places (default: 2)
 */
export const formatLakhs = (value: number, decimals: number = 2): string => {
    return `₹${value.toFixed(decimals)}L`;
};

/**
 * Format number as Indian Rupees in Crores
 * @param value - Value in crores
 * @param decimals - Number of decimal places (default: 2)
 */
export const formatCrores = (value: number, decimals: number = 2): string => {
    return `₹${value.toFixed(decimals)}Cr`;
};

/**
 * Format large number with Indian numbering system
 * @param value - Numeric value
 */
export const formatIndianNumber = (value: number): string => {
    return new Intl.NumberFormat('en-IN').format(value);
};

/**
 * Format percentage
 * @param value - Decimal value (e.g., 0.0868 for 8.68%)
 * @param decimals - Number of decimal places (default: 2)
 */
export const formatPercentage = (value: number, decimals: number = 2): string => {
    return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Format year range
 * @param startYear - Start year
 * @param endYear - End year
 */
export const formatYearRange = (startYear: number, endYear: number): string => {
    return `${startYear}–${endYear}`;
};

/**
 * Format duration in years
 * @param years - Number of years
 */
export const formatDuration = (years: number): string => {
    return years === 1 ? '1 year' : `${years} years`;
};

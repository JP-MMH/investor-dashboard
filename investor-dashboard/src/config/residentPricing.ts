// Resident Pricing Configuration

export interface UnitType {
    id: string;
    name: string;
    category: 'flat' | 'walk-in-villa' | 'twin-villa' | 'independent-villa';
    sqft: number;
    basePrice: number; // in rupees
    bedrooms: number;
}

export const UNIT_TYPES: UnitType[] = [
    {
        id: 'flat-1bhk',
        name: '1 BHK Flat',
        category: 'flat',
        sqft: 500,
        basePrice: 3500000, // ₹35 L
        bedrooms: 1,
    },
    {
        id: 'flat-2bhk',
        name: '2 BHK Flat',
        category: 'flat',
        sqft: 700,
        basePrice: 4000000, // ₹40 L
        bedrooms: 2,
    },
    {
        id: 'walk-in-1bhk',
        name: '1 BHK Walk-in Apartment Villa',
        category: 'walk-in-villa',
        sqft: 600,
        basePrice: 4900000, // ₹49 L
        bedrooms: 1,
    },
    {
        id: 'walk-in-2bhk',
        name: '2 BHK Walk-in Apartment Villa',
        category: 'walk-in-villa',
        sqft: 800,
        basePrice: 5600000, // ₹56 L
        bedrooms: 2,
    },
    {
        id: 'twin-1bhk',
        name: '1 BHK Twin Villa',
        category: 'twin-villa',
        sqft: 600,
        basePrice: 5200000, // ₹52 L
        bedrooms: 1,
    },
    {
        id: 'twin-2bhk',
        name: '2 BHK Twin Villa',
        category: 'twin-villa',
        sqft: 800,
        basePrice: 5800000, // ₹58 L
        bedrooms: 2,
    },
    {
        id: 'independent-2bhk-1000',
        name: '2 BHK Independent Villa (1,000 sq ft)',
        category: 'independent-villa',
        sqft: 1000,
        basePrice: 6500000, // ₹65 L
        bedrooms: 2,
    },
    {
        id: 'independent-2bhk-1200',
        name: '2 BHK Independent Villa (1,200 sq ft)',
        category: 'independent-villa',
        sqft: 1200,
        basePrice: 7500000, // ₹75 L
        bedrooms: 2,
    },
];

// Service Fees
export const SERVICE_FEE_PER_MONTH_PER_PERSON = 30000; // ₹30,000
export const GST_RATE = 0.18; // 18%

// Parking
export const PARKING_FEE_PER_CAR_PER_MONTH = 2000; // ₹2,000 (placeholder)

// Deposit Rules
export interface DepositBand {
    minYears: number;
    maxYears: number;
    refundPercentage: number;
}

export const DEPOSIT_REFUND_BANDS: DepositBand[] = [
    { minYears: 0, maxYears: 10, refundPercentage: 0.9 }, // 90%
    { minYears: 10, maxYears: 20, refundPercentage: 0.8 }, // 80%
    { minYears: 20, maxYears: 100, refundPercentage: 0.7 }, // 70%
];

// Deposit as percentage of base price
export const DEPOSIT_PERCENTAGE = 0.15; // 15% of base price is refundable deposit

// Caution Deposits (non-refundable or separately tracked)
export const MEDICAL_CAUTION_DEPOSIT = 50000; // ₹50,000
export const GENERAL_CAUTION_DEPOSIT = 25000; // ₹25,000

export const getRefundPercentage = (years: number): number => {
    const band = DEPOSIT_REFUND_BANDS.find(
        (b) => years >= b.minYears && years < b.maxYears
    );
    return band ? band.refundPercentage : 0.7; // Default to 70%
};

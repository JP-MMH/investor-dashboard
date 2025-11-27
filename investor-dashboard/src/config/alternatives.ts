// Alternative Scenarios for Comparison

export interface AlternativeScenario {
    id: string;
    name: string;
    description: string;
    calculateYearlyCost: (year: number, basePrice: number, residents: number, cars: number) => number;
}

// Mater Maria scenario (uses actual calculator)
export const materMariaScenario: AlternativeScenario = {
    id: 'mater-maria',
    name: 'Mater Maria',
    description: 'Your calculated cost at Mater Maria',
    calculateYearlyCost: () => 0, // Will be overridden by actual calculator
};

// Typical Retirement Villa
export const retirementVillaScenario: AlternativeScenario = {
    id: 'retirement-villa',
    name: 'Typical Retirement Villa',
    description: '15-25% higher buy-in, similar monthly fees',
    calculateYearlyCost: (year: number, basePrice: number, residents: number, _cars: number) => {
        const buyInPremium = basePrice * 0.20; // 20% higher buy-in
        const monthlyFee = 35000 * residents; // ₹35K per person (slightly higher)
        const yearlyFee = monthlyFee * 12 * 1.18; // With GST

        if (year === 1) {
            return buyInPremium + yearlyFee;
        }
        return yearlyFee;
    },
};

// Own House + Staff
export const ownHouseScenario: AlternativeScenario = {
    id: 'own-house',
    name: 'Own House + Staff',
    description: 'House maintenance, staff salaries, utilities',
    calculateYearlyCost: (year: number, _basePrice: number, residents: number, _cars: number) => {
        const houseMaintenance = 200000; // ₹2L per year
        const staffSalaries = 300000; // ₹3L per year (cook, helper, driver)
        const utilities = 150000; // ₹1.5L per year
        const medicalInsurance = 100000 * residents; // ₹1L per person

        if (year === 1) {
            // Assume house already owned, so no buy-in, but initial setup costs
            const setupCosts = 500000; // ₹5L for initial setup/renovations
            return setupCosts + houseMaintenance + staffSalaries + utilities + medicalInsurance;
        }

        return houseMaintenance + staffSalaries + utilities + medicalInsurance;
    },
};

export const ALTERNATIVE_SCENARIOS = [
    materMariaScenario,
    retirementVillaScenario,
    ownHouseScenario,
];

// Amenity Inclusion Matrix
export interface Amenity {
    id: string;
    name: string;
    category: 'medical' | 'wellness' | 'social' | 'spiritual' | 'safety';
    includedIn: {
        materMaria: boolean;
        retirementVilla: boolean;
        ownHouse: boolean;
    };
    extraCostIfNotIncluded: number; // Annual cost to replicate
}

export const AMENITIES: Amenity[] = [
    {
        id: 'on-site-medical',
        name: 'On-site Medical Care',
        category: 'medical',
        includedIn: { materMaria: true, retirementVilla: true, ownHouse: false },
        extraCostIfNotIncluded: 150000, // ₹1.5L/year
    },
    {
        id: 'emergency-response',
        name: '24/7 Emergency Response',
        category: 'safety',
        includedIn: { materMaria: true, retirementVilla: true, ownHouse: false },
        extraCostIfNotIncluded: 100000, // ₹1L/year
    },
    {
        id: 'wellness-center',
        name: 'Wellness & Fitness Center',
        category: 'wellness',
        includedIn: { materMaria: true, retirementVilla: false, ownHouse: false },
        extraCostIfNotIncluded: 80000, // ₹80K/year
    },
    {
        id: 'spiritual-care',
        name: 'Spiritual Care & Chapel',
        category: 'spiritual',
        includedIn: { materMaria: true, retirementVilla: false, ownHouse: false },
        extraCostIfNotIncluded: 0, // Priceless
    },
    {
        id: 'community-activities',
        name: 'Community Activities & Events',
        category: 'social',
        includedIn: { materMaria: true, retirementVilla: true, ownHouse: false },
        extraCostIfNotIncluded: 50000, // ₹50K/year
    },
    {
        id: 'housekeeping',
        name: 'Daily Housekeeping',
        category: 'social',
        includedIn: { materMaria: true, retirementVilla: true, ownHouse: false },
        extraCostIfNotIncluded: 120000, // ₹1.2L/year
    },
    {
        id: 'meals',
        name: 'Nutritious Meals (3x/day)',
        category: 'wellness',
        includedIn: { materMaria: true, retirementVilla: false, ownHouse: false },
        extraCostIfNotIncluded: 180000, // ₹1.8L/year per person
    },
    {
        id: 'security',
        name: 'Gated Security',
        category: 'safety',
        includedIn: { materMaria: true, retirementVilla: true, ownHouse: false },
        extraCostIfNotIncluded: 60000, // ₹60K/year
    },
];

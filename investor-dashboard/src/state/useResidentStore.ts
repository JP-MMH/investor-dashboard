/**
 * Resident Calculator State Management
 * Mater Maria Homes - Zustand Store
 */

import { create } from 'zustand';
import { UNIT_TYPES } from '../config/residentPricing';
import type { UnitType } from '../config/residentPricing';
import {
    calculateUpfrontCost,
    calculateAnnualCost,
    calculateEffectiveNetCost,
    generateYearByYearBreakdown,
    type YearBreakdown,
} from '../utils/calculations';

/**
 * Amenities that can be toggled for comparison
 */
export interface Amenities {
    medical: boolean;
    meals: boolean;
    housekeeping: boolean;
    fitness: boolean;
    security: boolean;
    community: boolean;
    spiritual: boolean;
    other: boolean;
}

/**
 * Resident Calculator State
 */
export interface ResidentState {
    // User selections
    unitType: UnitType;
    residents: number;
    cars: number;
    stayYears: number;
    amenities: Amenities;

    // Derived values (computed)
    totalUpfrontLakh: number;
    annualCostLakh: number;
    effectiveNetCostLakh: number;
    yearByYear: YearBreakdown[];

    // Comparison state
    showOwnHouse: boolean;
    showRetirementVilla: boolean;
    comparisonData: {
        materMaria: number[]; // Cumulative cost per year (in lakhs)
        ownHouse: number[];
        retirementVilla: number[];
    };

    // Actions
    setUnitType: (unitId: string) => void;
    setResidents: (count: number) => void;
    setCars: (count: number) => void;
    setStayYears: (years: number) => void;
    toggleAmenity: (amenity: keyof Amenities) => void;
    toggleOwnHouse: () => void;
    toggleRetirementVilla: () => void;
    recalculate: () => void;
}

/**
 * Default amenities (all enabled for Mater Maria)
 */
const DEFAULT_AMENITIES: Amenities = {
    medical: true,
    meals: true,
    housekeeping: true,
    fitness: true,
    security: true,
    community: true,
    spiritual: true,
    other: true,
};

/**
 * Resident Calculator Zustand Store
 */
export const useResidentStore = create<ResidentState>((set, get) => {
    const initialUnit = UNIT_TYPES[0]; // Default to first unit (1 BHK Flat)

    // Helper function to recalculate all derived values
    const recalculate = () => {
        const state = get();
        const unitPriceRupees = state.unitType.basePrice;

        const upfrontLakh = calculateUpfrontCost(unitPriceRupees, state.cars);
        const annualLakh = calculateAnnualCost(state.residents, state.cars);
        const effectiveNetLakh = calculateEffectiveNetCost(
            unitPriceRupees,
            upfrontLakh,
            annualLakh,
            state.stayYears
        );
        const breakdown = generateYearByYearBreakdown(
            annualLakh,
            upfrontLakh,
            state.stayYears
        );

        // Calculate comparison data for all 3 scenarios
        const materMariaData: number[] = [];
        const ownHouseData: number[] = [];
        const retirementVillaData: number[] = [];

        for (let year = 1; year <= 25; year++) {
            // Mater Maria cumulative cost
            const mmCumulative = breakdown.find(b => b.year === year)?.cumulativeLakh || 0;
            materMariaData.push(Math.round(mmCumulative)); // Already in lakhs

            // Own House cumulative cost
            let ownHouseCumulative = 0;
            for (let y = 1; y <= year; y++) {
                if (y === 1) {
                    // Year 1: Setup costs + annual
                    const setupCosts = 500000; // ₹5L
                    const houseMaintenance = 200000; // ₹2L
                    const staffSalaries = 300000; // ₹3L
                    const utilities = 150000; // ₹1.5L
                    const medicalInsurance = 100000 * state.residents; // ₹1L per person
                    ownHouseCumulative += setupCosts + houseMaintenance + staffSalaries + utilities + medicalInsurance;
                } else {
                    // Year 2+: Only annual costs
                    const houseMaintenance = 200000;
                    const staffSalaries = 300000;
                    const utilities = 150000;
                    const medicalInsurance = 100000 * state.residents;
                    ownHouseCumulative += houseMaintenance + staffSalaries + utilities + medicalInsurance;
                }
            }
            ownHouseData.push(Math.round(ownHouseCumulative / 100000)); // Convert to lakhs

            // Retirement Villa cumulative cost
            let retirementVillaCumulative = 0;
            for (let y = 1; y <= year; y++) {
                if (y === 1) {
                    // Year 1: Buy-in premium + annual
                    const buyInPremium = unitPriceRupees * 0.20; // 20% higher buy-in
                    const monthlyFee = 35000 * state.residents; // ₹35K per person
                    const yearlyFee = monthlyFee * 12 * 1.18; // With GST
                    retirementVillaCumulative += buyInPremium + yearlyFee;
                } else {
                    // Year 2+: Only annual fees
                    const monthlyFee = 35000 * state.residents;
                    const yearlyFee = monthlyFee * 12 * 1.18;
                    retirementVillaCumulative += yearlyFee;
                }
            }
            retirementVillaData.push(Math.round(retirementVillaCumulative / 100000)); // Convert to lakhs
        }

        set({
            totalUpfrontLakh: upfrontLakh,
            annualCostLakh: annualLakh,
            effectiveNetCostLakh: effectiveNetLakh,
            yearByYear: breakdown,
            comparisonData: {
                materMaria: materMariaData,
                ownHouse: ownHouseData,
                retirementVilla: retirementVillaData,
            },
        });
    };

    // Initial calculations
    const initialUpfront = calculateUpfrontCost(initialUnit.basePrice, 1);
    const initialAnnual = calculateAnnualCost(2, 1);
    const initialEffective = calculateEffectiveNetCost(
        initialUnit.basePrice,
        initialUpfront,
        initialAnnual,
        10
    );
    const initialBreakdown = generateYearByYearBreakdown(
        initialAnnual,
        initialUpfront,
        10
    );

    // Initial comparison data (empty arrays, will be calculated on first recalculate)
    const initialComparisonData = {
        materMaria: [],
        ownHouse: [],
        retirementVilla: [],
    };

    return {
        // Initial state
        unitType: initialUnit,
        residents: 2,
        cars: 1,
        stayYears: 10,
        amenities: DEFAULT_AMENITIES,

        // Initial derived values
        totalUpfrontLakh: initialUpfront,
        annualCostLakh: initialAnnual,
        effectiveNetCostLakh: initialEffective,
        yearByYear: initialBreakdown,

        // Initial comparison state
        showOwnHouse: true,
        showRetirementVilla: true,
        comparisonData: initialComparisonData,

        // Actions
        setUnitType: (unitId: string) => {
            const unit = UNIT_TYPES.find((u) => u.id === unitId);
            if (unit) {
                set({ unitType: unit });
                recalculate();
            }
        },

        setResidents: (count: number) => {
            const clamped = Math.max(1, Math.min(3, count));
            set({ residents: clamped });
            recalculate();
        },

        setCars: (count: number) => {
            const clamped = Math.max(0, Math.min(3, count));
            set({ cars: clamped });
            recalculate();
        },

        setStayYears: (years: number) => {
            const clamped = Math.max(5, Math.min(25, years));
            set({ stayYears: clamped });
            recalculate();
        },

        toggleAmenity: (amenity: keyof Amenities) => {
            set((state) => ({
                amenities: {
                    ...state.amenities,
                    [amenity]: !state.amenities[amenity],
                },
            }));
        },

        toggleOwnHouse: () => {
            set((state) => ({ showOwnHouse: !state.showOwnHouse }));
        },

        toggleRetirementVilla: () => {
            set((state) => ({ showRetirementVilla: !state.showRetirementVilla }));
        },

        recalculate,
    };
});

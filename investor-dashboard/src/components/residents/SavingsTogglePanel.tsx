/**
 * Savings Toggle Panel Component
 * Toggle controls and savings summary for comparison
 */

import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { useResidentStore } from '../../state/useResidentStore';
import { formatLakhs } from '../../utils/formatters';

export const SavingsTogglePanel = () => {
    const {
        showOwnHouse,
        showRetirementVilla,
        toggleOwnHouse,
        toggleRetirementVilla,
        comparisonData,
        stayYears,
    } = useResidentStore();

    // Calculate savings at the selected year
    const yearIndex = Math.min(stayYears, 17) - 1;
    const mmCost = comparisonData.materMaria[yearIndex] || 0;
    const ownHouseCost = comparisonData.ownHouse[yearIndex] || 0;
    const villaCost = comparisonData.retirementVilla[yearIndex] || 0;

    // Find the cheapest active alternative
    const alternatives = [];
    if (showOwnHouse && ownHouseCost > 0) {
        alternatives.push({ name: 'Own House + Staff', cost: ownHouseCost });
    }
    if (showRetirementVilla && villaCost > 0) {
        alternatives.push({ name: 'Retirement Villa', cost: villaCost });
    }

    const cheapestAlt = alternatives.length > 0
        ? alternatives.reduce((min, alt) => (alt.cost < min.cost ? alt : min))
        : null;

    const savings = cheapestAlt ? cheapestAlt.cost - mmCost : 0;
    const isSavings = savings > 0;

    return (
        <div className="space-y-6">
            {/* Section Header */}
            <h3 className="text-xl font-heading font-semibold text-heritage">
                Compare with Alternatives
            </h3>

            {/* Toggle Controls */}
            <div className="space-y-3">
                {/* Mater Maria - Always On */}
                <div className="flex items-center justify-between p-3 bg-heritage/5 rounded-lg border border-heritage/10">
                    <span className="text-sm font-body font-medium text-heritage">
                        Mater Maria
                    </span>
                    <div className="w-12 h-6 bg-heritage rounded-full flex items-center justify-end px-1">
                        <div className="w-4 h-4 bg-cloud rounded-full" />
                    </div>
                </div>

                {/* Own House + Staff Toggle */}
                <button
                    onClick={toggleOwnHouse}
                    className="w-full flex items-center justify-between p-3 bg-sage/5 rounded-lg border border-sage/10 hover:border-sage/30 transition-all"
                >
                    <span className="text-sm font-body font-medium text-heritage">
                        Own House + Staff
                    </span>
                    <div
                        className={`w-12 h-6 rounded-full flex items-center transition-all ${showOwnHouse
                                ? 'bg-heritage justify-end'
                                : 'bg-coolgrey/20 justify-start'
                            } px-1`}
                    >
                        <div className="w-4 h-4 bg-cloud rounded-full" />
                    </div>
                </button>

                {/* Retirement Villa Toggle */}
                <button
                    onClick={toggleRetirementVilla}
                    className="w-full flex items-center justify-between p-3 bg-terra/5 rounded-lg border border-terra/10 hover:border-terra/30 transition-all"
                >
                    <span className="text-sm font-body font-medium text-heritage">
                        Retirement Villa
                    </span>
                    <div
                        className={`w-12 h-6 rounded-full flex items-center transition-all ${showRetirementVilla
                                ? 'bg-heritage justify-end'
                                : 'bg-coolgrey/20 justify-start'
                            } px-1`}
                    >
                        <div className="w-4 h-4 bg-cloud rounded-full" />
                    </div>
                </button>
            </div>

            {/* Savings Summary Box */}
            {cheapestAlt && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-cloud rounded-xl p-5 border-2"
                    style={{
                        borderColor: isSavings
                            ? 'rgba(212, 175, 55, 0.40)' // Gold border for savings
                            : 'rgba(139, 58, 58, 0.30)', // Maroon border for higher cost
                    }}
                >
                    <div className="flex items-start gap-3">
                        {isSavings ? (
                            <TrendingDown className="w-6 h-6 text-sage flex-shrink-0 mt-1" />
                        ) : (
                            <TrendingUp className="w-6 h-6 text-maroon flex-shrink-0 mt-1" />
                        )}
                        <div className="flex-1">
                            <h4 className="text-sm font-body font-semibold text-heritage mb-2">
                                {isSavings ? 'Cost Savings' : 'Cost Comparison'}
                            </h4>

                            {isSavings ? (
                                <div>
                                    <p className="text-sm font-body text-deepbrown mb-2">
                                        At Year {Math.min(stayYears, 17)}, Mater Maria costs{' '}
                                        <strong className="text-heritage font-semibold">
                                            ₹{formatLakhs(mmCost)} L
                                        </strong>{' '}
                                        vs{' '}
                                        <strong className="text-heritage font-semibold">
                                            ₹{formatLakhs(cheapestAlt.cost)} L
                                        </strong>{' '}
                                        for {cheapestAlt.name}.
                                    </p>
                                    <p
                                        className="text-base font-body font-bold"
                                        style={{
                                            color: '#6E8D5E', // Sage Green
                                            borderBottom: '2px solid #D4AF37', // Gold underline
                                            display: 'inline-block',
                                        }}
                                    >
                                        Savings: ₹{formatLakhs(savings)} L
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm font-body" style={{ color: '#8B3A3A' }}>
                                    {/* Warm Maroon for transparency */}
                                    Mater Maria costs{' '}
                                    <strong className="text-heritage font-semibold">
                                        ₹{formatLakhs(Math.abs(savings))} L more
                                    </strong>{' '}
                                    than {cheapestAlt.name} at Year {Math.min(stayYears, 17)}.
                                </p>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* No Alternatives Selected Message */}
            {alternatives.length === 0 && (
                <div className="bg-coolgrey/10 rounded-xl p-5 border border-coolgrey/20">
                    <p className="text-sm font-body text-coolgrey text-center">
                        Select at least one alternative to see cost comparison
                    </p>
                </div>
            )}
        </div>
    );
};

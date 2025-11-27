import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import type { UnitType } from '../../config/residentPricing';
import { useResidentCalculator } from '../../hooks/useResidentCalculator';
import { ALTERNATIVE_SCENARIOS, AMENITIES } from '../../config/alternatives';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Check, X } from 'lucide-react';

interface SavingsComparisonProps {
    selectedUnit: UnitType | null;
    numResidents: number;
    numCars: number;
    years: number;
}

export const SavingsComparison: React.FC<SavingsComparisonProps> = ({
    selectedUnit,
    numResidents,
    numCars,
    years,
}) => {
    const calculation = useResidentCalculator(selectedUnit, numResidents, numCars, years);
    const [enabledAmenities, setEnabledAmenities] = useState<Set<string>>(new Set());

    const chartData = useMemo(() => {
        if (!calculation || !selectedUnit) return [];

        const data = [];
        for (let year = 1; year <= years; year++) {
            const materMariaCost = calculation.yearByYear[year - 1]?.cumulativeCost || 0;

            let retirementVillaCost = 0;
            let ownHouseCost = 0;

            for (let y = 1; y <= year; y++) {
                retirementVillaCost += ALTERNATIVE_SCENARIOS[1].calculateYearlyCost(y, selectedUnit.basePrice, numResidents, numCars);
                ownHouseCost += ALTERNATIVE_SCENARIOS[2].calculateYearlyCost(y, selectedUnit.basePrice, numResidents, numCars);
            }

            // Add amenity costs for alternatives
            enabledAmenities.forEach(amenityId => {
                const amenity = AMENITIES.find(a => a.id === amenityId);
                if (amenity) {
                    if (!amenity.includedIn.retirementVilla) {
                        retirementVillaCost += amenity.extraCostIfNotIncluded * year;
                    }
                    if (!amenity.includedIn.ownHouse) {
                        ownHouseCost += amenity.extraCostIfNotIncluded * year;
                    }
                }
            });

            data.push({
                year,
                'Mater Maria': Math.round(materMariaCost / 100000), // In lakhs
                'Retirement Villa': Math.round(retirementVillaCost / 100000),
                'Own House + Staff': Math.round(ownHouseCost / 100000),
            });
        }
        return data;
    }, [calculation, selectedUnit, numResidents, numCars, years, enabledAmenities]);

    const finalYearData = chartData[chartData.length - 1];

    if (!calculation || !selectedUnit) {
        return null;
    }

    const toggleAmenity = (amenityId: string) => {
        const newSet = new Set(enabledAmenities);
        if (newSet.has(amenityId)) {
            newSet.delete(amenityId);
        } else {
            newSet.add(amenityId);
        }
        setEnabledAmenities(newSet);
    };

    return (
        <section id="savings" className="py-20 bg-white">
            <div className="container mx-auto px-6 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="font-serif font-bold text-4xl lg:text-5xl text-primary mb-4">
                        Compare with Alternatives
                    </h2>
                    <p className="text-lg text-secondary/70 max-w-2xl mx-auto">
                        See how Mater Maria stacks up against traditional retirement options.
                    </p>
                </motion.div>

                {/* Chart */}
                <Card className="p-6 mb-8">
                    <div className="mb-6">
                        <h3 className="font-bold text-xl text-primary mb-2">Cumulative Cost Over {years} Years</h3>
                        <p className="text-sm text-secondary/60">All values in lakhs (₹L)</p>
                    </div>

                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="year"
                                label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
                                stroke="#64748b"
                            />
                            <YAxis
                                label={{ value: 'Cost (₹L)', angle: -90, position: 'insideLeft' }}
                                stroke="#64748b"
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    padding: '12px'
                                }}
                                formatter={(value: number) => [`₹${value} L`, '']}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="Mater Maria"
                                stroke="#103B32"
                                strokeWidth={3}
                                dot={{ fill: '#103B32', r: 4 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="Retirement Villa"
                                stroke="#CBA35C"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                            />
                            <Line
                                type="monotone"
                                dataKey="Own House + Staff"
                                stroke="#94a3b8"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                            />
                        </LineChart>
                    </ResponsiveContainer>

                    {finalYearData && (
                        <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                            <p className="text-sm text-secondary/80">
                                <strong className="text-primary">At Year {years}:</strong> Mater Maria costs{' '}
                                <strong className="text-accent">₹{finalYearData['Mater Maria']} L</strong> vs{' '}
                                <strong>₹{finalYearData['Retirement Villa']} L</strong> for Retirement Villa and{' '}
                                <strong>₹{finalYearData['Own House + Staff']} L</strong> for Own House.{' '}
                                <span className="text-green-600 font-bold">
                                    Savings: ₹{Math.round(finalYearData['Retirement Villa'] - finalYearData['Mater Maria'])} L
                                </span>
                            </p>
                        </div>
                    )}
                </Card>

                {/* Amenity Checklist */}
                <Card className="p-6">
                    <h3 className="font-bold text-xl text-primary mb-6">What's Included?</h3>
                    <p className="text-sm text-secondary/60 mb-6">
                        Toggle amenities to see how costs change when alternatives need to replicate them.
                    </p>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 px-4 font-bold text-primary">Amenity</th>
                                    <th className="text-center py-3 px-4 font-bold text-primary">Mater Maria</th>
                                    <th className="text-center py-3 px-4 font-bold text-primary">Retirement Villa</th>
                                    <th className="text-center py-3 px-4 font-bold text-primary">Own House</th>
                                    <th className="text-right py-3 px-4 font-bold text-primary">Extra Cost/Year</th>
                                    <th className="text-center py-3 px-4 font-bold text-primary">Include</th>
                                </tr>
                            </thead>
                            <tbody>
                                {AMENITIES.map((amenity) => (
                                    <tr key={amenity.id} className="border-b border-border/50 hover:bg-offwhite transition-colors">
                                        <td className="py-3 px-4 font-medium text-primary">{amenity.name}</td>
                                        <td className="py-3 px-4 text-center">
                                            {amenity.includedIn.materMaria ? (
                                                <Check size={20} className="text-green-600 mx-auto" />
                                            ) : (
                                                <X size={20} className="text-red-400 mx-auto" />
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            {amenity.includedIn.retirementVilla ? (
                                                <Check size={20} className="text-green-600 mx-auto" />
                                            ) : (
                                                <X size={20} className="text-red-400 mx-auto" />
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            {amenity.includedIn.ownHouse ? (
                                                <Check size={20} className="text-green-600 mx-auto" />
                                            ) : (
                                                <X size={20} className="text-red-400 mx-auto" />
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-right text-secondary">
                                            {amenity.extraCostIfNotIncluded > 0
                                                ? `₹${(amenity.extraCostIfNotIncluded / 100000).toFixed(1)} L`
                                                : '—'
                                            }
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={enabledAmenities.has(amenity.id)}
                                                onChange={() => toggleAmenity(amenity.id)}
                                                className="w-5 h-5 accent-primary cursor-pointer"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </section>
    );
};

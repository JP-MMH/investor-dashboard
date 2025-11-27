import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import type { UnitType } from '../../config/residentPricing';
import { useResidentCalculator } from '../../hooks/useResidentCalculator';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface StayCostCalculatorProps {
    selectedUnit: UnitType | null;
    numResidents: number;
    numCars: number;
    years: number;
}

export const StayCostCalculator: React.FC<StayCostCalculatorProps> = ({
    selectedUnit,
    numResidents,
    numCars,
    years,
}) => {
    const [showBreakdown, setShowBreakdown] = useState(false);
    const calculation = useResidentCalculator(selectedUnit, numResidents, numCars, years);

    if (!calculation || !selectedUnit) {
        return (
            <section className="py-20 bg-gradient-to-br from-offwhite to-white">
                <div className="container mx-auto px-6 lg:px-12">
                    <Card className="max-w-4xl mx-auto p-12 text-center">
                        <p className="text-lg text-secondary/60">
                            Please select a unit type to see cost estimates.
                        </p>
                    </Card>
                </div>
            </section>
        );
    }

    const formatCurrency = (amount: number) => {
        if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    return (
        <section className="py-20 bg-gradient-to-br from-offwhite to-white">
            <div className="container mx-auto px-6 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="font-serif font-bold text-4xl lg:text-5xl text-primary mb-4">
                        Your Stay Cost Summary
                    </h2>
                    <p className="text-lg text-secondary/70 max-w-2xl mx-auto">
                        Transparent breakdown of all costs for {selectedUnit.name} over {years} years.
                    </p>
                </motion.div>

                {/* 3-Column Summary */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {/* Upfront */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="h-full p-6 bg-white border-2 border-primary/20">
                            <div className="text-xs font-bold text-primary uppercase tracking-wider mb-4">
                                Upfront Costs
                            </div>
                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-secondary/70">Buy-in Price</span>
                                    <span className="font-bold text-primary">{formatCurrency(calculation.buyIn)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-secondary/70">Refundable Deposit (15%)</span>
                                    <span className="font-bold text-accent">{formatCurrency(calculation.depositAmount)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-secondary/70">Caution Deposits</span>
                                    <span className="font-bold text-primary">{formatCurrency(calculation.cautionDeposits)}</span>
                                </div>
                            </div>
                            <div className="pt-3 border-t border-border">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-primary">Total Upfront</span>
                                    <span className="text-2xl font-bold text-primary">{formatCurrency(calculation.totalUpfront)}</span>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Annual */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="h-full p-6 bg-white border-2 border-accent/20">
                            <div className="text-xs font-bold text-accent uppercase tracking-wider mb-4">
                                Annual Running Cost
                            </div>
                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-secondary/70">Service Fee (with GST)</span>
                                    <span className="font-bold text-primary">{formatCurrency(calculation.serviceWithGST)}</span>
                                </div>
                                {calculation.parkingPerYear > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-secondary/70">Parking ({numCars} car{numCars > 1 ? 's' : ''})</span>
                                        <span className="font-bold text-primary">{formatCurrency(calculation.parkingPerYear)}</span>
                                    </div>
                                )}
                            </div>
                            <div className="pt-3 border-t border-border space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-primary">Total Annual</span>
                                    <span className="text-2xl font-bold text-accent">{formatCurrency(calculation.totalAnnual)}</span>
                                </div>
                                <div className="text-xs text-secondary/60 text-right">
                                    {formatCurrency(calculation.monthlyEquivalent)}/month
                                </div>
                                <div className="text-xs text-secondary/60 text-right">
                                    {formatCurrency(calculation.perResidentMonthly)}/month per resident
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Exit */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="h-full p-6 bg-white border-2 border-primary/20">
                            <div className="text-xs font-bold text-primary uppercase tracking-wider mb-4">
                                Exit & Effective Cost
                            </div>
                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-secondary/70">Total Before Refund</span>
                                    <span className="font-bold text-primary">{formatCurrency(calculation.totalCostBeforeRefund)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-secondary/70">Refund ({(calculation.refundPercentage * 100).toFixed(0)}%)</span>
                                    <span className="font-bold text-green-600">-{formatCurrency(calculation.refundedDeposit)}</span>
                                </div>
                            </div>
                            <div className="pt-3 border-t border-border space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-primary">Effective Net Cost</span>
                                    <span className="text-2xl font-bold text-primary">{formatCurrency(calculation.effectiveNetCost)}</span>
                                </div>
                                <div className="text-xs text-secondary/60 text-right">
                                    {formatCurrency(calculation.effectiveCostPerYear)}/year
                                </div>
                                <div className="text-xs text-secondary/60 text-right">
                                    {formatCurrency(calculation.effectiveCostPerMonth)}/month
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>

                {/* Year-by-Year Breakdown */}
                <Card className="max-w-4xl mx-auto p-6">
                    <button
                        onClick={() => setShowBreakdown(!showBreakdown)}
                        className="w-full flex items-center justify-between text-left"
                    >
                        <div>
                            <h3 className="font-bold text-lg text-primary mb-1">Year-by-Year Breakdown</h3>
                            <p className="text-sm text-secondary/60">Detailed cost progression over {years} years</p>
                        </div>
                        {showBreakdown ? <ChevronUp size={24} className="text-primary" /> : <ChevronDown size={24} className="text-primary" />}
                    </button>

                    <AnimatePresence>
                        {showBreakdown && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="mt-6 overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-border">
                                                <th className="text-left py-3 px-4 font-bold text-primary">Year</th>
                                                <th className="text-right py-3 px-4 font-bold text-primary">Service Cost</th>
                                                <th className="text-right py-3 px-4 font-bold text-primary">Cumulative Cost</th>
                                                <th className="text-left py-3 px-4 font-bold text-primary">Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {calculation.yearByYear.map((row) => (
                                                <tr key={row.year} className="border-b border-border/50 hover:bg-offwhite transition-colors">
                                                    <td className="py-3 px-4 font-medium text-primary">{row.year}</td>
                                                    <td className="py-3 px-4 text-right text-secondary">{formatCurrency(row.serviceCost)}</td>
                                                    <td className="py-3 px-4 text-right font-bold text-primary">{formatCurrency(row.cumulativeCost)}</td>
                                                    <td className="py-3 px-4 text-secondary/60 text-sm">{row.notes}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>
            </div>
        </section>
    );
};

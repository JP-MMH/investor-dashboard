import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../lib/utils';
import { Info } from 'lucide-react';

interface DividendCardProps {
    totalDividends: number; // This might need to be recalculated based on slider
    avgAnnualDividend: number;
    returnPercentage: number;
    breakdown: any[]; // Pass the full breakdown to calculate based on slider
}

export const DividendCard: React.FC<DividendCardProps> = ({ breakdown }) => {
    const [endYear, setEndYear] = useState(15);
    const [calculatedTotal, setCalculatedTotal] = useState(0);

    // Slider range: Year 6 to Year 15 (where dividends are paid)
    const minYear = 6;
    const maxYear = 15;

    useEffect(() => {
        // Calculate total dividends up to the selected end year
        // Filter by year (not yearIndex) and sum dividends
        const total = breakdown
            .filter(row => row.year >= 6 && row.year <= endYear)
            .reduce((sum, row) => sum + row.dividend, 0);
        setCalculatedTotal(total);
    }, [endYear, breakdown]);


    return (
        <Card className="bg-white border border-border p-6 mt-6 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="text-secondary/60 text-xs font-bold uppercase tracking-wider mb-1">
                        Projected Dividend Income
                    </div>
                    <div className="text-xs text-secondary/40">
                        From Year 6 to Year {endYear}
                    </div>
                </div>
                <div className="group relative">
                    <Info size={16} className="text-secondary/40 cursor-help hover:text-accent transition-colors" />

                    {/* Tooltip */}
                    <div className="absolute right-0 top-6 w-64 bg-primary text-white text-xs p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                        <p className="leading-relaxed">
                            The sliders illustrate cumulative dividends based on total projected distributions reviewed by the CA. These figures are indicative and follow the financial model's total payout schedule, beginning from Year 6.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <div className="text-3xl font-serif font-bold text-primary mb-1">
                    {formatCurrency(calculatedTotal)}
                </div>
                <div className="text-xs font-medium text-green-600 bg-green-50 inline-block px-2 py-1 rounded-full">
                    TOTAL DIVIDENDS
                </div>
            </div>

            {/* Slider */}
            <div className="mb-2">
                <div className="flex justify-between text-[10px] text-secondary/40 mb-2 uppercase font-bold tracking-wider">
                    <span>Show cumulative dividends until Year {endYear}</span>
                </div>
                <input
                    type="range"
                    min={minYear}
                    max={maxYear}
                    step={1}
                    value={endYear}
                    onChange={(e) => setEndYear(parseInt(e.target.value))}
                    className="w-full h-2 bg-offwhite rounded-lg appearance-none cursor-pointer accent-accent"
                />
                <div className="flex justify-between text-[10px] text-secondary/40 mt-1">
                    <span>Year 6</span>
                    <span>Year 15</span>
                </div>
            </div>
        </Card>
    );
};

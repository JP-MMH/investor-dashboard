import React from 'react';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../lib/utils';
import { BarChart3 } from 'lucide-react';

interface DividendCardProps {
    breakdown: any[];
    totalDividends: number;
    avgAnnualDividend: number;
    returnPercentage: number;
}

export const DividendCard: React.FC<DividendCardProps> = ({
    totalDividends,
    avgAnnualDividend,
    returnPercentage,
}) => {
    return (
        <Card className="bg-mmh-investor-blue/50 border-mmh-gold/20 backdrop-blur-sm">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="text-mmh-gold" size={24} />
                        <h3 className="text-xl font-serif font-bold text-mmh-gold">Cash Distributions (CA Model)</h3>
                    </div>
                    <p className="text-mmh-ivory/60 text-sm">
                        Total cash paid to investor over 15 years
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-mmh-investor-blue/80 rounded-lg border border-mmh-gold/10">
                    <div className="text-mmh-ivory/60 text-xs uppercase tracking-wider mb-2">
                        Total Cash Paid
                    </div>
                    <div className="text-2xl font-serif font-bold text-mmh-gold">
                        {formatCurrency(totalDividends)}
                    </div>
                </div>

                <div className="p-4 bg-mmh-investor-blue/80 rounded-lg border border-mmh-gold/10">
                    <div className="text-mmh-ivory/60 text-xs uppercase tracking-wider mb-2">
                        Avg. Annual
                    </div>
                    <div className="text-2xl font-serif font-bold text-mmh-gold">
                        {formatCurrency(avgAnnualDividend)}
                    </div>
                </div>

                <div className="p-4 bg-mmh-investor-blue/80 rounded-lg border border-mmh-gold/10">
                    <div className="text-mmh-ivory/60 text-xs uppercase tracking-wider mb-2">
                        Dividend Yield
                    </div>
                    <div className="text-2xl font-serif font-bold text-mmh-gold">
                        {returnPercentage.toFixed(1)}%
                    </div>
                </div>
            </div>
        </Card>
    );
};

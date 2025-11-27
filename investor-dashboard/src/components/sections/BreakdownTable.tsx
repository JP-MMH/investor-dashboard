import React from 'react';
import type { YearlyBreakdownRow } from '../../lib/financialModel';
import { formatCurrency } from '../../lib/utils';

interface BreakdownTableProps {
    data: YearlyBreakdownRow[];
}

export const BreakdownTable: React.FC<BreakdownTableProps> = ({ data }) => {
    return (
        <div className="w-full mt-8 overflow-hidden rounded-xl border border-border shadow-sm bg-white">
            <div className="p-4 bg-offwhite border-b border-border">
                <h3 className="text-lg font-bold text-primary">Detailed Year-by-Year Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-offwhite/50 text-secondary font-bold uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 sticky left-0 bg-offwhite z-10 border-r border-border">Year</th>
                            <th className="px-4 py-3 text-primary">Opening Value</th>
                            <th className="px-4 py-3 text-accent">Deposit Interest<br /><span className="text-[10px] normal-case opacity-70">(10% from 2027)</span></th>
                            <th className="px-4 py-3 text-accent">Dividend<br /><span className="text-[10px] normal-case opacity-70">(from 2030)</span></th>
                            <th className="px-4 py-3 font-bold text-primary bg-primary/5">Closing Value<br />(Mater Maria)</th>
                            <th className="px-4 py-3 text-secondary/70">FD Value</th>
                            <th className="px-4 py-3 text-secondary/70">Govt Bond</th>
                            <th className="px-4 py-3 text-secondary/70">Mutual Fund</th>
                            <th className="px-4 py-3 text-secondary/70">Equity</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {data.map((row) => (
                            <tr key={row.year} className="hover:bg-offwhite/30 transition-colors">
                                <td className="px-4 py-3 font-bold text-primary sticky left-0 bg-white border-r border-border">Year {row.year}</td>
                                <td className="px-4 py-3">{formatCurrency(row.openingValue)}</td>
                                <td className="px-4 py-3 text-accent font-medium">{row.depositInterest > 0 ? formatCurrency(row.depositInterest) : '-'}</td>
                                <td className="px-4 py-3 text-accent font-medium">{row.dividend > 0 ? formatCurrency(row.dividend) : '-'}</td>
                                <td className="px-4 py-3 font-bold text-primary bg-primary/5">{formatCurrency(row.closingValue)}</td>
                                <td className="px-4 py-3 text-secondary/70">{formatCurrency(row.fdValue)}</td>
                                <td className="px-4 py-3 text-secondary/70">{formatCurrency(row.bondValue)}</td>
                                <td className="px-4 py-3 text-secondary/70">{formatCurrency(row.mfValue)}</td>
                                <td className="px-4 py-3 text-secondary/70">{formatCurrency(row.equityValue)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

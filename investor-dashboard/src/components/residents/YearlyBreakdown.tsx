/**
 * Yearly Breakdown Table
 * Mater Maria Homes
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Download } from 'lucide-react';
import { useResidentStore } from '../../state/useResidentStore';
import { formatLakhs } from '../../utils/formatters';

export const YearlyBreakdown = () => {
    const { yearByYear } = useResidentStore();
    const [isExpanded, setIsExpanded] = useState(false);

    const handleDownloadPDF = () => {
        // Simple print functionality for now
        window.print();
    };

    return (
        <div className="bg-cloud rounded-xl shadow-soft border border-coolgrey/10 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-heritage/5 to-sage/5 border-b border-coolgrey/10 flex items-center justify-between">
                <div>
                    <h3 className="font-heading text-lg font-semibold text-heritage">
                        Year-by-Year Breakdown
                    </h3>
                    <p className="text-xs text-coolgrey font-body mt-1">
                        Detailed cost progression over your stay
                    </p>
                </div>
                <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-heritage text-cloud text-sm font-body font-medium hover:bg-heritage/90 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download PDF</span>
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-sage/10 sticky top-0">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-body font-semibold text-heritage uppercase tracking-wider">
                                Year
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-body font-semibold text-heritage uppercase tracking-wider">
                                Service Cost
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-body font-semibold text-heritage uppercase tracking-wider">
                                Cumulative
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-body font-semibold text-heritage uppercase tracking-wider">
                                Notes
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {yearByYear.slice(0, isExpanded ? yearByYear.length : 5).map((row, index) => (
                                <motion.tr
                                    key={row.year}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className={`${index % 2 === 0 ? 'bg-cloud' : 'bg-sage/5'
                                        } hover:outline hover:outline-1 hover:outline-gold/20 transition-all`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-body text-heritage">
                                        Year {row.year}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-body text-heritage text-right">
                                        {formatLakhs(row.serviceCostLakh)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-body font-semibold text-gold text-right">
                                        {formatLakhs(row.cumulativeLakh)}
                                    </td>
                                    <td className="px-6 py-4 text-xs font-body text-coolgrey">
                                        {row.notes || '—'}
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Expand/Collapse Button */}
            {yearByYear.length > 5 && (
                <div className="px-6 py-4 bg-sage/5 border-t border-coolgrey/10">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-full flex items-center justify-center gap-2 text-sm font-body font-medium text-heritage hover:text-gold transition-colors"
                    >
                        {isExpanded ? (
                            <>
                                <ChevronUp className="w-4 h-4" />
                                <span>Show less</span>
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-4 h-4" />
                                <span>Show all {yearByYear.length} years</span>
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

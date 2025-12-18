import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { getCAOutcome, getProjectTotals, type RiskModel, getRiskDescription } from '../../lib/financialModel';

const RISK_MODELS: { id: RiskModel; label: string }[] = [
    { id: 'AGGRESSIVE', label: 'Aggressive' },
    { id: 'MODERATE', label: 'Moderate' },
    { id: 'CONSERVATIVE', label: 'Conservative' },
];

export const OccupancySensitivitySection: React.FC = () => {
    const [occupancy, setOccupancy] = useState(80);
    const [riskModel, setRiskModel] = useState<RiskModel>('MODERATE');

    // Get Base Metrics from CA Model
    // We use Platinum 1 unit as a baseline for IRR/CAGR since CAGR is constant across tiers
    const caOutcome = getCAOutcome(riskModel, 'PLATINUM', 1);
    const baseCagr = caOutcome.expectedCagr;

    // Get Coverage Ratio
    const totals = getProjectTotals(riskModel);
    const totalAssets = totals.fdPool + totals.currentAssets;
    const liability = totals.liabilityInmates;
    const coverageRatio = totalAssets / liability;

    // Dynamic Metrics Calculation
    const getMetrics = (occ: number) => {
        // Simple linear reduction logic for illustration
        // 100% occ = Base CAGR + 0.5% (bonus)
        // 80% occ = Base CAGR
        // 60% occ = Base CAGR - 2.0%

        const deviation = (occ - 80) / 20; // -1 at 60%, 0 at 80%, +1 at 100%
        let adjustedIrr = baseCagr + (deviation * 1.0); // +/- 1% swing roughly

        // Cap/Floor for realism
        if (adjustedIrr < 0) adjustedIrr = 0;

        let status = 'Stable';
        let color = 'text-primary';

        if (occ >= 90) { status = 'Excellent'; color = 'text-green-600'; }
        else if (occ >= 80) { status = 'Safe'; color = 'text-primary'; }
        else if (occ >= 70) { status = 'Breakeven'; color = 'text-yellow-600'; }
        else { status = 'Stress'; color = 'text-red-600'; }

        return {
            irr: adjustedIrr.toFixed(2) + '%',
            status,
            color
        };
    };

    const metrics = getMetrics(occupancy);

    return (
        <section id="sensitivity" className="py-20 bg-offwhite">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-serif font-bold text-primary mb-4">Occupancy Sensitivity</h2>
                    <div className="w-16 h-1 bg-accent mx-auto mb-6" />
                    <p className="text-lg text-secondary/80 max-w-2xl mx-auto">
                        Test the model's resilience. We break even at ~65-70% occupancy.
                    </p>

                    {/* Risk Model Selector */}
                    <div className="mt-8 flex flex-col items-center">
                        <div className="text-xs uppercase tracking-wider mb-2 font-bold text-secondary/60">Select Risk Model</div>
                        <div className="bg-white p-1 rounded-lg border border-gray-200 inline-flex shadow-sm">
                            {RISK_MODELS.map((model) => (
                                <button
                                    key={model.id}
                                    onClick={() => setRiskModel(model.id)}
                                    className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${riskModel === model.id
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'text-secondary/60 hover:text-primary hover:bg-gray-100'
                                        }`}
                                >
                                    {model.label}
                                </button>
                            ))}
                        </div>
                        <p className="mt-2 text-sm text-secondary/60 italic">
                            {getRiskDescription(riskModel)}
                        </p>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto">
                    <Card className="p-8">
                        <div className="mb-8">
                            <label className="block text-center font-bold text-primary mb-4 text-lg">
                                Average Occupancy: <span className="text-accent text-2xl">{occupancy}%</span>
                            </label>
                            <input
                                type="range"
                                min="60"
                                max="100"
                                step="5"
                                value={occupancy}
                                onChange={(e) => setOccupancy(Number(e.target.value))}
                                className="w-full h-3 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <div className="flex justify-between text-xs text-secondary/60 mt-2 px-1">
                                <span>60% (Stress)</span>
                                <span>70% (Breakeven)</span>
                                <span>80% (Base)</span>
                                <span>90%</span>
                                <span>100%</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-offwhite rounded-xl p-4 text-center border border-border">
                                <div className="text-secondary/60 text-sm font-medium mb-1">Projected IRR</div>
                                <div className={`text-3xl font-serif font-bold ${metrics.color}`}>{metrics.irr}</div>
                                <div className="text-[10px] text-secondary/50 mt-1 leading-tight">
                                    IRR applies to entire project. Your plan participates proportionally.
                                </div>
                            </div>
                            <div className="bg-offwhite rounded-xl p-4 text-center border border-border">
                                <div className="text-secondary/60 text-sm font-medium mb-1">Refund Coverage</div>
                                <div className="text-xl font-bold text-primary flex items-center justify-center gap-2">
                                    <ShieldCheck size={20} className={coverageRatio >= 1 ? "text-green-600" : "text-red-600"} />
                                    {coverageRatio >= 1 ? "100%" : `${(coverageRatio * 100).toFixed(0)}%`}
                                </div>
                                <div className="text-[10px] text-secondary/50 mt-1 leading-tight">
                                    Based on {riskModel.toLowerCase()} asset allocation.
                                </div>
                            </div>
                            <div className="bg-offwhite rounded-xl p-4 text-center border border-border">
                                <div className="text-secondary/60 text-sm font-medium mb-1">Health Status</div>
                                <div className={`text-xl font-bold ${metrics.color} flex items-center justify-center gap-2`}>
                                    {metrics.status === 'Stress' && <AlertTriangle size={20} />}
                                    {metrics.status}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
};

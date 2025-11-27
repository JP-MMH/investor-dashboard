import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export const OccupancySensitivitySection: React.FC = () => {
    const [occupancy, setOccupancy] = useState(80);

    // Simple mapping logic for demo purposes
    const getMetrics = (occ: number) => {
        if (occ >= 90) return { irr: '9.2%', status: 'Excellent', color: 'text-green-600', buffer: 'High' };
        if (occ >= 80) return { irr: '8.68%', status: 'Safe', color: 'text-primary', buffer: 'Healthy' };
        if (occ >= 70) return { irr: '7.5%', status: 'Stable', color: 'text-yellow-600', buffer: 'Moderate' };
        return { irr: '6.0%', status: 'Tight', color: 'text-risk', buffer: 'Low' };
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
                                    <ShieldCheck size={20} className="text-green-600" /> 100%
                                </div>
                            </div>
                            <div className="bg-offwhite rounded-xl p-4 text-center border border-border">
                                <div className="text-secondary/60 text-sm font-medium mb-1">Health Status</div>
                                <div className={`text-xl font-bold ${metrics.color} flex items-center justify-center gap-2`}>
                                    {metrics.status === 'Tight' && <AlertTriangle size={20} />}
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

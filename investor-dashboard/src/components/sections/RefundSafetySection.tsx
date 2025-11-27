import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../lib/utils';

interface RefundSafetySectionProps {
    amount: number;
}

export const RefundSafetySection: React.FC<RefundSafetySectionProps> = ({ amount }) => {

    // Hardcoded project totals
    const totalRefundLiability = 613900000; // ~61.39 Cr
    const totalAssets = 671200000; // ~67.12 Cr
    const surplus = totalAssets - totalRefundLiability;

    // Calculate investor's proportional share (illustrative)
    // Assuming total project equity pool is roughly equal to refund liability for this calc
    const investorShareRatio = amount / totalRefundLiability;
    const investorBufferShare = surplus * investorShareRatio;

    return (
        <section id="safety" className="py-20 bg-offwhite">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-serif font-bold text-primary mb-4">How Refunds Are Protected</h2>
                    <div className="w-16 h-1 bg-accent mx-auto mb-6" />
                    <p className="text-lg text-secondary/80 max-w-2xl mx-auto">
                        Even in a worst-case shutdown scenario in Year 15, assets exceed liabilities.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Card className="p-8">
                            <div className="space-y-8">

                                {/* Bar 1: Liability */}
                                <div>
                                    <div className="flex justify-between text-sm font-bold text-secondary mb-2">
                                        <span>Resident Refund Obligations (Max Liability)</span>
                                        <span>₹61.39 Cr</span>
                                    </div>
                                    <div className="h-12 w-full bg-gray-200 rounded-full overflow-hidden relative">
                                        <div className="h-full bg-risk w-[91%] rounded-full relative">
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-xs font-bold">Obligation</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Bar 2: Assets */}
                                <div>
                                    <div className="flex justify-between text-sm font-bold text-secondary mb-2">
                                        <span>Assets Available (FD + MF + Cash)</span>
                                        <span className="text-primary">₹67.12 Cr</span>
                                    </div>
                                    <div className="h-12 w-full bg-gray-200 rounded-full overflow-hidden flex">
                                        <div className="h-full bg-primary w-[91%] flex items-center justify-end pr-4">
                                            <span className="text-white/80 text-xs font-bold">Covered</span>
                                        </div>
                                        <div className="h-full bg-accent w-[9%] flex items-center justify-center relative group cursor-help">
                                            <span className="text-primary text-xs font-bold">Buffer</span>
                                            <div className="absolute bottom-full mb-2 bg-primary text-white text-xs p-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                                Surplus: ~₹5.73 Cr
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-offwhite rounded-xl p-6 border border-border mt-8">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-accent/20 text-accent flex items-center justify-center flex-shrink-0 font-serif font-bold text-xl">i</div>
                                        <div>
                                            <h4 className="font-bold text-primary mb-1">Safety Cushion</h4>
                                            <p className="text-sm text-secondary/80 leading-relaxed">
                                                If the company shut down in year 15 and refunded every resident in full, total liquid assets of <strong>₹67.12 Cr</strong> would cover maximum refunds of <strong>₹61.39 Cr</strong> and still leave a surplus.
                                            </p>
                                            <div className="mt-3 pt-3 border-t border-border/50 text-sm font-medium text-primary">
                                                Based on your total commitment of {formatCurrency(amount)}, your proportional share of this safety buffer is approx. <span className="text-accent">{formatCurrency(investorBufferShare)}</span>.
                                            </div>                      </div>
                                    </div>
                                </div>
                            </div>

                        </Card>
                    </motion.div>
                </div>
            </div>
        </section >
    );
};

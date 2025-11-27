import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Check, Calendar, Star } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

type PlanType = 'platinum' | 'gold' | 'silver';

interface PlanDetailsSectionProps {
    selectedPlan: PlanType;
    lots: number;
}

const PLANS = {
    platinum: {
        name: 'Founding Partner',
        tier: 'Platinum',
        color: '#103B32',
        accent: '#CBA35C',
        schedule: [
            { installment: '1st', amount: 500000, timing: 'At Joining', type: 'Share Capital' },
            { installment: '2nd', amount: 500000, timing: '+1 month', type: 'Deposit' },
            { installment: '3rd', amount: 500000, timing: '+4 months after 2nd', type: 'Share Capital' },
            { installment: '4th', amount: 500000, timing: '+5 months after 3rd', type: 'Deposit' },
            { installment: '5th', amount: 500000, timing: '+5 months after 4th', type: 'Share Capital' },
            { installment: '6th', amount: 500000, timing: '+6 months after 5th', type: 'Share Capital' },
        ],
        privileges: [
            '5 days free stay in Guest House yearly',
            '30% discount on guest room rents (in addition to free stay)',
            '20% discount on family tour packages',
            '1 day free usage of multipurpose hall / open party space (up to 150 pax) yearly',
            '15% discount on wellness packages yearly'
        ],
        exitRule: 'Share sale allowed after 5 years, with 6 months’ notice, disbursed in 3 installments.'
    },
    gold: {
        name: 'Core Investor',
        tier: 'Gold',
        color: '#153F35',
        accent: '#E8D3A3',
        schedule: [
            { installment: '1st', amount: 500000, timing: 'At Joining', type: 'Share Capital' },
            { installment: '2nd', amount: 500000, timing: '+2 months after 1st', type: 'Deposit' },
            { installment: '3rd', amount: 500000, timing: '+4 months after 2nd', type: 'Share Capital' },
            { installment: '4th', amount: 500000, timing: '+6 months after 3rd', type: 'Deposit' },
        ],
        privileges: [
            '3 days free stay in Guest House yearly',
            '20% discount on guest room rents (in addition to free stay)',
            '15% discount on family tour packages',
            '1 day free usage of multipurpose hall / open party space (up to 150 pax) yearly',
            '10% discount on wellness packages yearly'
        ],
        exitRule: 'Share sale allowed after 5 years, with 6 months’ notice, disbursed in 2 installments.'
    },
    silver: {
        name: 'Early Contributor',
        tier: 'Silver',
        color: '#475569',
        accent: '#94a3b8',
        schedule: [
            { installment: '1st', amount: 400000, timing: 'At Joining', type: 'Share Capital' },
            { installment: '2nd', amount: 250000, timing: '+1 month', type: 'Deposit' },
            { installment: '3rd', amount: 350000, timing: '+6 months after 2nd', type: 'Share Capital' },
        ],
        privileges: [
            '1 day free stay in Guest House yearly',
            '10% discount on guest room rents (in addition to free stay)',
            '10% discount on family tour packages',
            '1 day free usage (or appropriate discount) on multipurpose hall',
            '10% discount on wellness packages yearly'
        ],
        exitRule: 'Share sale allowed after 5 years, with 6 months’ notice.'
    }
};

export const PlanDetailsSection: React.FC<PlanDetailsSectionProps> = ({ selectedPlan, lots }) => {
    const plan = PLANS[selectedPlan];

    return (
        <section className="py-20 bg-white">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-serif font-bold text-primary mb-4">Plan Details & Investor Privileges</h2>
                    <div className="w-16 h-1 bg-accent mx-auto mb-6" />
                    <p className="text-lg text-secondary/80 max-w-2xl mx-auto">
                        Financials are only half the story. Each plan also carries lifestyle privileges and exit flexibility.
                    </p>
                </div>

                <motion.div
                    key={selectedPlan}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="overflow-hidden border-t-4" style={{ borderTopColor: plan.accent }}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

                            {/* Left: Contribution Schedule */}
                            <div className="p-8 border-b lg:border-b-0 lg:border-r border-border">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-offwhite text-primary">
                                        <Calendar size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-primary">Contribution Schedule</h3>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-offwhite text-secondary font-bold uppercase text-xs">
                                            <tr>
                                                <th className="px-4 py-3 rounded-l-lg">Installment</th>
                                                <th className="px-4 py-3">Amount</th>
                                                <th className="px-4 py-3">Timing</th>
                                                <th className="px-4 py-3 rounded-r-lg">Type</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/50">
                                            {plan.schedule.map((row, idx) => (
                                                <tr key={idx} className="hover:bg-offwhite/30 transition-colors">
                                                    <td className="px-4 py-3 font-medium text-primary">{row.installment}</td>
                                                    <td className="px-4 py-3 font-bold text-primary">{formatCurrency(row.amount * lots)}</td>
                                                    <td className="px-4 py-3 text-secondary/80">{row.timing}</td>
                                                    <td className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-secondary/60">{row.type}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Right: Privileges & Exit */}
                            <div className="p-8 bg-offwhite/30 flex flex-col h-full">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-offwhite text-accent">
                                        <Star size={24} fill="currentColor" />
                                    </div>
                                    <h3 className="text-xl font-bold text-primary">Lifestyle Privileges</h3>
                                </div>

                                <ul className="space-y-3 mb-8 flex-1">
                                    {plan.privileges.map((privilege, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-secondary/90">
                                            <Check size={18} className="text-accent mt-1 flex-shrink-0" />
                                            <span className="text-sm leading-relaxed">{privilege}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-auto bg-primary/5 rounded-xl p-4 border border-primary/10">
                                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Share Sale / Exit Rules</h4>
                                    <p className="text-sm text-secondary font-medium">
                                        {plan.exitRule}
                                    </p>
                                </div>
                            </div>

                        </div>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
};

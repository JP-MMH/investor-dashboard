/**
 * Cost Summary - Card Trio
 * Mater Maria Homes
 */

import { motion } from 'framer-motion';
import { DollarSign, Calendar, TrendingDown } from 'lucide-react';
import { useResidentStore } from '../../state/useResidentStore';
import { formatLakhs } from '../../utils/formatters';
import { calculateRefundAmount } from '../../utils/depositLogic';
import { DEPOSIT_PERCENTAGE } from '../../config/residentPricing';

export const CostSummary = () => {
    const { unitType, totalUpfrontLakh, annualCostLakh, effectiveNetCostLakh, stayYears } =
        useResidentStore();

    const depositLakhs = (unitType.basePrice * DEPOSIT_PERCENTAGE) / 100000;
    const refundLakhs = calculateRefundAmount(depositLakhs, stayYears);

    const cards = [
        {
            id: 'upfront',
            title: 'Upfront Cost',
            icon: DollarSign,
            value: totalUpfrontLakh,
            description: 'Refundable deposit + caution deposits',
            gradient: 'from-sage/20 to-cloud',
        },
        {
            id: 'annual',
            title: 'Annual Cost',
            icon: Calendar,
            value: annualCostLakh,
            description: 'Service fees + GST + parking',
            gradient: 'from-gold/15 to-cloud',
        },
        {
            id: 'effective',
            title: 'Effective Net Cost',
            icon: TrendingDown,
            value: effectiveNetCostLakh,
            description: `Total cost over ${stayYears} years minus ${formatLakhs(refundLakhs)} refund`,
            gradient: 'from-terra/15 to-cloud',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Section Header */}
            <div className="text-center">
                <h3 className="text-2xl font-heading font-semibold text-heritage mb-2">
                    Your Stay Cost Summary
                </h3>
                <p className="text-sm text-coolgrey font-body">
                    Transparent breakdown of all costs
                </p>
            </div>

            {/* Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                {cards.map((card, index) => {
                    const Icon = card.icon;

                    return (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                            className={`bg-gradient-to-br ${card.gradient} rounded-xl shadow-soft border border-coolgrey/10 p-6`}
                        >
                            {/* Icon */}
                            <div className="w-10 h-10 rounded-full bg-heritage/10 flex items-center justify-center mb-4">
                                <Icon className="w-5 h-5 text-heritage" />
                            </div>

                            {/* Title */}
                            <h4 className="font-heading text-lg font-semibold text-heritage mb-2">
                                {card.title}
                            </h4>

                            {/* Value */}
                            <div className="mb-3">
                                <span className="text-3xl font-heading font-bold text-gold">
                                    {formatLakhs(card.value)}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-xs text-heritage/70 font-body leading-relaxed">
                                {card.description}
                            </p>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

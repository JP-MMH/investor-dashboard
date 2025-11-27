/**
 * Unit Selector - Dropdown + Smart Preview
 * Mater Maria Homes
 */

import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { useResidentStore } from '../../state/useResidentStore';
import { UNIT_TYPES } from '../../config/residentPricing';
import { formatLakhs } from '../../utils/formatters';

export const UnitSelector = () => {
    const { unitType, setUnitType } = useResidentStore();

    return (
        <div className="space-y-6">
            {/* Dropdown */}
            <div>
                <label
                    htmlFor="unit-select"
                    className="block text-sm font-body font-medium text-heritage mb-2"
                >
                    Choose your unit type
                </label>
                <select
                    id="unit-select"
                    value={unitType.id}
                    onChange={(e) => setUnitType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-coolgrey/30 bg-cloud text-heritage font-body focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                >
                    {UNIT_TYPES.map((unit) => (
                        <option key={unit.id} value={unit.id}>
                            {unit.name} – {unit.sqft} sq ft – {formatLakhs(unit.basePrice / 100000)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Smart Preview Card */}
            <motion.div
                key={unitType.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="bg-gradient-to-br from-sage/20 to-cloud rounded-xl shadow-soft border border-coolgrey/10 p-6"
            >
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-full bg-heritage/10 flex items-center justify-center flex-shrink-0">
                        <Home className="w-6 h-6 text-heritage" />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                        <h3 className="font-heading text-lg font-semibold text-heritage mb-1">
                            {unitType.name}
                        </h3>
                        <p className="text-sm text-coolgrey font-body mb-3">
                            {unitType.sqft} sq ft • {unitType.bedrooms} bedroom{unitType.bedrooms > 1 ? 's' : ''}
                        </p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-heading font-bold text-gold">
                                {formatLakhs(unitType.basePrice / 100000)}
                            </span>
                            <span className="text-sm text-coolgrey font-body">base price</span>
                        </div>
                    </div>
                </div>

                {/* Category Badge */}
                <div className="mt-4 pt-4 border-t border-coolgrey/20">
                    <span className="inline-block px-3 py-1 rounded-full bg-heritage/10 text-xs font-body font-medium text-heritage">
                        {unitType.category.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                </div>
            </motion.div>
        </div>
    );
};

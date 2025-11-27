import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import type { UnitType } from '../../config/residentPricing';
import { UNIT_TYPES, DEPOSIT_REFUND_BANDS } from '../../config/residentPricing';
import { Plus, Minus, Info } from 'lucide-react';

interface ResidentPreferencesProps {
    selectedUnit: UnitType | null;
    setSelectedUnit: (unit: UnitType) => void;
    numResidents: number;
    setNumResidents: (num: number) => void;
    numCars: number;
    setNumCars: (num: number) => void;
    years: number;
    setYears: (years: number) => void;
}

export const ResidentPreferences: React.FC<ResidentPreferencesProps> = ({
    selectedUnit,
    setSelectedUnit,
    numResidents,
    setNumResidents,
    numCars,
    setNumCars,
    years,
    setYears,
}) => {
    const formatPrice = (price: number) => {
        return `₹${(price / 100000).toFixed(0)} L`;
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'flat': return 'from-primary/20 to-primary/5';
            case 'walk-in-villa': return 'from-accent/20 to-accent/5';
            case 'twin-villa': return 'from-primary/25 to-primary/10';
            case 'independent-villa': return 'from-accent/25 to-accent/10';
            default: return 'from-primary/20 to-primary/5';
        }
    };

    return (
        <section id="preferences" className="py-20 bg-white">
            <div className="container mx-auto px-6 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="font-serif font-bold text-4xl lg:text-5xl text-primary mb-4">
                        Configure Your Stay
                    </h2>
                    <p className="text-lg text-secondary/70 max-w-2xl mx-auto">
                        Select your preferences to see personalized cost estimates and savings.
                    </p>
                </motion.div>

                <Card className="max-w-5xl mx-auto p-8">
                    {/* Unit Type Selection */}
                    <div className="mb-10">
                        <h3 className="font-bold text-xl text-primary mb-4">Choose Your Unit Type</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {UNIT_TYPES.map((unit) => (
                                <motion.button
                                    key={unit.id}
                                    onClick={() => setSelectedUnit(unit)}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${selectedUnit?.id === unit.id
                                        ? 'border-primary bg-primary/5 shadow-lg'
                                        : 'border-border bg-offwhite hover:border-primary/40'
                                        }`}
                                >
                                    <div className={`w-full h-20 bg-gradient-to-br ${getCategoryColor(unit.category)} rounded-lg mb-3 flex items-center justify-center`}>
                                        <span className="text-2xl font-serif font-bold text-primary">
                                            {unit.bedrooms}BR
                                        </span>
                                    </div>
                                    <div className="font-bold text-sm text-primary mb-1">{unit.name}</div>
                                    <div className="text-xs text-secondary/60 mb-2">{unit.sqft} sq ft</div>
                                    <div className="text-sm font-bold text-accent">{formatPrice(unit.basePrice)}</div>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Number of Residents */}
                    <div className="mb-10">
                        <h3 className="font-bold text-xl text-primary mb-4">Number of Residents</h3>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setNumResidents(Math.max(1, numResidents - 1))}
                                className="w-12 h-12 rounded-full bg-offwhite border-2 border-border hover:border-primary hover:bg-primary/5 transition-all duration-300 flex items-center justify-center"
                            >
                                <Minus size={20} className="text-primary" />
                            </button>
                            <div className="flex-1 text-center">
                                <div className="text-4xl font-bold text-primary">{numResidents}</div>
                                <div className="text-sm text-secondary/60">Resident{numResidents !== 1 ? 's' : ''}</div>
                            </div>
                            <button
                                onClick={() => setNumResidents(Math.min(3, numResidents + 1))}
                                className="w-12 h-12 rounded-full bg-offwhite border-2 border-border hover:border-primary hover:bg-primary/5 transition-all duration-300 flex items-center justify-center"
                            >
                                <Plus size={20} className="text-primary" />
                            </button>
                        </div>
                    </div>

                    {/* Number of Cars */}
                    <div className="mb-10">
                        <h3 className="font-bold text-xl text-primary mb-4">Number of Cars</h3>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setNumCars(Math.max(0, numCars - 1))}
                                className="w-12 h-12 rounded-full bg-offwhite border-2 border-border hover:border-primary hover:bg-primary/5 transition-all duration-300 flex items-center justify-center"
                            >
                                <Minus size={20} className="text-primary" />
                            </button>
                            <div className="flex-1 text-center">
                                <div className="text-4xl font-bold text-primary">{numCars}</div>
                                <div className="text-sm text-secondary/60">Car{numCars !== 1 ? 's' : ''}</div>
                            </div>
                            <button
                                onClick={() => setNumCars(Math.min(3, numCars + 1))}
                                className="w-12 h-12 rounded-full bg-offwhite border-2 border-border hover:border-primary hover:bg-primary/5 transition-all duration-300 flex items-center justify-center"
                            >
                                <Plus size={20} className="text-primary" />
                            </button>
                        </div>
                    </div>

                    {/* Length of Stay */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-xl text-primary">Length of Stay</h3>
                            <div className="text-2xl font-bold text-accent">{years} Years</div>
                        </div>
                        <input
                            type="range"
                            min={5}
                            max={25}
                            step={1}
                            value={years}
                            onChange={(e) => setYears(parseInt(e.target.value))}
                            className="w-full h-3 bg-offwhite rounded-lg appearance-none cursor-pointer accent-accent"
                        />
                        <div className="flex justify-between text-xs text-secondary/60 mt-2">
                            <span>5 years</span>
                            <span>25 years</span>
                        </div>
                    </div>

                    {/* Deposit Refund Info */}
                    <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <Info size={20} className="text-accent mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-secondary/80">
                                <div className="font-bold text-primary mb-2">Deposit Refund Bands:</div>
                                <ul className="space-y-1">
                                    {DEPOSIT_REFUND_BANDS.map((band, idx) => (
                                        <li key={idx} className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                            <span>
                                                {band.minYears}–{band.maxYears === 100 ? '20+' : band.maxYears} years:
                                                <strong className="text-accent ml-1">{(band.refundPercentage * 100).toFixed(0)}%</strong> refunded
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </section>
    );
};

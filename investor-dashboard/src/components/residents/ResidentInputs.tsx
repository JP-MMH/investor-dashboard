/**
 * Resident Inputs - Residents, Cars, Stay Duration
 * Mater Maria Homes
 */

import { motion } from 'framer-motion';
import { Users, Car, Calendar, Info } from 'lucide-react';
import { useResidentStore } from '../../state/useResidentStore';
import { getRefundBandDescription } from '../../utils/depositLogic';

export const ResidentInputs = () => {
    const { residents, cars, stayYears, setResidents, setCars, setStayYears } = useResidentStore();

    return (
        <div className="space-y-8">
            {/* Number of Residents */}
            <div>
                <label className="flex items-center gap-2 text-sm font-body font-medium text-heritage mb-3">
                    <Users className="w-4 h-4" />
                    Number of Residents
                </label>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setResidents(residents - 1)}
                        disabled={residents <= 1}
                        className="w-10 h-10 rounded-full bg-cloud border border-heritage/30 text-heritage hover:border-gold hover:text-gold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        −
                    </button>
                    <span className="text-2xl font-heading font-semibold text-heritage w-12 text-center">
                        {residents}
                    </span>
                    <button
                        onClick={() => setResidents(residents + 1)}
                        disabled={residents >= 3}
                        className="w-10 h-10 rounded-full bg-cloud border border-heritage/30 text-heritage hover:border-gold hover:text-gold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Number of Cars */}
            <div>
                <label className="flex items-center gap-2 text-sm font-body font-medium text-heritage mb-3">
                    <Car className="w-4 h-4" />
                    Number of Cars
                </label>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setCars(cars - 1)}
                        disabled={cars <= 0}
                        className="w-10 h-10 rounded-full bg-cloud border border-heritage/30 text-heritage hover:border-gold hover:text-gold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        −
                    </button>
                    <span className="text-2xl font-heading font-semibold text-heritage w-12 text-center">
                        {cars}
                    </span>
                    <button
                        onClick={() => setCars(cars + 1)}
                        disabled={cars >= 3}
                        className="w-10 h-10 rounded-full bg-cloud border border-heritage/30 text-heritage hover:border-gold hover:text-gold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Length of Stay Slider */}
            <div>
                <label className="flex items-center gap-2 text-sm font-body font-medium text-heritage mb-3">
                    <Calendar className="w-4 h-4" />
                    Length of Stay
                </label>
                <div className="space-y-4">
                    <div className="relative">
                        <input
                            type="range"
                            min="5"
                            max="25"
                            value={stayYears}
                            onChange={(e) => setStayYears(Number(e.target.value))}
                            className="w-full h-2 bg-gradient-to-r from-sage/30 to-gold/30 rounded-full appearance-none cursor-pointer slider-thumb-gold"
                            style={{
                                background: `linear-gradient(to right, #6E8D5E 0%, #D4AF37 ${((stayYears - 5) / 20) * 100}%, rgba(110,141,94,0.3) ${((stayYears - 5) / 20) * 100}%, rgba(212,175,55,0.3) 100%)`,
                            }}
                        />
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gold text-cloud px-3 py-1 rounded-full text-sm font-body font-semibold">
                            {stayYears} years
                        </div>
                    </div>
                    <div className="flex justify-between text-xs text-coolgrey font-body">
                        <span>5 years</span>
                        <span>25 years</span>
                    </div>
                </div>
            </div>

            {/* Deposit Refund Bands Info */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-sage/10 rounded-xl p-4 border border-sage/20"
            >
                <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-heritage flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-body font-semibold text-heritage text-sm mb-2">
                            Deposit Refund Policy
                        </h4>
                        <ul className="space-y-1 text-xs text-heritage/80 font-body">
                            <li>• 0–10 years: 90% refunded</li>
                            <li>• 10–20 years: 80% refunded</li>
                            <li>• 20+ years: 70% refunded</li>
                        </ul>
                        <p className="mt-2 text-xs text-gold font-medium">
                            Current selection: {getRefundBandDescription(stayYears)}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Custom Slider Styles */}
            <style>{`
        .slider-thumb-gold::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #D4AF37;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          border: 2px solid #2F4F4F;
        }
        .slider-thumb-gold::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #D4AF37;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          border: 2px solid #2F4F4F;
        }
      `}</style>
        </div>
    );
};

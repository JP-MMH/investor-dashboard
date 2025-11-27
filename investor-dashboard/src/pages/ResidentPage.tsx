/**
 * Resident Page - Brand-Compliant Rebuild
 * Mater Maria Homes
 */

import { HeroSection } from '../components/residents/HeroSection';
import { LifeAtMaterMaria } from '../components/residents/LifeAtMaterMaria';
import { GrowthJourney } from '../components/residents/GrowthJourney';
import { UnitSelector } from '../components/residents/UnitSelector';
import { ResidentInputs } from '../components/residents/ResidentInputs';
import { CostSummary } from '../components/residents/CostSummary';
import { YearlyBreakdown } from '../components/residents/YearlyBreakdown';
import { ComparisonChart } from '../components/residents/ComparisonChart';
import { SavingsTogglePanel } from '../components/residents/SavingsTogglePanel';
import { Mail } from 'lucide-react';

export const ResidentPage = () => {
    return (
        <div className="min-h-screen bg-cloud">
            {/* Hero Section */}
            <HeroSection />

            {/* Life at Mater Maria - 3 Pillars */}
            <LifeAtMaterMaria />

            {/* Growth Journey - 3D Cards */}
            <GrowthJourney />

            {/* Configure Your Stay Section */}
            <section className="py-20 bg-gradient-to-br from-sage/5 via-cloud to-gold/5">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-heading font-semibold text-heritage mb-4">
                            Configure Your Stay
                        </h2>
                        <p className="text-lg text-heritage/80 font-body max-w-2xl mx-auto">
                            Customize your preferences to see personalized cost estimates
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-12">
                        {/* Unit Selection */}
                        <div className="bg-cloud rounded-xxl shadow-deep p-8">
                            <UnitSelector />
                        </div>

                        {/* Resident Inputs */}
                        <div className="bg-cloud rounded-xxl shadow-deep p-8">
                            <ResidentInputs />
                        </div>

                        {/* Cost Summary */}
                        <div className="bg-cloud rounded-xxl shadow-deep p-8">
                            <CostSummary />
                        </div>

                        {/* Yearly Breakdown */}
                        <YearlyBreakdown />
                    </div>
                </div>
            </section>

            {/* Comparison Section */}
            <section className="py-20 bg-cloud">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-heading font-semibold text-heritage mb-4">
                            Compare with Alternatives
                        </h2>
                        <p className="text-lg text-heritage/80 font-body max-w-2xl mx-auto">
                            See how Mater Maria stacks up against traditional retirement options
                        </p>
                    </div>

                    <div
                        className="max-w-6xl mx-auto rounded-[32px] p-8"
                        style={{
                            background: '#FAF7F0',
                            boxShadow: '0 12px 24px rgba(92, 64, 51, 0.12)',
                        }}
                    >
                        <div className="grid lg:grid-cols-[60%_40%] gap-8">
                            {/* Left: Chart */}
                            <div>
                                <ComparisonChart />
                            </div>

                            {/* Right: Toggle Panel */}
                            <div>
                                <SavingsTogglePanel />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-heritage">
                <div className="container-custom text-center">
                    <h2 className="text-2xl md:text-3xl font-heading font-semibold text-cloud mb-4">
                        Ready to plan your future?
                    </h2>
                    <p className="text-cloud/80 font-body mb-8 max-w-xl mx-auto">
                        Get in touch with our team to learn more about life at Mater Maria Homes.
                    </p>
                    <a
                        href="mailto:contact@matermariahomes.com"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-heritage rounded-full font-body font-semibold hover:bg-gold/90 transition-all shadow-deep hover:shadow-soft"
                    >
                        <Mail className="w-5 h-5" />
                        <span>Talk to Us</span>
                    </a>
                </div>
            </section>
        </div>
    );
};

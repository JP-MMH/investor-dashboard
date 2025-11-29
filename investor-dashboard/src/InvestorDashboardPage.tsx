import React, { useState } from 'react';
import { NavbarPill } from './components/sections/NavbarPill';
import { InvestorScenarioHero } from './components/sections/InvestorScenarioHero';
import { PlanDetailsSection } from './components/sections/PlanDetailsSection';
import { AllocationSection } from './components/sections/AllocationSection';
import { RefundSafetySection } from './components/sections/RefundSafetySection';
import { ComparisonSection } from './components/sections/ComparisonSection';
import { OccupancySensitivitySection } from './components/sections/OccupancySensitivitySection';
import { Demand } from './components/sections/Demand';
import { RiskSection } from './components/sections/RiskSection';
import { GovernanceExitSection } from './components/sections/GovernanceExitSection';
import { FAQ } from './components/sections/FAQ';
import { Footer } from './components/sections/Footer';

type PlanType = 'platinum' | 'gold' | 'silver';

const PLANS = {
    platinum: 3000000,
    gold: 2000000,
    silver: 1000000
};

export const InvestorDashboardPage: React.FC = () => {
    // Global State for the Tier-Based Selector
    const [selectedPlan, setSelectedPlan] = useState<PlanType>('platinum');
    const [lots, setLots] = useState(1);

    const totalInvestment = PLANS[selectedPlan] * lots;

    return (
        <div className="min-h-screen bg-offwhite font-sans text-primary selection:bg-accent selection:text-white">
            <NavbarPill />

            <main>
                <InvestorScenarioHero
                    selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan}
                    lots={lots} setLots={setLots}
                />

                <PlanDetailsSection selectedPlan={selectedPlan} lots={lots} />

                <AllocationSection amount={totalInvestment} />

                <RefundSafetySection amount={totalInvestment} />

                <ComparisonSection amount={totalInvestment} selectedPlan={selectedPlan} isShutdown={false} lots={lots} />

                <OccupancySensitivitySection />

                <Demand />

                <RiskSection />

                <GovernanceExitSection />

                <FAQ />
            </main>

            <Footer />
        </div>
    );
};

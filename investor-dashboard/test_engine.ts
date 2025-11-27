// Quick manual test of investor engine
import {
    computeInvestorScenario,
    getSharePlanConstants,
    PROJECT_CONSTANTS,
    type InvestorInput,
} from './src/utils/investorEngine';

console.log('=== INVESTOR ENGINE MANUAL TEST ===\n');

// Test 1: Platinum baseline
console.log('Test 1: Platinum (1 share, 15 years)');
const platinum = computeInvestorScenario({
    shareClass: 'PLATINUM',
    numberOfShares: 1,
    horizonYears: 15,
});
console.log(`  Total Invested: ₹${platinum.totalInvested.toLocaleString()}`);
console.log(`  Total Dividends: ₹${platinum.totalDividends.toLocaleString()}`);
console.log(`  Total Interest: ₹${platinum.totalInterest.toLocaleString()}`);
console.log(`  Cash in Hand: ₹${platinum.totalCashInHandDuringTerm.toLocaleString()}`);
console.log(`  Net Worth @ Y15: ₹${platinum.finalNetWorthAtHorizon.toLocaleString()}`);
console.log(`  Total Return: ₹${platinum.totalReturn.toLocaleString()}`);
console.log(`  IRR: ${(platinum.irr * 100).toFixed(2)}%`);
console.log(`  Expected Total Return: ₹11,018,023`);
console.log(`  Expected IRR: 9.06%`);
console.log(`  ✓ Match: ${Math.abs(platinum.totalReturn - 11_018_023) < 1000 && Math.abs(platinum.irr - 0.0906) < 0.0001}\n`);

// Test 2: Gold baseline
console.log('Test 2: Gold (1 share, 15 years)');
const gold = computeInvestorScenario({
    shareClass: 'GOLD',
    numberOfShares: 1,
    horizonYears: 15,
});
console.log(`  Total Return: ₹${gold.totalReturn.toLocaleString()}`);
console.log(`  IRR: ${(gold.irr * 100).toFixed(2)}%`);
console.log(`  Expected: ₹7,345,348 @ 9.06%`);
console.log(`  ✓ Match: ${Math.abs(gold.totalReturn - 7_345_348) < 1000 && Math.abs(gold.irr - 0.0906) < 0.0001}\n`);

// Test 3: Silver baseline
console.log('Test 3: Silver (1 share, 15 years)');
const silver = computeInvestorScenario({
    shareClass: 'SILVER',
    numberOfShares: 1,
    horizonYears: 15,
});
console.log(`  Total Return: ₹${silver.totalReturn.toLocaleString()}`);
console.log(`  IRR: ${(silver.irr * 100).toFixed(2)}%`);
console.log(`  Expected: ₹3,672,674 @ 9.06%`);
console.log(`  ✓ Match: ${Math.abs(silver.totalReturn - 3_672_674) < 1000 && Math.abs(silver.irr - 0.0906) < 0.0001}\n`);

// Test 4: Multi-share
console.log('Test 4: Platinum (2 shares, 15 years)');
const platinum2 = computeInvestorScenario({
    shareClass: 'PLATINUM',
    numberOfShares: 2,
    horizonYears: 15,
});
console.log(`  Total Invested: ₹${platinum2.totalInvested.toLocaleString()}`);
console.log(`  Total Dividends: ₹${platinum2.totalDividends.toLocaleString()}`);
console.log(`  Total Interest: ₹${platinum2.totalInterest.toLocaleString()}`);
console.log(`  Surplus: ₹${platinum2.cashFlowsByYear.finalSurplusShare.toLocaleString()}`);
console.log(`  Net Worth @ Y15: ₹${platinum2.finalNetWorthAtHorizon.toLocaleString()}`);
console.log(`  Total Return: ₹${platinum2.totalReturn.toLocaleString()}`);
console.log(`  IRR: ${(platinum2.irr * 100).toFixed(2)}%`);
console.log(`  Expected: ₹6M invested, ₹22,036,046 return @ 9.06%`);
console.log(`  ✓ Match: ${Math.abs(platinum2.totalReturn - 22_036_046) < 1000 && Math.abs(platinum2.irr - 0.0906) < 0.0001}\n`);

// Test 5: Project aggregate
console.log('Test 5: Project Aggregate (40P + 30G + 20S)');
const platinumSurplus = 40 * 2_068_023;
const goldSurplus = 30 * 1_445_348;
const silverSurplus = 20 * 722_674;
const totalSurplus = platinumSurplus + goldSurplus + silverSurplus;
console.log(`  Calculated Surplus: ₹${totalSurplus.toLocaleString()}`);
console.log(`  Expected Surplus: ₹${PROJECT_CONSTANTS.RESERVE_SURPLUS_YEAR_15.toLocaleString()}`);
console.log(`  ✓ Match: ${Math.abs(totalSurplus - PROJECT_CONSTANTS.RESERVE_SURPLUS_YEAR_15) < 10000}\n`);

console.log('=== ALL TESTS COMPLETED ===');

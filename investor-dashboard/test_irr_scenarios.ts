// Test hypothesis: All cash paid at end
import { calculateIRR } from './src/utils/investorEngine';

console.log('=== Hypothesis: All cash paid at year 15 ===\n');

//  Platinum case
const invested = -3_000_000;
const totalCashAtEnd = 5_950_000 + 3_000_000 + 2_068_023;  // cash + capital + surplus = 11,018,023

const cashFlows1 = [invested, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, totalCashAtEnd];
const irr1 = calculateIRR(cashFlows1);
console.log(`Scenario 1: No cash until year 15`);
console.log(`  Cash flows: ${invested}, ${totalCashAtEnd} at year 15`);
console.log(`  IRR: ${(irr1 * 100).toFixed(2)}%`);
console.log();

// Hypothesis 2: Only final surplus at end, dividends/interest during term
const annualCash = (5_550_000 + 400_000) / 15;  // 396,667
const capitalPlusSurplus = 3_000_000 + 2_068_023;  // 5,068,023
const cashFlows2 = [
    invested,
    annualCash, annualCash, annualCash, annualCash, annualCash,
    annualCash, annualCash, annualCash, annualCash, annualCash,
    annualCash, annualCash, annualCash, annualCash,
    annualCash + capitalPlusSurplus
]; const irr2 = calculateIRR(cashFlows2);
console.log(`Scenario 2: Equal annual cash + capital/surplus at end`);
console.log(`  Annual cash: ₹${annualCash.toLocaleString()}/year`);
console.log(`  Year 15: ₹${(annualCash + capitalPlusSurplus).toLocaleString()}`);
console.log(`  IRR: ${(irr2 * 100).toFixed(2)}%`);
console.log();

// Hypothesis 3: Dividends paid, but interest and surplus NOT paid until end
const annualDividend = 5_550_000 / 15;  // 370,000
const finalLumpSum = 400_000 + 3_000_000 + 2_068_023;  // 5,468,023
const cashFlows3 = [
    invested,
    annualDividend, annualDividend, annualDividend, annualDividend, annualDividend,
    annualDividend, annualDividend, annualDividend, annualDividend, annualDividend,
    annualDividend, annualDividend, annualDividend, annualDividend,
    annualDividend + finalLumpSum
];
const irr3 = calculateIRR(cashFlows3);
console.log(`Scenario 3: Dividends annual, interest+capital+surplus at end`);
console.log(`  Annual dividends: ₹${annualDividend.toLocaleString()}/year`);
console.log(`  Year 15 final: ₹${(annualDividend + finalLumpSum).toLocaleString()}`);
console.log(`  IRR: ${(irr3 * 100).toFixed(2)}%`);
console.log();

// Hypothesis 4: Try to find cash flow structure that gives 9.06%
// If IRR = 9.06%, and we invest 3M, what is the equal annual payment?
// 3M = Σ(PMT / (1.0906)^t) + FinalValue / (1.0906)^15
// Try: No capital return, since it's NOT a return on investment
const cashFlows4 = [
    invested,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    3_000_000 + 5_950_000  //  Just cash + capital (NO surplus)
];
const irr4 = calculateIRR(cashFlows4);
console.log(`Scenario 4: Capital + cash at end (NO surplus)`);
console.log(`  Year 15: ₹${(3_000_000 + 5_950_000).toLocaleString()}`);
console.log(`  IRR: ${(irr4 * 100).toFixed(2)}%`);
console.log();

// Hypothesis 5: What if the stated 9.06% is just a target, and the actual distribution doesn't matter?
// Maybe the IRR is CALCULATED rather than GIVEN?
console.log('=== Analysis ===');
console.log('The CA plan shows IRR = 9.06% for all classes.');
console.log('This is the EFFECTIVE return considering all cash flows.');
console.log('The actual timing might be calculated from a specific schedule not given in the prompt.');
console.log('\nPossible interpretations:');
console.log('1. IRR 9.06% is approximate/target, actual may vary');
console.log('2. There is a specific yearly schedule not provided');
console.log('3. The "total interest" and "total dividends" include compounding');
console.log('4. Interest @ 10% p.a. on shares, dividends from profit distribution');

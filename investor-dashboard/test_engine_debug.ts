// Debug test to understand IRR issue
import {
    computeInvestorScenario,
} from './src/utils/investorEngine';

console.log('=== DEBUG: Cash Flow Structure ===\n');

const platinum = computeInvestorScenario({
    shareClass: 'PLATINUM',
    numberOfShares: 1,
    horizonYears: 15,
});

console.log('Annual Dividends:');
platinum.cashFlowsByYear.yearlyDividends.forEach((div, idx) => {
    console.log(`  Year ${idx + 1}: ₹${div.toLocaleString()}`);
});

console.log('\nAnnual Interest:');
platinum.cashFlowsByYear.yearlyInterest.forEach((int, idx) => {
    console.log(`  Year ${idx + 1}: ₹${int.toLocaleString()}`);
});

console.log(`\nFinal Capital Return: ₹${platinum.cashFlowsByYear.finalCapitalReturn.toLocaleString()}`);
console.log(`Final Surplus: ₹${platinum.cashFlowsByYear.finalSurplusShare.toLocaleString()}`);

console.log('\n=== Cash Flow for IRR Calculation ===');
// Reconstruct IRR cash flows  
const totalInvested = 3_000_000;
const irrCashflows = [-totalInvested];

for (let year = 1; year <= 15; year++) {
    const yearIndex = year - 1;
    const annualDividend = platinum.cashFlowsByYear.yearlyDividends[yearIndex];
    const annualInterest = platinum.cashFlowsByYear.yearlyInterest[yearIndex];

    if (year === 15) {
        const finalCash = annualDividend + annualInterest +
            platinum.cashFlowsByYear.finalCapitalReturn +
            platinum.cashFlowsByYear.finalSurplusShare;
        console.log(`Year ${year}: ₹${finalCash.toLocaleString()}    (includes capital + surplus)`);
        irrCashflows.push(finalCash);
    } else {
        const annualCash = annualDividend + annualInterest;
        console.log(`Year ${year}: ₹${annualCash.toLocaleString()}`);
        irrCashflows.push(annualCash);
    }
}

console.log(`\nYear 0 (investment): -₹${totalInvested.toLocaleString()}`);

// Calculate what the IRR should be manually
// An IRR of 9.06% means that the NPV of the cash flows at 9.06% should be ~0
console.log('\n=== NPV at 9.06% ===');
let npv = 0;
irrCashflows.forEach((cf, t) => {
    const discounted = cf / Math.pow(1.0906, t);
    npv += discounted;
    console.log(`Year ${t}: ₹${cf.toLocaleString()} / (1.0906)^${t} = ₹${discounted.toLocaleString()}`);
});
console.log(`Total NPV at 9.06%: ₹${npv.toLocaleString()}`);
console.log(`(Should be close to 0 for IRR = 9.06%)`);

// Try understanding: what if dividends/interest are NOT equal each year?
console.log('\n=== Hypothesis: Unequal distributions? ===');
console.log('Total dividends over 15 years: ₹5,550,000');
console.log('If equal: ₹370,000/year');
console.log('Total interest over 15 years: ₹400,000');
console.log('If equal: ₹26,666.67/year');
console.log('Total annual cash if equal: ₹396,666.67/year');

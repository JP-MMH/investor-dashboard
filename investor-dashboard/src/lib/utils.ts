import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: 'INR' | 'AED' = 'INR'): string {
    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0,
    });

    if (currency === 'AED') {
        // Simple formatting for AED if en-IN doesn't handle it the way we want, but standard is fine
        return formatter.format(amount);
    }

    // For INR, we might want to use "Cr" or "L" for large numbers if space is tight, 
    // but for now let's stick to standard formatting or a custom shortener.
    if (amount >= 10000000) {
        return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
        return `₹${(amount / 100000).toFixed(2)} L`;
    }

    return formatter.format(amount);
}

export function calculateFutureValue(principal: number, rate: number, years: number): number {
    return principal * Math.pow(1 + rate / 100, years);
}

// Simple IRR approximation for this specific model structure (Base 8.68%)
// We'll scale it slightly based on scenario
export function getScenarioIRR(scenario: 'Base' | 'Downside' | 'Upside'): number {
    switch (scenario) {
        case 'Downside': return 7.2;
        case 'Upside': return 10.5;
        case 'Base': default: return 8.68;
    }
}

export function calculateMaterMariaValue(principal: number, years: number, scenario: 'Base' | 'Downside' | 'Upside'): number {
    const irr = getScenarioIRR(scenario);
    // Using the IRR as the compounding rate for simplicity in this projection
    return calculateFutureValue(principal, irr, years);
}

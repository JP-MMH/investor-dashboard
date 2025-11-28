
// ==========================================
// CONFIGURATION & DATA MODELS
// ==========================================
console.log("Script loaded - v2");

const CONFIG = {
    maintenanceMonthlyPerResident: 30000, // Default base maintenance
    maxResidents: 3,
    maxCars: 3,
    refundSlabs: [
        { maxYears: 10, rate: 0.90 },
        { maxYears: 20, rate: 0.80 },
        { maxYears: Infinity, rate: 0.70 }
    ]
};

const ROOM_TYPES = {
    apartmentSingle: {
        label: "Apartment Villa – Single",
        baseDeposit: 5500000,
        maintenance: 30000
    },
    apartmentDouble: {
        label: "Apartment Villa – Double",
        baseDeposit: 7500000,
        maintenance: 30000
    },
    premiumDouble: {
        label: "Premium Villa – Double",
        baseDeposit: 9000000,
        maintenance: 35000
    }
};

const INVESTMENT_TIERS = {
    silver: {
        label: "Silver — ₹15 Lakhs",
        shareCapital: 1000000,
        refundableDeposit: 500000
    },
    gold: {
        label: "Gold — ₹20 Lakhs",
        shareCapital: 1500000,
        refundableDeposit: 500000
    },
    platinum: {
        label: "Platinum — ₹30 Lakhs",
        shareCapital: 2000000,
        refundableDeposit: 1000000
    }
};

const BENCHMARKS = {
    homeNursing: {
        label: "Home Nursing + Rent",
        monthlyCost: 80000
    },
    otherFacility: {
        label: "Other Retirement Facility",
        monthlyCost: 90000
    }
};

// ==========================================
// STATE MANAGEMENT
// ==========================================

const STATE = {
    activeView: 'residents', // 'residents', 'investors', 'comparison'
    resident: {
        roomType: 'apartmentSingle',
        numResidents: 1,
        numCars: 0,
        yearsStay: 10,
        baseDepositOverride: null,
        medicalDepositOverride: null
    },
    investor: {
        tier: 'gold',
        holdingPeriod: 10,
        appreciationRate: 5 // %
    }
};

// ==========================================
// CORE LOGIC
// ==========================================

function getRefundRate(years) {
    for (const slab of CONFIG.refundSlabs) {
        if (years <= slab.maxYears) return slab.rate;
    }
    return 0.70;
}

function calculateResident() {
    const s = STATE.resident;
    const roomData = ROOM_TYPES[s.roomType];

    // 1. Inputs & Defaults
    const baseDeposit = s.baseDepositOverride !== null ? s.baseDepositOverride : roomData.baseDeposit;
    const medicalDeposit = s.medicalDepositOverride !== null ? s.medicalDepositOverride : (s.numResidents * 300000);
    const parkingDeposit = s.numCars * 300000; // Fixed rule

    // 2. Refund Logic
    const refundRate = getRefundRate(s.yearsStay);
    const refundOnBase = baseDeposit * refundRate;
    const refundMedical = medicalDeposit; // 100%
    const refundParking = parkingDeposit; // 100%

    const totalDeposit = baseDeposit + medicalDeposit + parkingDeposit;
    const totalRefund = refundOnBase + refundMedical + refundParking;

    // 3. Maintenance
    // maintenance = base per resident * num residents (or room specific base if higher? Using simple logic for now)
    // Prompt said: "baseMonthlyMaintenancePerResident: 30000". 
    // Let's assume per unit cost = roomData.maintenance * numResidents is NOT correct usually. 
    // Usually it's per unit or per person. Prompt says "baseMonthlyMaintenancePerResident".
    // Let's use: monthlyMaintenance = roomData.maintenance * s.numResidents (assuming roomData.maintenance is the per-resident rate)
    const monthlyMaintenance = roomData.maintenance * s.numResidents;
    const totalMaintenance = monthlyMaintenance * 12 * s.yearsStay;

    // 4. Net Cost
    const totalPaid = totalDeposit + totalMaintenance;
    const netOutOfPocket = totalPaid - totalRefund;
    const monthlyEquivalent = netOutOfPocket / (s.yearsStay * 12);

    return {
        baseDeposit,
        medicalDeposit,
        parkingDeposit,
        totalDeposit,
        refundRate,
        refundOnBase,
        refundMedical,
        refundParking,
        totalRefund,
        monthlyMaintenance,
        totalMaintenance,
        totalPaid,
        netOutOfPocket,
        monthlyEquivalent
    };
}

function calculateInvestor() {
    const s = STATE.investor;
    const tierData = INVESTMENT_TIERS[s.tier];

    const shareCapital = tierData.shareCapital;
    const refundableDeposit = tierData.refundableDeposit;
    const totalInitialInvestment = shareCapital + refundableDeposit;

    // Future Value of Share
    const rate = s.appreciationRate / 100;
    const futureShareValue = shareCapital * Math.pow((1 + rate), s.holdingPeriod);

    // Refund on Deposit
    const refundRate = getRefundRate(s.holdingPeriod);
    const depositReturn = refundableDeposit * refundRate;

    const totalFinalReturn = futureShareValue + depositReturn;
    const netProfit = totalFinalReturn - totalInitialInvestment;

    // IRR approximation
    // (Final / Initial)^(1/n) - 1
    const irr = (Math.pow((totalFinalReturn / totalInitialInvestment), (1 / s.holdingPeriod)) - 1) * 100;

    return {
        totalInitialInvestment,
        shareCapital,
        refundableDeposit,
        futureShareValue,
        depositReturn,
        totalFinalReturn,
        netProfit,
        irr
    };
}

// ==========================================
// UI UPDATES
// ==========================================

function formatINR(num) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(num);
}

function switchView(view) {
    STATE.activeView = view;

    // Update Toggle
    document.querySelectorAll('.nav-pill').forEach(el => {
        el.classList.toggle('active', el.dataset.view === view);
    });

    // Update Content
    document.querySelectorAll('.view-section').forEach(el => {
        el.classList.toggle('hidden', el.id !== `view-${view}`);
    });

    updateUI();
}

function updateUI() {
    if (STATE.activeView === 'residents' || STATE.activeView === 'comparison') {
        updateResidentUI();
    }
    if (STATE.activeView === 'investors' || STATE.activeView === 'comparison') {
        updateInvestorUI();
    }
    if (STATE.activeView === 'comparison') {
        updateComparisonUI();
    }
}

function updateResidentUI() {
    const res = calculateResident();

    // Inputs (only update if not focused to avoid jumping)
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el && document.activeElement !== el) el.value = val;
    };

    setVal('baseDeposit', res.baseDeposit);
    setVal('medicalDeposit', res.medicalDeposit);
    document.getElementById('parkingDepositDisplay').textContent = formatINR(res.parkingDeposit);
    document.getElementById('yearsLabel').textContent = `${STATE.resident.yearsStay} Years`;

    // Snapshot
    document.getElementById('snap-base').textContent = formatINR(res.baseDeposit);
    document.getElementById('snap-medical').textContent = formatINR(res.medicalDeposit);
    document.getElementById('snap-parking').textContent = formatINR(res.parkingDeposit);
    document.getElementById('snap-total-deposit').textContent = formatINR(res.totalDeposit);

    document.getElementById('snap-slab-label').textContent = `Refund Slab: ${STATE.resident.yearsStay} Years → ${Math.round(res.refundRate * 100)}% of Base`;
    document.getElementById('snap-refund-base').textContent = formatINR(res.refundOnBase);
    document.getElementById('snap-refund-extras').textContent = formatINR(res.refundMedical + res.refundParking);
    document.getElementById('snap-total-refund').textContent = formatINR(res.totalRefund);

    document.getElementById('snap-maint-monthly').textContent = formatINR(res.monthlyMaintenance);
    document.getElementById('snap-maint-total').textContent = formatINR(res.totalMaintenance);

    // Net Cost
    document.getElementById('net-cost-display').textContent = formatINR(res.netOutOfPocket);

    // Comparison Chart & Text
    updateResidentChart(res.monthlyEquivalent);

    const saveHome = BENCHMARKS.homeNursing.monthlyCost - res.monthlyEquivalent;
    const saveOther = BENCHMARKS.otherFacility.monthlyCost - res.monthlyEquivalent;

    const formatSave = (val) => val >= 0 ? `save approximately <strong>${formatINR(val)}</strong>` : `pay approximately <strong>${formatINR(Math.abs(val))}</strong> more`;

    document.getElementById('comp-text-home').innerHTML = `You ${formatSave(saveHome)} per month compared to Home Nursing.`;
    document.getElementById('comp-text-other').innerHTML = `You ${formatSave(saveOther)} per month compared to other facilities.`;

    document.getElementById('table-mater').textContent = formatINR(res.monthlyEquivalent);
    document.getElementById('table-home').textContent = formatINR(BENCHMARKS.homeNursing.monthlyCost);
    document.getElementById('table-other').textContent = formatINR(BENCHMARKS.otherFacility.monthlyCost);
}

let resChartInstance = null;
function updateResidentChart(materVal) {
    const ctx = document.getElementById('residentChart');
    if (!ctx) return;

    const data = [materVal, BENCHMARKS.homeNursing.monthlyCost, BENCHMARKS.otherFacility.monthlyCost];

    if (resChartInstance) {
        resChartInstance.data.datasets[0].data = data;
        resChartInstance.update();
    } else {
        resChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mater Maria', 'Home Nursing', 'Other Facilities'],
                datasets: [{
                    label: 'Monthly Cost (₹)',
                    data: data,
                    backgroundColor: ['#0E3D2E', '#C6A562', '#999'],
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }
}

function updateInvestorUI() {
    const inv = calculateInvestor();

    document.getElementById('inv-initial').textContent = formatINR(inv.totalInitialInvestment);
    document.getElementById('inv-share-val').textContent = formatINR(inv.futureShareValue);
    document.getElementById('inv-deposit-ret').textContent = formatINR(inv.depositReturn);
    document.getElementById('inv-final-ret').textContent = formatINR(inv.totalFinalReturn);
    document.getElementById('inv-net-profit').textContent = formatINR(inv.netProfit);
    document.getElementById('inv-irr').textContent = inv.irr.toFixed(2) + '%';

    updateInvestorChart(inv.totalInitialInvestment, inv.totalFinalReturn);
}

let invChartInstance = null;
function updateInvestorChart(initial, final) {
    const ctx = document.getElementById('investorChart');
    if (!ctx) return;

    if (invChartInstance) {
        invChartInstance.data.datasets[0].data = [initial, final];
        invChartInstance.update();
    } else {
        invChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Initial Investment', 'Final Return'],
                datasets: [{
                    label: 'Amount (₹)',
                    data: [initial, final],
                    backgroundColor: ['#0E3D2E', '#C6A562'],
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }
}

function updateComparisonUI() {
    // This view just summarizes the other two.
    // For now, we can just ensure the charts in the comparison view are updated if we add them.
    // The prompt asked for a simple selector in the comparison view.
    // We'll implement that logic in the HTML/DOM handlers.
}

// ==========================================
// INITIALIZATION & EVENTS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded fired");

    try {
        // Navigation
        document.querySelectorAll('.nav-pill').forEach(btn => {
            btn.addEventListener('click', () => switchView(btn.dataset.view));
        });

        // --- Resident Inputs ---
        const roomSelect = document.getElementById('roomType');
        // Populate Room Types
        Object.entries(ROOM_TYPES).forEach(([key, data]) => {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = data.label;
            roomSelect.appendChild(opt);
        });

        roomSelect.addEventListener('change', (e) => {
            STATE.resident.roomType = e.target.value;
            STATE.resident.baseDepositOverride = null; // Reset override
            updateUI();
        });

        // Steppers
        const bindStepper = (id, field, min, max) => {
            document.getElementById(`${id}-minus`).addEventListener('click', () => {
                if (STATE.resident[field] > min) {
                    STATE.resident[field]--;
                    document.getElementById(id).textContent = STATE.resident[field];
                    if (field === 'numResidents') STATE.resident.medicalDepositOverride = null; // Reset medical default
                    updateUI();
                }
            });
            document.getElementById(`${id}-plus`).addEventListener('click', () => {
                if (STATE.resident[field] < max) {
                    STATE.resident[field]++;
                    document.getElementById(id).textContent = STATE.resident[field];
                    if (field === 'numResidents') STATE.resident.medicalDepositOverride = null;
                    updateUI();
                }
            });
        };
        bindStepper('res', 'numResidents', 1, CONFIG.maxResidents);
        bindStepper('car', 'numCars', 0, CONFIG.maxCars);

        // Slider
        const yearSlider = document.getElementById('yearsStay');
        yearSlider.addEventListener('input', (e) => {
            STATE.resident.yearsStay = parseInt(e.target.value);
            updateUI();
        });

        // Manual Overrides
        document.getElementById('baseDeposit').addEventListener('input', (e) => {
            STATE.resident.baseDepositOverride = parseFloat(e.target.value) || 0;
            updateUI();
        });
        document.getElementById('medicalDeposit').addEventListener('input', (e) => {
            STATE.resident.medicalDepositOverride = parseFloat(e.target.value) || 0;
            updateUI();
        });

        // --- Investor Inputs ---
        const tierSelect = document.getElementById('investTier');
        Object.entries(INVESTMENT_TIERS).forEach(([key, data]) => {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = data.label;
            tierSelect.appendChild(opt);
        });
        tierSelect.addEventListener('change', (e) => {
            STATE.investor.tier = e.target.value;
            updateUI();
        });

        document.getElementById('invYears').addEventListener('input', (e) => {
            STATE.investor.holdingPeriod = parseInt(e.target.value);
            document.getElementById('invYearsLabel').textContent = `${STATE.investor.holdingPeriod} Years`;
            updateUI();
        });

        document.getElementById('appreciationRate').addEventListener('change', (e) => {
            STATE.investor.appreciationRate = parseFloat(e.target.value);
            updateUI();
        });

        // --- Comparison View Toggle ---
        const compRadios = document.querySelectorAll('input[name="compMode"]');
        compRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                document.getElementById('comp-res-content').classList.toggle('hidden', e.target.value !== 'resident');
                document.getElementById('comp-inv-content').classList.toggle('hidden', e.target.value !== 'investor');
            });
        });

        // Initial Render
        updateUI();
        testFinancialLogic();
    });

// ==========================================
// SANITY CHECKS
// ==========================================
function testFinancialLogic() {
    console.log("--- Running SPA Financial Logic Sanity Checks ---");

    // Test Case 1: Resident (8 Years, Single Apt)
    // Base: 55L, Medical: 3L (1 res), Parking: 0 (0 cars)
    // Refund: 90% of 55L = 49.5L. Extras: 3L. Total Refund: 52.5L
    // Maint: 30k * 1 * 12 * 8 = 28.8L
    // Total Paid: 55+3+0 + 28.8 = 86.8L
    // Net Cost: 86.8 - 52.5 = 34.3L

    STATE.resident.roomType = 'apartmentSingle';
    STATE.resident.numResidents = 1;
    STATE.resident.numCars = 0;
    STATE.resident.yearsStay = 8;
    STATE.resident.baseDepositOverride = null;
    STATE.resident.medicalDepositOverride = null;

    const res = calculateResident();
    console.log(`Test 1 (Resident 8y): Expected Net 34,30,000. Got ${res.netOutOfPocket}`);
    console.log(res.netOutOfPocket === 3430000 ? "✅ PASS" : "❌ FAIL");

    // Test Case 2: Investor (Gold, 15y, 5%)
    // Gold: 15L Share, 5L Deposit. Total 20L.
    // Share Growth: 15L * (1.05)^15 = 15L * 2.0789 = 31.18L approx
    // Deposit Refund: 15y -> 80% of 5L = 4L
    // Total Return: 35.18L approx

    STATE.investor.tier = 'gold';
    STATE.investor.holdingPeriod = 15;
    STATE.investor.appreciationRate = 5;

    const inv = calculateInvestor();
    console.log(`Test 2 (Investor 15y): Initial 20L. Final Return ~35.18L. Got ${Math.round(inv.totalFinalReturn / 1000)}k`);
    console.log(inv.totalFinalReturn > 3500000 && inv.totalFinalReturn < 3550000 ? "✅ PASS" : "❌ FAIL");
}

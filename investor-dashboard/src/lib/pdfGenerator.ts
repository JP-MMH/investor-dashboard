import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from './utils';
import type { YearlyBreakdownRow } from './financialModel';

interface PDFData {
    planName: string;
    lots: number;
    totalCommitment: number;
    ownershipPercentage: number;
    isShutdown: boolean;
    roiYear15: number;
    irr: string;  // Can be percentage string, range, or "Negative"
    multiple: number;
    schedule: any[];
    breakdown: YearlyBreakdownRow[];
    totalDepositInterest: number;
    totalDividends: number;
    privileges: string[];
    exitRule: string;
}

export const generateInvestorPDF = (data: PDFData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Colors
    const PRIMARY_COLOR = '#103B32';
    const TEXT_COLOR = '#333333';

    // --- Header ---
    doc.setFillColor(PRIMARY_COLOR);
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Mater Maria Wellness Homes', 20, 20);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Investor Scenario Summary', 20, 30);

    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth - 20, 30, { align: 'right' });

    let y = 55;

    // --- Section 1: Scenario Overview ---
    doc.setTextColor(PRIMARY_COLOR);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('1. Scenario Overview', 20, y);
    y += 10;

    const overviewData = [
        ['Selected Plan', data.planName],
        ['Number of Lots', data.lots.toString()],
        ['Total Commitment', formatCurrency(data.totalCommitment)],
        ['Ownership in Project', `${data.ownershipPercentage.toFixed(4)}%`],
        ['Projected Value (Year 15)', formatCurrency(data.roiYear15)],
        ['Target IRR', data.irr],
        ['Money Multiple', `${data.multiple.toFixed(2)}x`],
        ['Scenario Mode', data.isShutdown ? 'Shutdown (Liquidation)' : 'Normal (Going Concern)']
    ];

    autoTable(doc, {
        startY: y,
        head: [],
        body: overviewData,
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 2, textColor: TEXT_COLOR },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 } },
        margin: { left: 20 }
    });

    y = (doc as any).lastAutoTable.finalY + 15;

    // --- Section 2: Contribution Schedule & Privileges ---
    doc.setTextColor(PRIMARY_COLOR);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('2. Contribution Schedule & Privileges', 20, y);
    y += 10;

    // Schedule Table
    const scheduleBody = data.schedule.map(row => [
        row.installment,
        formatCurrency(row.amount * data.lots), // Ensure scaling here too just in case
        row.timing,
        row.type
    ]);

    autoTable(doc, {
        startY: y,
        head: [['Installment', 'Amount', 'Timing', 'Type']],
        body: scheduleBody,
        theme: 'striped',
        headStyles: { fillColor: PRIMARY_COLOR },
        styles: { fontSize: 9 },
        margin: { left: 20 }
    });

    y = (doc as any).lastAutoTable.finalY + 10;

    // Privileges
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Lifestyle Privileges:', 20, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    data.privileges.forEach(priv => {
        doc.text(`• ${priv}`, 25, y);
        y += 5;
    });

    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Exit Rule:', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(data.exitRule, 40, y);

    y += 15;

    // --- Section 3: Investment Model Comparison ---
    doc.setTextColor(PRIMARY_COLOR);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('3. Investment Model Comparison (Year 15)', 20, y);
    y += 10;

    const year15 = data.breakdown[data.breakdown.length - 1];
    const comparisonData = [
        ['Bank Fixed Deposit', formatCurrency(year15.fdValue), '~6.0%', 'High', 'Low'],
        ['Govt. Bonds', formatCurrency(year15.bondValue), '~7.0%', 'High', 'Low'],
        ['Conservative MF', formatCurrency(year15.mfValue), '~10.0%', 'Moderate', 'Medium'],
        ['Aggressive Equity', formatCurrency(year15.equityValue), '~13.0%', 'Low', 'High'],
        [`Mater Maria (${data.planName})`, formatCurrency(year15.closingValue), `${data.irr}%`, 'High', 'Low']
    ];

    autoTable(doc, {
        startY: y,
        head: [['Instrument', 'Est. Value', 'IRR', 'Safety', 'Volatility']],
        body: comparisonData,
        theme: 'grid',
        headStyles: { fillColor: [200, 200, 200], textColor: 50 },
        styles: { fontSize: 9, textColor: TEXT_COLOR },
        didParseCell: (data) => {
            if (data.row.index === 4) {
                data.cell.styles.fontStyle = 'bold';
                data.cell.styles.fillColor = [240, 255, 240];
            }
        },
        margin: { left: 20 }
    });

    y = (doc as any).lastAutoTable.finalY + 15;

    // --- Section 4: Yearly Projection Summary ---
    doc.setTextColor(PRIMARY_COLOR);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('4. Yearly Projection Summary', 20, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(TEXT_COLOR);
    doc.text(`Yearly projection for ${formatCurrency(data.totalCommitment)} over 15 years under conservative CA-reviewed assumptions.`, 20, y);
    y += 10;

    // --- Section 5: Detailed Breakdown ---
    doc.addPage();
    y = 20;
    doc.setTextColor(PRIMARY_COLOR);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('5. Detailed Year-by-Year Breakdown', 20, y);
    y += 10;

    const breakdownBody = data.breakdown.map(row => [
        row.year,
        formatCurrency(row.openingValue),
        formatCurrency(row.depositInterest),
        formatCurrency(row.dividend),
        formatCurrency(row.closingValue)
    ]);

    autoTable(doc, {
        startY: y,
        head: [['Year', 'Opening Value', 'Deposit Interest', 'Dividend', 'Closing Value']],
        body: breakdownBody,
        theme: 'striped',
        headStyles: { fillColor: PRIMARY_COLOR },
        styles: { fontSize: 9 },
        margin: { left: 20 }
    });

    y = (doc as any).lastAutoTable.finalY + 20;

    // --- Section 6: Risk & Disclaimers ---
    doc.setTextColor(PRIMARY_COLOR);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('6. Risk, Demand & Disclaimers', 20, y);
    y += 10;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(TEXT_COLOR);

    const risks = `Projected IRR, refund coverage, and occupancy assumptions are based on market analysis. 
    
    DISCLAIMER: Numbers shown are illustrative and based on conservative, CA-reviewed projections. 
    This is not a prospectus. Actual returns may vary based on occupancy rates and operational costs. 
    Please refer to the official Information Memorandum for detailed risk factors.`;

    doc.text(risks, 20, y, { maxWidth: pageWidth - 40 });

    // Save
    doc.save(`MaterMaria_Investor_Summary_${data.planName.replace(/\s+/g, '_')}_${data.lots}lots.pdf`);
};

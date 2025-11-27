/**
 * Chart.js configuration for Mater Maria Homes
 * Brand-compliant chart styling
 */

import type { ChartOptions } from 'chart.js';

// Brand colors for chart lines
export const CHART_COLORS = {
    materMaria: '#2F4F4F',      // Deep Heritage Green - solid line
    retirementVilla: '#A65F43', // Terracotta - dotted line
    ownHouse: '#A0A9AB',        // Cool Grey - dashed line
    grid: 'rgba(160,169,171,0.25)',
    gold: '#D4AF37',            // Gold for highlights in tooltips
};

/**
 * Default Chart.js options with brand styling
 */
export const getDefaultChartOptions = (): ChartOptions<'line'> => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        mode: 'index',
        intersect: false,
    },
    plugins: {
        legend: {
            display: true,
            position: 'top',
            labels: {
                font: {
                    family: 'Inter, system-ui, sans-serif',
                    size: 13,
                },
                color: '#2F4F4F',
                padding: 16,
                usePointStyle: true,
            },
        },
        tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#2F4F4F',
            bodyColor: '#5C4033',
            borderColor: '#A0A9AB',
            borderWidth: 1,
            padding: 12,
            titleFont: {
                family: 'Inter, system-ui, sans-serif',
                size: 14,
                weight: 600,
            },
            bodyFont: {
                family: 'Inter, system-ui, sans-serif',
                size: 13,
            },
            callbacks: {
                label: function (context) {
                    let label = context.dataset.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += `₹${context.parsed.y.toFixed(2)}L`;
                    }
                    return label;
                }
            }
        },
    },
    scales: {
        x: {
            grid: {
                color: CHART_COLORS.grid,
            },
            ticks: {
                font: {
                    family: 'Inter, system-ui, sans-serif',
                    size: 12,
                },
                color: '#5C4033',
            },
            title: {
                display: true,
                text: 'Year',
                font: {
                    family: 'Inter, system-ui, sans-serif',
                    size: 13,
                    weight: 600,
                },
                color: '#2F4F4F',
            },
        },
        y: {
            grid: {
                color: CHART_COLORS.grid,
            },
            ticks: {
                font: {
                    family: 'Inter, system-ui, sans-serif',
                    size: 12,
                },
                color: '#5C4033',
                callback: function (value) {
                    return `₹${value}L`;
                },
            },
            title: {
                display: true,
                text: 'Cost (₹L)',
                font: {
                    family: 'Inter, system-ui, sans-serif',
                    size: 13,
                    weight: 600,
                },
                color: '#2F4F4F',
            },
        },
    },
    elements: {
        line: {
            tension: 0.35, // Bezier curve smoothing
        },
        point: {
            radius: 4,
            hoverRadius: 6,
        },
    },
});

/**
 * Dataset configuration for Mater Maria line
 */
export const getMaterMariaDatasetConfig = () => ({
    label: 'Mater Maria',
    borderColor: CHART_COLORS.materMaria,
    backgroundColor: CHART_COLORS.materMaria,
    borderWidth: 3,
    borderDash: [],
    pointBackgroundColor: CHART_COLORS.materMaria,
    pointBorderColor: '#fff',
    pointBorderWidth: 2,
});

/**
 * Dataset configuration for Retirement Villa line
 */
export const getRetirementVillaDatasetConfig = () => ({
    label: 'Retirement Villa',
    borderColor: CHART_COLORS.retirementVilla,
    backgroundColor: CHART_COLORS.retirementVilla,
    borderWidth: 2,
    borderDash: [2, 4],
    pointBackgroundColor: CHART_COLORS.retirementVilla,
    pointBorderColor: '#fff',
    pointBorderWidth: 2,
});

/**
 * Dataset configuration for Own House + Staff line
 */
export const getOwnHouseDatasetConfig = () => ({
    label: 'Own House + Staff',
    borderColor: CHART_COLORS.ownHouse,
    backgroundColor: CHART_COLORS.ownHouse,
    borderWidth: 2,
    borderDash: [6, 4],
    pointBackgroundColor: CHART_COLORS.ownHouse,
    pointBorderColor: '#fff',
    pointBorderWidth: 2,
});

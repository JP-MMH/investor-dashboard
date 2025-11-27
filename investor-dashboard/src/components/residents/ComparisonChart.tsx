/**
 * Comparison Chart Component
 * Chart.js visualization for Mater Maria vs Alternatives
 */

import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { useResidentStore } from '../../state/useResidentStore';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const ComparisonChart = () => {
    const { comparisonData, showOwnHouse, showRetirementVilla, stayYears } = useResidentStore();

    // Prepare chart data
    const labels = Array.from({ length: Math.min(stayYears, 17) }, (_, i) => `Year ${i + 1}`);

    const datasets = [
        // Mater Maria - always visible
        {
            label: 'Mater Maria',
            data: comparisonData.materMaria.slice(0, Math.min(stayYears, 17)),
            borderColor: '#2F4F4F', // Deep Heritage Green
            backgroundColor: '#2F4F4F',
            borderWidth: 3,
            pointRadius: 4,
            pointBackgroundColor: '#2F4F4F',
            pointBorderColor: '#FAF7F0',
            pointBorderWidth: 2,
            tension: 0.1,
        },
        // Own House + Staff - toggleable
        ...(showOwnHouse
            ? [
                {
                    label: 'Own House + Staff',
                    data: comparisonData.ownHouse.slice(0, Math.min(stayYears, 17)),
                    borderColor: '#A0A9AB', // Cool Grey
                    backgroundColor: '#A0A9AB',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 3,
                    pointBackgroundColor: '#A0A9AB',
                    pointBorderColor: '#FAF7F0',
                    pointBorderWidth: 1,
                    tension: 0.1,
                },
            ]
            : []),
        // Retirement Villa - toggleable
        ...(showRetirementVilla
            ? [
                {
                    label: 'Retirement Villa',
                    data: comparisonData.retirementVilla.slice(0, Math.min(stayYears, 17)),
                    borderColor: '#A65F43', // Terracotta
                    backgroundColor: '#A65F43',
                    borderWidth: 2,
                    borderDash: [2, 2],
                    pointRadius: 3,
                    pointBackgroundColor: '#A65F43',
                    pointBorderColor: '#FAF7F0',
                    pointBorderWidth: 1,
                    tension: 0.1,
                },
            ]
            : []),
    ];

    const chartData = {
        labels,
        datasets,
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: '#2F4F4F', // Heritage Green
                    font: {
                        family: "'Inter', sans-serif",
                        size: 12,
                        weight: 'normal',
                    },
                    padding: 15,
                    usePointStyle: true,
                },
            },
            tooltip: {
                backgroundColor: '#FAF7F0',
                titleColor: '#2F4F4F',
                bodyColor: '#5C4033',
                borderColor: 'rgba(47, 79, 79, 0.12)',
                borderWidth: 1,
                padding: 12,
                displayColors: true,
                callbacks: {
                    label: (context) => {
                        const label = context.dataset.label || '';
                        const value = context.parsed.y;
                        return `${label}: ₹${value} L`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(160, 169, 171, 0.35)', // Cool Grey at 35%
                    lineWidth: 1,
                },
                ticks: {
                    color: '#5C4033', // Deep Brown
                    font: {
                        family: "'Inter', sans-serif",
                        size: 11,
                    },
                },
                title: {
                    display: true,
                    text: 'Years',
                    color: '#2F4F4F',
                    font: {
                        family: "'Inter', sans-serif",
                        size: 12,
                        weight: 'bold',
                    },
                },
            },
            y: {
                grid: {
                    color: 'rgba(160, 169, 171, 0.35)',
                    lineWidth: 1,
                },
                ticks: {
                    color: '#5C4033',
                    font: {
                        family: "'Inter', sans-serif",
                        size: 11,
                    },
                    callback: (value) => `₹${value} L`,
                },
                title: {
                    display: true,
                    text: 'Cumulative Cost (₹ Lakhs)',
                    color: '#2F4F4F',
                    font: {
                        family: "'Inter', sans-serif",
                        size: 12,
                        weight: 'bold',
                    },
                },
            },
        },
    };

    return (
        <div className="h-[400px] w-full">
            <Line data={chartData} options={options} />
        </div>
    );
};

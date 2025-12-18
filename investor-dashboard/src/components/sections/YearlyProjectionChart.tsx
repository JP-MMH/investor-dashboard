import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../lib/utils';

interface YearlyProjectionChartProps {
    amount: number;
    mmRate: number; // Percentage (e.g., 8.68)
    planName: string;
}

export const YearlyProjectionChart: React.FC<YearlyProjectionChartProps> = ({ amount, mmRate, planName }) => {
    const data = Array.from({ length: 16 }, (_, year) => {
        return {
            year,
            'Bank FD': amount * Math.pow(1 + 0.06, year),
            'Govt Bonds': amount * Math.pow(1 + 0.07, year),
            'Conservative MF': amount * Math.pow(1 + 0.10, year),
            'Aggressive Equity': amount * Math.pow(1 + 0.13, year),
            [`Mater Maria (${planName})`]: amount * Math.pow(1 + mmRate / 100, year),
        };
    });

    return (
        <div className="w-full mt-12">
            <div className="text-center mb-8">
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary">
                    Yearly Projection – {formatCurrency(amount)} over 15 Years
                </h3>
            </div>
            <div className="w-full h-[350px] sm:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 10,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                        <XAxis
                            dataKey="year"
                            stroke="#64748b"
                            tick={{ fontSize: 12 }}
                            label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }}
                        />
                        <YAxis
                            stroke="#64748b"
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
                        />
                        <Tooltip
                            formatter={(value: number) => formatCurrency(value)}
                            labelFormatter={(label) => `Year ${label}`}
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />

                        <Line type="monotone" dataKey="Bank FD" stroke="#A0A9AB" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                        <Line type="monotone" dataKey="Govt Bonds" stroke="#64748b" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="Conservative MF" stroke="#A65F43" strokeWidth={2} strokeDasharray="2 2" dot={false} />
                        <Line type="monotone" dataKey="Aggressive Equity" stroke="#E8D3A3" strokeWidth={2} dot={false} />
                        <Line
                            type="monotone"
                            dataKey={`Mater Maria (${planName})`}
                            stroke="#2F4F4F"
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: '#2F4F4F', strokeWidth: 0 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

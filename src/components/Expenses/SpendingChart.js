import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const SpendingChart = ({ categories, allocations, isDarkMode, formatVND }) => {
    const dataValues = categories.map(cat => parseFloat(allocations[cat.value] || 0));
    const hasData = dataValues.some(v => v > 0);

    const data = {
        labels: categories.map(cat => cat.label),
        datasets: [
            {
                data: hasData ? dataValues : [1],
                backgroundColor: hasData ? categories.map(cat => cat.color) : [isDarkMode ? '#1F222A' : '#E2E8F0'],
                borderWidth: 2,
                borderColor: isDarkMode ? '#111318' : '#FFFFFF',
                hoverOffset: 15,
                cutout: '75%',
            },
        ],
    };

    const options = {
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: hasData,
                callbacks: {
                    label: (context) => ` ${context.label}: ${formatVND(context.raw)}`,
                },
                backgroundColor: isDarkMode ? '#111318' : '#ffffff',
                titleColor: isDarkMode ? '#f3f4f6' : '#111827',
                bodyColor: isDarkMode ? '#f3f4f6' : '#111827',
                borderColor: isDarkMode ? '#1e222a' : '#e2e8f0',
                borderWidth: 1,
                padding: 12,
                boxPadding: 6,
                usePointStyle: true,
            },
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    const total = dataValues.reduce((a, b) => a + b, 0);

    return (
        <div className="p-6 border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-sm relative">

            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-display font-bold tracking-widest text-[var(--accent-gold)] uppercase">
                    PHÂN BỔ CHI TIÊU THỰC TẾ
                    {!hasData && <span className="text-[10px] font-sans font-normal text-[var(--text-muted)] lowercase ml-2">(chưa có dữ liệu)</span>}
                </h3>
            </div>

            <div className="relative h-64 mb-6">
                <Doughnut data={data} options={options} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-display font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Tổng cộng</span>
                    <span className="text-xl font-mono font-bold text-[var(--text-primary)]">{formatVND(total)}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
                {categories.map((cat) => {
                    const value = parseFloat(allocations[cat.value] || 0);
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                    return (
                        <div key={cat.value} className="flex items-center justify-between py-1.5 border-b border-[var(--border-color)] last:border-b-0">
                            <div className="flex items-center gap-3">
                                {/* Square color box */}
                                <div className="w-3 h-3 flex-shrink-0" style={{ backgroundColor: cat.color }} />
                                <span className="text-xs font-display text-[var(--text-muted)] uppercase tracking-wider">{cat.label.split(' (')[0]}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 border border-[var(--border-color)] bg-black text-[var(--text-secondary)]">
                                    {percentage}%
                                </span>
                                <span className="text-xs font-mono font-bold text-[var(--text-primary)]">{formatVND(value)}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SpendingChart;

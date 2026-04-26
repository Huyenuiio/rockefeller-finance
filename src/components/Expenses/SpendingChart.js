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
                backgroundColor: hasData ? categories.map(cat => cat.color) : [isDarkMode ? '#374151' : '#e5e7eb'],
                borderWidth: 0,
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
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                titleColor: isDarkMode ? '#f3f4f6' : '#111827',
                bodyColor: isDarkMode ? '#f3f4f6' : '#111827',
                borderColor: isDarkMode ? '#374151' : '#e5e7eb',
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
        <div className={`p-6 rounded-3xl shadow-xl border transition-all duration-300 ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-blue-100'}`}>
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    Phân bổ chi tiêu
                    {!hasData && <span className="text-xs font-normal text-gray-400">(Chưa có dữ liệu)</span>}
                </h3>
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            </div>

            <div className="relative h-64 mb-6">
                <Doughnut data={data} options={options} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tổng cộng</span>
                    <span className="text-2xl font-black">{formatVND(total)}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {categories.map((cat) => {
                    const value = parseFloat(allocations[cat.value] || 0);
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                    return (
                        <div key={cat.value} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full transition-transform group-hover:scale-125" style={{ backgroundColor: cat.color }} />
                                <span className="text-sm font-medium opacity-80">{cat.label}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 opacity-60">
                                    {percentage}%
                                </span>
                                <span className="text-sm font-bold">{formatVND(value)}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SpendingChart;

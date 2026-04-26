import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const AllocationChart = ({ chartData, chartOptions, recentTransactionsForChart, formatVND, isDarkMode }) => {
    return (
        <section className="mb-8 font-quicksand">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2 ">
                <svg width="22" height="22" viewBox="0 0 24 24" aria-label="chart" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#2563eb" fillOpacity="0.10" />
                    <circle cx="12" cy="12" r="10" stroke="#2563eb" strokeWidth="2" />
                    <path d="M12 6v6l4 2" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Phân tích chi tiêu gần đây
            </h3>
            <div className={`p-4 rounded-2xl shadow-lg bg-gradient-to-br font-quicksand ${isDarkMode ? 'from-gray-800 via-gray-900 to-gray-800' : 'from-white via-blue-50 to-blue-100'} transition`}>
                {recentTransactionsForChart.length > 0 ? (
                    <div className="relative" style={{ height: '260px', minHeight: '200px' }}>
                        <Doughnut data={chartData} options={chartOptions} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none font-quicksand">
                            <span className="text-xs text-gray-500 dark:text-gray-300">Tổng</span>
                            <span className="text-lg font-bold text-blue-600 dark:text-blue-300">{formatVND(
                                recentTransactionsForChart.reduce((sum, tx) => sum + (parseFloat(tx.amount) || 0), 0)
                            )}</span>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-600 dark:text-gray-300 text-center">Chưa có giao dịch để phân tích.</p>
                )}
            </div>
        </section>
    );
};

export default AllocationChart;

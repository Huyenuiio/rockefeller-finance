import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { PieChart } from 'lucide-react';

const AllocationChart = ({ chartData, chartOptions, recentTransactionsForChart, formatVND, isDarkMode }) => {
    const totalAmount = recentTransactionsForChart.reduce((sum, tx) => sum + (parseFloat(tx.amount) || 0), 0);

    return (
        <section className="mb-8">
            <h3 className="text-xs font-display font-bold tracking-widest text-[var(--accent-gold)] mb-3 flex items-center gap-2 uppercase">
                <PieChart size={16} />
                PHÂN TÍCH CHI TIÊU THỰC TẾ
            </h3>
            <div className="p-6 border border-[var(--border-color)] bg-[var(--bg-secondary)] relative shadow-sm">
                {recentTransactionsForChart.length > 0 ? (
                    <div className="relative" style={{ height: '260px', minHeight: '200px' }}>
                        <Doughnut data={chartData} options={chartOptions} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-[10px] font-sans font-bold tracking-widest uppercase text-[var(--text-muted)]">Tổng chi</span>
                            <span className="text-base font-mono font-bold text-[var(--text-primary)]">
                                {formatVND(totalAmount)}
                            </span>
                        </div>
                    </div>
                ) : (
                    <p className="text-[var(--text-muted)] text-xs text-center py-12 font-sans font-bold uppercase tracking-widest">
                        Chưa có giao dịch trong kỳ để phân tích.
                    </p>
                )}
            </div>
        </section>
    );
};

export default AllocationChart;

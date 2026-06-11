import React from 'react';
import { Eye, EyeOff, Wallet, ArrowUpRight, TrendingDown } from 'lucide-react';

const ExpenseDashboardHeader = ({
    initialBudget,
    totalExpenses,
    visibility,
    toggleVisibility,
    formatVND,
    isDarkMode,
    onDeposit
}) => {
    return (
        <div className="relative overflow-hidden p-8 border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-lg group">
            {/* Gold decorative top border */}
            <div className="absolute top-0 left-0 w-full h-[4px] bg-[var(--accent-gold)]" />

            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                {/* Balance Info */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 border border-[var(--border-color)] bg-black px-4 py-2 select-none">
                        <Wallet size={16} className="text-[var(--accent-gold)]" />
                        <span className="text-[10px] font-display font-bold uppercase tracking-widest text-[var(--accent-gold)]">
                            NGÂN SÁCH TRỪ CHI TIÊU
                        </span>
                        <button
                            onClick={() => toggleVisibility('budgetBalance')}
                            className="p-1 text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition"
                        >
                            {visibility.budgetBalance ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                    </div>

                    <div className="space-y-1">
                        <p className="text-4xl md:text-5xl font-mono font-bold text-[var(--text-primary)] tracking-tight">
                            {visibility.budgetBalance ? formatVND(initialBudget) : '••••••••'}
                        </p>
                        <div className="flex items-center gap-2 text-xs font-display text-[var(--text-muted)] uppercase tracking-wider">
                            <ArrowUpRight size={14} className="text-emerald-500" />
                            <span>Kỷ luật tài sản ổn định</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions / Spent */}
                <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-4">
                    <div className="border border-[var(--border-color)] p-5 bg-[rgba(var(--accent-gold-rgb),0.02)] min-w-[200px]">
                        <div className="flex items-center justify-between gap-8 mb-2">
                            <span className="text-[10px] font-display font-bold uppercase tracking-widest text-[var(--text-muted)]">
                                TỔNG TIÊU DÙNG
                            </span>
                            <TrendingDown size={14} className="text-red-500" />
                        </div>
                        <p className="text-xl font-mono font-bold text-[var(--text-primary)]">
                            {visibility.budgetBalance ? formatVND(totalExpenses) : '••••••••'}
                        </p>
                    </div>

                    <button
                        onClick={onDeposit}
                        className="btn-gold-primary py-3.5 px-6 text-xs uppercase tracking-widest font-bold w-full"
                    >
                        Nạp thêm ngân sách
                    </button>
                </div>
            </div>

            <div className="absolute bottom-3 right-5 opacity-10 text-[9px] font-display font-bold tracking-[0.2em] uppercase pointer-events-none italic">
                Rockefeller Empire Treasury
            </div>
        </div>
    );
};

export default ExpenseDashboardHeader;

import React from 'react';
import { Eye, EyeOff, Wallet, ArrowUpRight, TrendingDown, TrendingUp } from 'lucide-react';
import { parseTransactionDate } from '../../utils/dateHelpers';

const ExpenseDashboardHeader = ({
    initialBudget,
    totalExpenses,
    expenses = [],
    visibility,
    toggleVisibility,
    formatVND,
    isDarkMode,
    onDeposit
}) => {
    // 1. Calculate Budget Health (Remaining vs Total)
    const remaining = parseFloat(initialBudget) || 0;
    const spent = parseFloat(totalExpenses) || 0;
    const total = remaining + spent;
    const remainingRatio = total > 0 ? (remaining / total) : 1;
    const remainingPercent = (remainingRatio * 100).toFixed(0);

    let budgetTrendIcon = <ArrowUpRight size={14} className="text-emerald-500" />;
    let budgetTrendText = `Ngân sách an toàn (Còn lại ${remainingPercent}%)`;
    
    if (remainingRatio < 0.2) {
        budgetTrendIcon = <TrendingDown size={14} className="text-red-500 animate-pulse" />;
        budgetTrendText = `Cảnh báo: Ngân sách sắp cạn! (Còn lại ${remainingPercent}%)`;
    } else if (remainingRatio < 0.5) {
        budgetTrendIcon = <TrendingDown size={14} className="text-amber-500" />;
        budgetTrendText = `Chi tiêu quá bán (Còn lại ${remainingPercent}%)`;
    }

    // 2. Calculate Spending Trend (This Month vs Last Month)
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    let lastMonth = currentMonth - 1;
    let lastMonthYear = currentYear;
    if (lastMonth < 0) {
        lastMonth = 11;
        lastMonthYear -= 1;
    }
    
    let thisMonthTotal = 0;
    let lastMonthTotal = 0;
    
    expenses.forEach(tx => {
        const dateStr = tx.date || tx.timestamp;
        if (!dateStr) return;
        const txDate = parseTransactionDate(dateStr);
        if (isNaN(txDate.getTime())) return;
        
        const m = txDate.getMonth();
        const y = txDate.getFullYear();
        
        if (m === currentMonth && y === currentYear) {
            thisMonthTotal += parseFloat(tx.amount || 0);
        } else if (m === lastMonth && y === lastMonthYear) {
            lastMonthTotal += parseFloat(tx.amount || 0);
        }
    });

    let spendingTrendIcon = <TrendingDown size={14} className="text-emerald-500" />;
    let spendingTrendText = 'Ổn định so với tháng trước';
    
    if (lastMonthTotal > 0) {
        const diffPercent = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
        const absPercent = Math.abs(diffPercent).toFixed(1);
        if (diffPercent > 0) {
            spendingTrendIcon = <TrendingUp size={14} className="text-red-500" />;
            spendingTrendText = `Tăng ${absPercent}% so với tháng trước`;
        } else if (diffPercent < 0) {
            spendingTrendIcon = <TrendingDown size={14} className="text-emerald-500" />;
            spendingTrendText = `Giảm ${absPercent}% so với tháng trước`;
        } else {
            spendingTrendIcon = <TrendingDown size={14} className="text-emerald-500" />;
            spendingTrendText = 'Bằng với tháng trước';
        }
    } else {
        spendingTrendText = 'Chưa đủ dữ liệu so sánh';
    }

    return (
        <div className="relative overflow-hidden p-8 border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-lg group">

            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                {/* Balance Info */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 border border-[var(--border-color)] bg-black px-4 py-2 select-none">
                        <Wallet size={16} className="text-[var(--accent-gold)]" />
                        <span className="text-[10px] font-display font-bold uppercase tracking-widest text-[var(--accent-gold)]">
                            NGÂN SÁCH KHẢ DỤNG
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
                            {budgetTrendIcon}
                            <span>{budgetTrendText}</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions / Spent */}
                <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-4">
                    <div className="border border-[var(--border-color)] p-5 bg-[rgba(var(--accent-gold-rgb),0.02)] min-w-[220px]">
                        <div className="flex items-center justify-between gap-8 mb-2">
                            <span className="text-[10px] font-display font-bold uppercase tracking-widest text-[var(--text-muted)]">
                                TỔNG TIÊU DÙNG
                            </span>
                            {spendingTrendIcon}
                        </div>
                        <p className="text-xl font-mono font-bold text-[var(--text-primary)] mb-1">
                            {visibility.budgetBalance ? formatVND(totalExpenses) : '••••••••'}
                        </p>
                        <p className="text-[9px] font-display uppercase tracking-wider text-[var(--text-muted)] mt-1 font-medium">
                            {spendingTrendText}
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

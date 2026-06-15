import React from 'react';
import { Trash2, ShoppingBag } from 'lucide-react';
import { parseTransactionDate } from '../../utils/dateHelpers';

const ExpenseHistory = ({
    sortedExpenses,
    handleDeleteExpense,
    formatVND,
    isDarkMode,
}) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const txDate = parseTransactionDate(dateStr);
        if (isNaN(txDate.getTime())) return dateStr;
        const dateVal = txDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const timeVal = txDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        return `${dateVal} ${timeVal}`;
    };

    return (
        <div className="bg-[var(--bg-secondary)]">
            {sortedExpenses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 opacity-30 select-none">
                    <ShoppingBag size={36} className="mb-3 text-[var(--accent-gold)]" />
                    <p className="font-display text-xs uppercase tracking-wider">Chưa có giao dịch phát sinh</p>
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="rockefeller-table min-w-full">
                            <thead>
                                <tr>
                                    <th className="w-1/3">Nội dung chi</th>
                                    <th className="w-1/6">Danh mục</th>
                                    <th className="w-1/6">Địa điểm</th>
                                    <th className="w-1/6">Ngày</th>
                                    <th className="w-1/6 text-right">Số tiền</th>
                                    <th className="w-12 text-center">Tác vụ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedExpenses.map((expense, index) => {
                                    let catLabel = 'Khác';
                                    if (expense.category) {
                                        const lower = expense.category.toLowerCase();
                                        if (lower.includes('essential')) catLabel = 'Thiết yếu';
                                        else if (lower.includes('saving')) catLabel = 'Tiết kiệm';
                                        else if (lower.includes('charity')) catLabel = 'Từ thiện';
                                        else if (lower.includes('self')) catLabel = 'Đầu tư bản thân';
                                        else if (lower.includes('emergency')) catLabel = 'Dự phòng';
                                    }
                                    return (
                                        <tr key={index} className="transition-colors hover:bg-[rgba(var(--accent-gold-rgb),0.02)]">
                                            <td className="font-medium text-xs text-[var(--text-primary)]">
                                                {expense.purpose}
                                            </td>
                                            <td>
                                                <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)]">
                                                    {catLabel}
                                                </span>
                                            </td>
                                            <td className="truncate max-w-[120px] font-sans text-xs">
                                                {expense.location || '-'}
                                            </td>
                                            <td className="font-mono text-[11px] opacity-80">
                                                {formatDate(expense.date)}
                                            </td>
                                            <td className="text-right font-mono font-bold text-xs text-rose-500">
                                                -{formatVND(expense.amount)}
                                            </td>
                                            <td className="text-center">
                                                <button
                                                    onClick={() => handleDeleteExpense(expense._id || index)}
                                                    className="p-1.5 hover:text-red-500 text-[var(--text-muted)] transition focus:outline-none"
                                                    aria-label="Xóa chi tiêu"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile List View (ul/li) */}
                    <ul className="divide-y divide-[var(--border-color)] md:hidden">
                        {sortedExpenses.map((expense, index) => {
                            let catLabel = 'Khác';
                            if (expense.category) {
                                const lower = expense.category.toLowerCase();
                                if (lower.includes('essential')) catLabel = 'Thiết yếu';
                                else if (lower.includes('saving')) catLabel = 'Tiết kiệm';
                                else if (lower.includes('charity')) catLabel = 'Từ thiện';
                                else if (lower.includes('self')) catLabel = 'Đầu tư bản thân';
                                else if (lower.includes('emergency')) catLabel = 'Dự phòng';
                            }
                            return (
                                <li key={expense._id || index} className="p-4 flex items-center justify-between hover:bg-[rgba(var(--accent-gold-rgb),0.02)] transition-colors">
                                    <div className="flex flex-col gap-1 min-w-0 pr-4">
                                        <span className="font-display font-bold text-xs text-[var(--text-primary)] truncate">
                                            {expense.purpose}
                                        </span>
                                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-[var(--text-muted)] font-medium">
                                            <span className="uppercase tracking-wider font-semibold text-[var(--accent-gold)]">
                                                {catLabel}
                                            </span>
                                            <span>•</span>
                                            <span className="truncate">{expense.location || '-'}</span>
                                            <span>•</span>
                                            <span className="font-mono">{formatDate(expense.date)}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <span className="font-mono font-bold text-xs text-rose-500">
                                            -{formatVND(expense.amount)}
                                        </span>
                                        <button
                                            onClick={() => handleDeleteExpense(expense._id || index)}
                                            className="p-2 hover:text-red-500 text-[var(--text-muted)] transition focus:outline-none"
                                            aria-label="Xóa chi tiêu"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </>
            )}
        </div>
    );
};

export default ExpenseHistory;

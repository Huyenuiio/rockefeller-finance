import React from 'react';
import { Trash2, ShoppingBag, Edit2 } from 'lucide-react';
import { parseTransactionDate } from '../../utils/dateHelpers';
import { getCategoryShortLabel } from '../../constants/categories';
import feedback from '../../utils/feedback';

const ExpenseHistory = ({
    sortedExpenses,
    handleDeleteExpense,
    handleEditExpense,
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
                                    <th className="w-20 text-center">Tác vụ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedExpenses.map((expense, index) => {
                                    const catLabel = getCategoryShortLabel(expense.category);
                                    return (
                                        <tr key={expense._id || index} className="transition-colors hover:bg-[rgba(var(--accent-gold-rgb),0.02)]">
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
                                                <div className="flex items-center justify-center gap-1">
                                                    {handleEditExpense && (
                                                        <button
                                                            onClick={() => {
                                                                feedback.tap();
                                                                handleEditExpense(expense);
                                                            }}
                                                            className="p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center hover:text-[var(--accent-gold)] text-[var(--text-muted)] hover:bg-white/[0.04] transition focus:outline-none"
                                                            title="Chỉnh sửa giao dịch"
                                                            aria-label="Chỉnh sửa giao dịch"
                                                        >
                                                            <Edit2 size={13} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            feedback.warning();
                                                            handleDeleteExpense(expense);
                                                        }}
                                                        className="p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center hover:text-red-500 text-[var(--text-muted)] hover:bg-red-500/10 transition focus:outline-none"
                                                        title="Xóa giao dịch"
                                                        aria-label="Xóa giao dịch"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
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
                            const catLabel = getCategoryShortLabel(expense.category);
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
                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                        <span className="font-mono font-bold text-xs text-rose-500 mr-1">
                                            -{formatVND(expense.amount)}
                                        </span>
                                        {handleEditExpense && (
                                            <button
                                                onClick={() => {
                                                    feedback.tap();
                                                    handleEditExpense(expense);
                                                }}
                                                className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center hover:text-[var(--accent-gold)] text-[var(--text-muted)] active:bg-white/[0.08] transition focus:outline-none"
                                                aria-label="Chỉnh sửa chi tiêu"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => {
                                                feedback.warning();
                                                handleDeleteExpense(expense);
                                            }}
                                            className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center hover:text-red-500 text-[var(--text-muted)] active:bg-red-500/10 transition focus:outline-none"
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

import React from 'react';
import { Trash2, ShoppingBag } from 'lucide-react';

const ExpenseHistory = ({
    sortedExpenses,
    handleDeleteExpense,
    formatVND,
    isDarkMode,
}) => {
    return (
        <div className="overflow-x-auto bg-[var(--bg-secondary)]">
            {sortedExpenses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 opacity-30 select-none">
                    <ShoppingBag size={36} className="mb-3 text-[var(--accent-gold)]" />
                    <p className="font-display text-xs uppercase tracking-wider">Chưa có giao dịch phát sinh</p>
                </div>
            ) : (
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
                                        {expense.date || '-'}
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
            )}
        </div>
    );
};

export default ExpenseHistory;

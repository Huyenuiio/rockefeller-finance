import React from 'react';
import { ChevronDown, ChevronUp, History } from 'lucide-react';
import { parseVietnameseMonthYear } from '../../utils/dateHelpers';

const TransactionHistoryList = ({
    paginatedGrouped,
    expandedMonths,
    toggleMonth,
    sortTransactionsByDateDesc,
    categories,
    formatVND,
    currentPage,
    setCurrentPage,
    totalPages,
    isDarkMode,
    onExportCSV,
    onImportCSV
}) => {
    return (
        <section className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <h3 className="text-xs font-display font-bold tracking-widest text-[var(--accent-gold)] flex items-center gap-2 uppercase">
                    <History size={16} />
                    LỊCH SỬ GIAO DỊCH
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onExportCSV}
                        className="btn-gold-outline px-3 py-1.5 text-[10px] font-display font-bold tracking-widest uppercase flex items-center gap-1.5"
                    >
                        Xuất CSV
                    </button>
                    <label className="btn-gold-outline px-3 py-1.5 text-[10px] font-display font-bold tracking-widest uppercase flex items-center gap-1.5 cursor-pointer">
                        Nhập CSV
                        <input
                            type="file"
                            accept=".csv"
                            onChange={onImportCSV}
                            className="hidden"
                        />
                    </label>
                </div>
            </div>
            {Object.keys(paginatedGrouped).length > 0 ? (
                <>
                    {Object.keys(paginatedGrouped).sort((a, b) => {
                        return parseVietnameseMonthYear(b) - parseVietnameseMonthYear(a);
                    }).map((monthYear) => (
                        <div key={monthYear} className="mb-4">
                            <button
                                onClick={() => toggleMonth(monthYear)}
                                className="w-full flex justify-between items-center p-3.5 border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:bg-[rgba(var(--accent-gold-rgb),0.04)] font-display text-xs tracking-wider uppercase transition focus:outline-none rounded-none"
                                aria-expanded={!!expandedMonths[monthYear]}
                                aria-controls={`transactions-${monthYear}`}
                            >
                                <span className="font-bold">
                                    {monthYear}{' '}
                                    <span className="font-sans font-normal text-xs text-[var(--text-muted)] lowercase">
                                        ({paginatedGrouped[monthYear].length} giao dịch)
                                    </span>
                                </span>
                                {expandedMonths[monthYear] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            
                            {expandedMonths[monthYear] && (
                                <div
                                    id={`transactions-${monthYear}`}
                                    className="overflow-x-auto border-x border-b border-[var(--border-color)] bg-[var(--bg-secondary)]"
                                >
                                    <table className="rockefeller-table min-w-full">
                                        <thead>
                                            <tr>
                                                <th className="w-1/4">Danh mục</th>
                                                <th className="w-1/4">Chi tiết</th>
                                                <th className="w-1/6">Địa điểm</th>
                                                <th className="w-1/6">Thời gian</th>
                                                <th className="w-1/6 text-right">Số tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sortTransactionsByDateDesc(paginatedGrouped[monthYear]).map((transaction, index) => {
                                                const cat = categories.find(c => c.value === transaction.category);
                                                return (
                                                    <tr key={index} className="transition-colors hover:bg-[rgba(var(--accent-gold-rgb),0.02)]">
                                                        <td className="font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <span className="scale-75 flex-shrink-0">{cat?.icon}</span>
                                                                <span className="text-xs uppercase tracking-wider font-display">{cat?.label?.split(' (')[0] || 'Khác'}</span>
                                                            </div>
                                                        </td>
                                                        <td className="truncate max-w-[150px] font-sans text-xs">
                                                            {transaction.details || <span className="italic text-[var(--text-muted)]">-</span>}
                                                        </td>
                                                        <td className="truncate max-w-[120px] font-sans text-xs">
                                                            {transaction.location || <span className="italic text-[var(--text-muted)]">-</span>}
                                                        </td>
                                                        <td className="font-mono text-[11px] opacity-80">
                                                            {transaction.timestamp ? transaction.timestamp.split(' ')[0] : '-'}
                                                        </td>
                                                        <td className="text-right font-mono font-bold text-xs text-[var(--text-primary)]">
                                                            {formatVND(transaction.amount)}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))}
                    
                    {/* Pagination */}
                    <div className="flex justify-center items-center gap-4 mt-6">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="btn-gold-outline py-2 px-4 text-xs font-bold uppercase tracking-widest disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                            Trang trước
                        </button>
                        <span className="text-xs font-display tracking-widest font-bold text-[var(--text-muted)]">
                            {currentPage} / {totalPages || 1}
                        </span>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages || 1))}
                            disabled={currentPage === (totalPages || 1)}
                            className="btn-gold-outline py-2 px-4 text-xs font-bold uppercase tracking-widest disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                            Trang sau
                        </button>
                    </div>
                </>
            ) : (
                <div className="p-8 border border-[var(--border-color)] bg-[rgba(var(--accent-gold-rgb),0.02)] text-center">
                    <p className="text-sm font-display uppercase tracking-wider text-[var(--text-muted)]">
                        Không tìm thấy giao dịch phù hợp với bộ lọc hiện tại.
                    </p>
                </div>
            )}
        </section>
    );
};

export default TransactionHistoryList;

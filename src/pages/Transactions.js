import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { categories } from '../constants/categories';
import { formatVND } from '../constants/investments';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { parseTransactionDate } from '../utils/dateHelpers';
import { API_URL } from '../config';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${API_URL}/api/expenses`,
                {
                    params: { page, limit: 15, search, category },
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setTransactions(response.data.expenses);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            console.error('Error fetching transactions:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, category, token]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (page === 1) fetchTransactions();
            else setPage(1);
        }, 500);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
            {/* Topbar */}
            <header className="sticky top-0 z-40 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] bg-opacity-95 backdrop-blur-md">
                <div className="flex items-center justify-between px-4 py-4 max-w-7xl mx-auto">
                    <h1 className="text-lg md:text-xl font-display font-bold tracking-wider text-[var(--accent-gold)] flex items-center gap-3">
                        <div className="w-8 h-8 border border-[var(--accent-gold)] flex items-center justify-center bg-black">
                          <span className="font-display font-bold text-[var(--accent-gold)] text-sm">R</span>
                        </div>
                        SỔ CÁI GIAO DỊCH
                    </h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Search & Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm nội dung, vị trí..."
                            className="rockefeller-input pl-10 text-xs py-2.5"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    </div>
                    <select
                        className="rockefeller-input text-xs py-2.5 bg-[var(--bg-secondary)] min-w-[200px]"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Tất cả danh mục</option>
                        {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label.split('(')[0]}</option>
                        ))}
                    </select>
                </div>

                {/* Ledger Table */}
                <div className="border border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-x-auto">
                    {loading && (transactions || []).length === 0 ? (
                        <div className="text-center py-20 text-xs font-display uppercase tracking-widest text-[var(--text-muted)] animate-pulse">
                            Đang truy xuất dữ liệu sổ cái...
                        </div>
                    ) : (transactions || []).length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-xs font-display uppercase tracking-widest text-[var(--text-muted)]">
                                Không tìm thấy giao dịch nào tương thích.
                            </p>
                        </div>
                    ) : (
                        <table className="rockefeller-table min-w-full">
                            <thead>
                                <tr>
                                    <th>Nội dung chi</th>
                                    <th>Danh mục quỹ</th>
                                    <th>Địa điểm</th>
                                    <th>Thời gian</th>
                                    <th className="text-right">Số tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(transactions || []).map((tx, idx) => {
                                    const normalizedCategory = {
                                        'Tiêu dùng thiết yếu': 'essentials',
                                        'Tiết kiệm bắt buộc': 'savings',
                                        'Đầu tư bản thân': 'selfInvestment',
                                        'Từ thiện': 'charity',
                                        'Dự phòng linh hoạt': 'emergency',
                                    }[tx.category] || tx.category;
                                    const categoryObj = categories.find(c => c.value === normalizedCategory);
                                    const txDate = parseTransactionDate(tx.date);
                                    const formattedDate = txDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
                                    const formattedTime = txDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

                                    return (
                                        <tr key={idx} className="transition-colors hover:bg-[rgba(var(--accent-gold-rgb),0.02)]">
                                            <td className="font-medium text-xs text-[var(--text-primary)]">
                                                {tx.purpose}
                                            </td>
                                            <td>
                                                <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)]">
                                                    {categoryObj?.label.split('(')[0] || 'Khác'}
                                                </span>
                                            </td>
                                            <td className="font-sans text-xs">
                                                {tx.location || '-'}
                                            </td>
                                            <td className="font-mono text-[11px] opacity-80 whitespace-nowrap">
                                                {formattedDate} {formattedTime}
                                            </td>
                                            <td className="text-right font-mono font-bold text-xs text-rose-500 whitespace-nowrap">
                                                -{formatVND(tx.amount)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="btn-gold-outline p-2 disabled:opacity-30 flex items-center justify-center"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-xs font-display font-bold uppercase tracking-wider text-[var(--text-muted)]">
                            Trang {page} / {totalPages}
                        </span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="btn-gold-outline p-2 disabled:opacity-30 flex items-center justify-center"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Transactions;

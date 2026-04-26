import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { categories } from '../constants/categories';
import { formatVND } from '../constants/investments';
import { FinanceContext } from '../contexts/FinanceContext';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const { isDarkMode } = useContext(FinanceContext);

    const token = localStorage.getItem('token');

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/expenses`,
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
    }, [page, category, token]); // Fetch on page/category change

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (page === 1) fetchTransactions();
            else setPage(1); // Reset to page 1 triggers fetchTransactions
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Grouping transactions by date
    const groupedTransactions = (transactions || []).reduce((groups, tx) => {
        if (!tx.date) return groups;
        const date = tx.date.split('T')[0]; // Simple split for ISO
        if (!groups[date]) groups[date] = [];
        groups[date].push(tx);
        return groups;
    }, {});

    return (
        <div className={`min-h-screen p-4 sm:p-6 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <header className="max-w-7xl mx-auto mb-8">
                <h1 className="text-3xl font-black mb-6 flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-xl shadow-lg shadow-blue-500/20">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                    </div>
                    Lịch sử giao dịch
                </h1>

                {/* Filters */}
                <div className="glass-card p-4 rounded-2xl shadow-xl flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm mục đích, vị trí..."
                            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <select
                        className={`px-4 py-2.5 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Tất cả danh mục</option>
                        {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label.split('(')[0]}</option>
                        ))}
                    </select>
                </div>

                {/* List */}
                <div className="space-y-8">
                    {loading && (transactions || []).length === 0 ? (
                        <div className="text-center py-20 text-gray-500 animate-pulse">Đang tải giao dịch...</div>
                    ) : (transactions || []).length === 0 ? (
                        <div className="text-center py-20 glass-card rounded-2xl">
                            <p className="text-gray-500">Không tìm thấy giao dịch nào khớp với bộ lọc.</p>
                        </div>
                    ) : (
                        Object.keys(groupedTransactions).map(date => (
                            <section key={date} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2">
                                    {new Date(date).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
                                </h2>
                                <div className="space-y-3">
                                    {groupedTransactions[date].map((tx, idx) => {
                                        const categoryObj = categories.find(c => c.value === tx.category);
                                        return (
                                            <div key={idx} className="glass-card p-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-between group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-green-500/10 flex items-center justify-center text-2xl">
                                                        {categoryObj?.icon || '💰'}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-base">{tx.purpose}</h3>
                                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                            {tx.location} • {categoryObj?.label.split('(')[0]}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-black text-lg text-blue-600 dark:text-blue-400">-{formatVND(tx.amount)}</div>
                                                    <div className="text-[10px] text-gray-400 flex items-center justify-end gap-1">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                        {new Date(tx.date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12 pb-10">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="p-2 rounded-xl glass-card disabled:opacity-30 hover:bg-blue-500 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <span className="font-bold px-4">Trang {page} / {totalPages}</span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="p-2 rounded-xl glass-card disabled:opacity-30 hover:bg-blue-500 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                )}
            </header>

            <style>{`
                .glass-card {
                    background: ${isDarkMode ? 'rgba(30,32,40,0.98)' : 'rgba(255,255,255,1)'};
                    backdrop-filter: blur(10px);
                    border: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
                }
                .animate-in {
                    animation: animate-in 0.5s ease-out;
                }
                @keyframes animate-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default Transactions;

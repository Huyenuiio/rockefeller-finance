import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { categories } from '../constants/categories';
import { formatVND } from '../constants/investments';
import { ChevronLeft, ChevronRight, Search, Trash2, Edit2 } from 'lucide-react';
import { parseTransactionDate } from '../utils/dateHelpers';
import { exportToCSV, parseCSV } from '../utils/csvHelpers';
import { numberToWords } from '../constants/investments';
import { API_URL } from '../config';
import EditExpenseModal from '../components/Expenses/EditExpenseModal';
import DeleteExpenseModal from '../components/Expenses/DeleteExpenseModal';
import UndoToast from '../components/Common/UndoToast';
import feedback from '../utils/feedback';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [allocations, setAllocations] = useState({});
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [minAmount, setMinAmount] = useState('');
    const [maxAmount, setMaxAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [deletingExpense, setDeletingExpense] = useState(null);
    const [lastDeletedExpense, setLastDeletedExpense] = useState(null);
    const [notification, setNotification] = useState('');
    const token = localStorage.getItem('token');

    const showNotify = (msg, undoExp = null) => {
        setNotification(msg);
        if (undoExp) setLastDeletedExpense(undoExp);
        setTimeout(() => {
            setNotification('');
            setLastDeletedExpense(null);
        }, undoExp ? 7000 : 3500);
    };

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const [response, allocRes] = await Promise.all([
                axios.get(`${API_URL}/api/expenses`, {
                    params: { 
                        page, 
                        limit: 15, 
                        search, 
                        category,
                        startDate,
                        endDate,
                        minAmount,
                        maxAmount
                    },
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${API_URL}/api/allocations`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);
            const expList = Array.isArray(response.data.expenses)
                ? response.data.expenses
                : (Array.isArray(response.data) ? response.data : []);
            setTransactions(expList);
            setTotalPages(response.data.totalPages || 1);
            setAllocations(allocRes.data || {});
        } catch (err) {
            console.error('Error fetching transactions:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleResetFilters = () => {
        setSearch('');
        setCategory('');
        setStartDate('');
        setEndDate('');
        setMinAmount('');
        setMaxAmount('');
        setPage(1);
    };

    useEffect(() => {
        fetchTransactions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, category, token, startDate, endDate]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (page === 1) fetchTransactions();
            else setPage(1);
        }, 500);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, minAmount, maxAmount]);

    const handleExportCSV = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${API_URL}/api/expenses`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const csvContent = exportToCSV(response.data, categories);
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `rockefeller_so_cai_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error('Lỗi xuất CSV:', err);
            alert('Không thể xuất file CSV');
        } finally {
            setLoading(false);
        }
    };

    const handleImportCSV = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = async (event) => {
            const csvText = event.target?.result;
            if (!csvText) return;
            
            const parsedExpenses = parseCSV(csvText, categories);
            if (parsedExpenses.length === 0) {
                alert('Không tìm thấy dữ liệu hợp lệ trong file CSV.');
                return;
            }
            
            const confirmImport = window.confirm(`Bạn có chắc chắn muốn nhập ${parsedExpenses.length} giao dịch từ file CSV?`);
            if (!confirmImport) return;
            
            try {
                setLoading(true);
                await axios.post(
                    `${API_URL}/api/expenses/bulk`,
                    { expenses: parsedExpenses },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                alert(`Nhập thành công ${parsedExpenses.length} giao dịch!`);
                fetchTransactions();
            } catch (err) {
                console.error('Lỗi nhập dữ liệu chi tiêu hàng loạt:', err);
                alert(err.response?.data?.error || 'Đã xảy ra lỗi khi nhập dữ liệu');
            } finally {
                setLoading(false);
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const handleSaveEdit = async (id, updatedData) => {
        try {
            await axios.put(
                `${API_URL}/api/expenses/${id}`,
                updatedData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            feedback.success();
            showNotify('Đã cập nhật giao dịch thành công!');
            fetchTransactions();
        } catch (err) {
            console.error('Lỗi khi sửa giao dịch:', err);
            showNotify(err.response?.data?.error || 'Không thể cập nhật giao dịch');
        }
    };

    const handleConfirmDelete = async (expense) => {
        if (!expense) return;
        try {
            setLoading(true);
            await axios.delete(
                `${API_URL}/api/expenses/${expense._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            feedback.warning();
            setDeletingExpense(null);
            showNotify(`Đã xóa giao dịch "${expense.purpose}"!`, expense);
            fetchTransactions();
        } catch (err) {
            console.error('Lỗi khi xóa giao dịch:', err);
            showNotify(err.response?.data?.error || 'Không thể xóa giao dịch');
        } finally {
            setLoading(false);
        }
    };

    const handleUndoDelete = async () => {
        if (!lastDeletedExpense) return;
        const toRestore = { ...lastDeletedExpense };
        setLastDeletedExpense(null);
        setNotification('');
        try {
            setLoading(true);
            await axios.post(
                `${API_URL}/api/expenses`,
                {
                    amount: toRestore.amount,
                    category: toRestore.category,
                    purpose: toRestore.purpose,
                    location: toRestore.location,
                    date: toRestore.date,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            feedback.success();
            showNotify('Đã hoàn tác và khôi phục giao dịch thành công!');
            fetchTransactions();
        } catch (err) {
            showNotify('Lỗi khi hoàn tác giao dịch');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
            {/* Topbar */}
            <header className="sticky top-0 z-40 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] bg-opacity-95 backdrop-blur-md">
                <div className="flex items-center justify-between pl-16 pr-4 py-4 md:px-4 max-w-7xl mx-auto">
                    <h1 className="text-lg md:text-xl font-display font-bold tracking-wider text-[var(--accent-gold)] flex items-center gap-3">
                        <div className="w-8 h-8 border border-[var(--accent-gold)] flex items-center justify-center bg-black">
                          <span className="font-display font-black text-[var(--accent-gold)] text-xl leading-none">R</span>
                        </div>
                        SỔ CÁI GIAO DỊCH
                    </h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Search & Filters */}
                <div className="flex flex-col gap-4 mb-6">
                    {/* Primary Filters */}
                    <div className="flex flex-col md:flex-row gap-4">
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
                            className="rockefeller-input text-xs py-2.5 bg-[var(--bg-secondary)] md:max-w-[240px]"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Tất cả danh mục</option>
                            {categories.map(cat => (
                                <option key={cat.value} value={cat.value}>{cat.label.split('(')[0]}</option>
                            ))}
                        </select>
                    </div>

                    {/* Advanced Filters (Date and Amount Ranges) */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 items-end border-t border-[var(--border-color)] pt-4">
                        {/* Start Date */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)]">Từ ngày</label>
                            <input
                                type="date"
                                className="rockefeller-input text-xs py-2 font-mono"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        
                        {/* End Date */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)]">Đến ngày</label>
                            <input
                                type="date"
                                className="rockefeller-input text-xs py-2 font-mono"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>

                        {/* Min Amount */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)]">Số tiền từ (VND)</label>
                            <input
                                type="number"
                                placeholder="0"
                                className="rockefeller-input text-xs py-2 font-mono"
                                value={minAmount}
                                onChange={(e) => setMinAmount(e.target.value)}
                            />
                        </div>

                        {/* Max Amount */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)]">Số tiền đến (VND)</label>
                            <input
                                type="number"
                                placeholder="Ví dụ: 5,000,000"
                                className="rockefeller-input text-xs py-2 font-mono"
                                value={maxAmount}
                                onChange={(e) => setMaxAmount(e.target.value)}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 col-span-2 lg:col-span-1">
                            <button
                                onClick={handleResetFilters}
                                className="flex-1 btn-gold-outline py-2 text-[9px] font-display font-bold tracking-widest uppercase flex items-center justify-center gap-1.5 whitespace-nowrap"
                            >
                                Xóa bộ lọc
                            </button>
                            <button
                                onClick={handleExportCSV}
                                className="btn-gold-outline px-3 py-2 text-[9px] font-display font-bold tracking-widest uppercase flex items-center justify-center gap-1.5 whitespace-nowrap"
                                title="Xuất CSV"
                            >
                                Xuất
                            </button>
                            <label 
                                className="btn-gold-outline px-3 py-2 text-[9px] font-display font-bold tracking-widest uppercase flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                                title="Nhập CSV"
                            >
                                Nhập
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleImportCSV}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Ledger Table */}
                <div className="border border-[var(--border-color)] bg-[var(--bg-secondary)]">
                    {loading && transactions.length === 0 ? (
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
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="rockefeller-table min-w-full">
                                    <thead>
                                        <tr>
                                            <th>Nội dung chi</th>
                                            <th>Danh mục quỹ</th>
                                            <th>Địa điểm</th>
                                            <th>Thời gian</th>
                                            <th className="text-right">Số tiền</th>
                                            <th className="w-12 text-center">Tác vụ</th>
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
                                                <tr key={tx._id || tx.id || idx} className="transition-colors hover:bg-[rgba(var(--accent-gold-rgb),0.02)]">
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
                                                    <td className="text-center">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <button
                                                                onClick={() => {
                                                                    feedback.tap();
                                                                    setEditingExpense(tx);
                                                                }}
                                                                className="min-w-[32px] min-h-[32px] p-1.5 hover:text-[var(--accent-gold)] text-[var(--text-muted)] transition active:scale-95 flex items-center justify-center"
                                                                title="Chỉnh sửa giao dịch"
                                                                aria-label="Chỉnh sửa chi tiêu"
                                                            >
                                                                <Edit2 size={13} />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    feedback.warning();
                                                                    setDeletingExpense(tx);
                                                                }}
                                                                className="min-w-[32px] min-h-[32px] p-1.5 hover:text-red-500 text-[var(--text-muted)] transition active:scale-95 flex items-center justify-center"
                                                                title="Xóa giao dịch"
                                                                aria-label="Xóa chi tiêu"
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

                            {/* Mobile List View */}
                            <ul className="divide-y divide-[var(--border-color)] md:hidden">
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
                                        <li key={tx._id || tx.id || idx} className="p-4 flex items-center justify-between hover:bg-[rgba(var(--accent-gold-rgb),0.02)] transition-colors">
                                            <div className="flex flex-col gap-1 min-w-0 pr-4">
                                                <span className="font-display font-bold text-xs text-[var(--text-primary)] truncate">
                                                    {tx.purpose}
                                                </span>
                                                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-[var(--text-muted)] font-medium">
                                                    <span className="uppercase tracking-wider font-semibold text-[var(--accent-gold)]">
                                                        {categoryObj?.label.split('(')[0] || 'Khác'}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="truncate">{tx.location || '-'}</span>
                                                    <span>•</span>
                                                    <span className="font-mono whitespace-nowrap">{formattedDate} {formattedTime}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                <span className="font-mono font-bold text-xs text-rose-500 whitespace-nowrap mr-1">
                                                    -{formatVND(tx.amount)}
                                                </span>
                                                <button
                                                    onClick={() => {
                                                        feedback.tap();
                                                        setEditingExpense(tx);
                                                    }}
                                                    className="min-w-[36px] min-h-[36px] p-2 hover:text-[var(--accent-gold)] text-[var(--text-muted)] transition active:scale-95 flex items-center justify-center"
                                                    aria-label="Chỉnh sửa chi tiêu"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        feedback.warning();
                                                        setDeletingExpense(tx);
                                                    }}
                                                    className="min-w-[36px] min-h-[36px] p-2 hover:text-red-500 text-[var(--text-muted)] transition active:scale-95 flex items-center justify-center"
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

            <UndoToast
                isOpen={!!notification}
                message={notification}
                lastDeletedItem={lastDeletedExpense}
                onUndo={handleUndoDelete}
            />

            <EditExpenseModal
                isOpen={!!editingExpense}
                onClose={() => setEditingExpense(null)}
                expense={editingExpense}
                onSave={handleSaveEdit}
                categories={categories}
                allocations={allocations}
                formatVND={formatVND}
                numberToWords={numberToWords}
            />

            <DeleteExpenseModal
                isOpen={!!deletingExpense}
                onClose={() => setDeletingExpense(null)}
                expense={deletingExpense}
                onConfirm={handleConfirmDelete}
                isSubmitting={loading}
                formatVND={formatVND}
            />
        </div>
    );
};

export default Transactions;

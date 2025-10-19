import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import numberToWords from '../utils/numberToWords';

// Category config to match Home.js
const categories = [
  {
    value: 'essentials',
    label: 'Tiêu dùng thiết yếu',
    color: '#22c55e',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" aria-label="essentials" fill="none">
        <rect x="4" y="7" width="16" height="10" rx="4" fill="#22c55e" fillOpacity="0.10"/>
        <rect x="4" y="7" width="16" height="10" rx="4" stroke="#22c55e" strokeWidth="2"/>
        <path d="M7 12h10" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    value: 'savings',
    label: 'Tiết kiệm bắt buộc',
    color: '#3b82f6',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" aria-label="savings" fill="none">
        <circle cx="12" cy="12" r="8" fill="#3b82f6" fillOpacity="0.10"/>
        <circle cx="12" cy="12" r="8" stroke="#3b82f6" strokeWidth="2"/>
        <path d="M12 8v4l3 2" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    value: 'selfInvestment',
    label: 'Đầu tư bản thân',
    color: '#eab308',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" aria-label="selfInvestment" fill="none">
        <rect x="6" y="6" width="12" height="12" rx="6" fill="#eab308" fillOpacity="0.10"/>
        <rect x="6" y="6" width="12" height="12" rx="6" stroke="#eab308" strokeWidth="2"/>
        <path d="M12 10v2h2" stroke="#eab308" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    value: 'charity',
    label: 'Từ thiện',
    color: '#a21caf',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" aria-label="charity" fill="none">
        <path d="M12 21s-6-4.35-6-9a6 6 0 1112 0c0 4.65-6 9-6 9z" fill="#a21caf" fillOpacity="0.10"/>
        <path d="M12 21s-6-4.35-6-9a6 6 0 1112 0c0 4.65-6 9-6 9z" stroke="#a21caf" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    value: 'emergency',
    label: 'Dự phòng linh hoạt',
    color: '#f97316',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" aria-label="emergency" fill="none">
        <rect x="4" y="4" width="16" height="16" rx="8" fill="#f97316" fillOpacity="0.10"/>
        <rect x="4" y="4" width="16" height="16" rx="8" stroke="#f97316" strokeWidth="2"/>
        <path d="M12 8v4l3 2" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

// Tạo state khởi tạo cho visibility
const initialVisibilityState = categories.reduce((acc, category) => {
    acc[category.value] = false;
    return acc;
}, { budgetBalance: false, totalAllocations: false });


function Expenses() {
  // State
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [purpose, setPurpose] = useState('');
  const [location, setLocation] = useState('');
  const [initialBudget, setInitialBudget] = useState(null);
  const [newBudget, setNewBudget] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allocations, setAllocations] = useState({
    essentials: 0,
    savings: 0,
    selfInvestment: 0,
    charity: 0,
    emergency: 0,
  });
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(
    () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [showAllExpenses, setShowAllExpenses] = useState(false); // For expanding/collapsing expense history
  const [visibility, setVisibility] = useState(initialVisibilityState); // State ẩn/hiện
  const token = localStorage.getItem('token');
  const snackbarTimeout = useRef(null);
  
  // Hàm bật/tắt cho một phần tử cụ thể
  const toggleVisibility = (key) => {
    setVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Biến kiểm tra xem có mục nào đang hiển thị không
  const isAnyAmountVisible = Object.values(visibility).some(v => v === true);

  // Hàm bật/tắt tất cả
  const toggleAllVisibility = () => {
    const shouldShowAll = !isAnyAmountVisible;
    const newState = Object.keys(visibility).reduce((acc, key) => {
      acc[key] = shouldShowAll;
      return acc;
    }, {});
    setVisibility(newState);
  };

  // Theme sync (like Home.js)
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.background = '#111827';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.background = '#F3F4F6';
    }
  }, [isDarkMode]);

  // Hàm quản lý hiển thị thông báo (snackbar)
  const showNotification = (message) => {
    setSnackbarMsg(message);
    setShowSnackbar(true);

    if (snackbarTimeout.current) {
      clearTimeout(snackbarTimeout.current);
    }

    snackbarTimeout.current = setTimeout(() => {
      setShowSnackbar(false);
    }, 3000); // Tự động ẩn sau 3 giây
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [budgetRes, expensesRes, allocationsRes] = await Promise.all([
          axios.get('https://backend-rockefeller-finance.onrender.com/api/initial-budget', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('https://backend-rockefeller-finance.onrender.com/api/expenses', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('https://backend-rockefeller-finance.onrender.com/api/allocations', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setInitialBudget(budgetRes.data.initialBudget);
        setExpenses(expensesRes.data);
        setAllocations(allocationsRes.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Lỗi lấy dữ liệu');
      }
    };
    if (token) fetchData();
    // eslint-disable-next-line
  }, [token]);
  
  // Format currency
  const formatVND = (value) => {
    const num = parseFloat(value) || 0;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  // Budget submit
  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    const parsedBudget = parseFloat(newBudget);
    if (isNaN(parsedBudget) || parsedBudget <= 0) {
      showNotification('Vui lòng nhập số tiền hợp lệ!');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        'https://backend-rockefeller-finance.onrender.com/api/initial-budget',
        { initialBudget: parsedBudget },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInitialBudget(response.data.initialBudget);
      setAllocations(response.data.allocations);
      setNewBudget('');
      setError('');
      showNotification('Ngân sách đã được cập nhật!');
    } catch (err) {
      showNotification(err.response?.data?.error || 'Lỗi lưu ngân sách');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Expense submit
  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      showNotification('Vui lòng nhập số tiền hợp lệ!');
      return;
    }
    if (!purpose || !location) {
      showNotification('Vui lòng nhập mục đích và vị trí!');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        'https://backend-rockefeller-finance.onrender.com/api/expenses',
        {
          amount: parsedAmount,
          category,
          purpose,
          location,
          date: date || new Date().toLocaleDateString('vi-VN'),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExpenses(response.data);
      // Update allocations and budget
      const [budgetRes, allocRes] = await Promise.all([
        axios.get('https://backend-rockefeller-finance.onrender.com/api/initial-budget', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('https://backend-rockefeller-finance.onrender.com/api/allocations', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setInitialBudget(budgetRes.data.initialBudget);
      setAllocations(allocRes.data);
      setAmount('');
      setCategory('');
      setPurpose('');
      setLocation('');
      setDate('');
      setError('');
      showNotification('Chi tiêu đã được thêm!');
    } catch (err) {
      showNotification(err.response?.data?.error || 'Lỗi thêm chi tiêu');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete expense
  const handleDeleteExpense = async (index) => {
    try {
      const response = await axios.delete(
        `https://backend-rockefeller-finance.onrender.com/api/expenses/${index}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExpenses(response.data);
      // Update budget and allocations
      const [budgetRes, allocRes] = await Promise.all([
        axios.get('https://backend-rockefeller-finance.onrender.com/api/initial-budget', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('https://backend-rockefeller-finance.onrender.com/api/allocations', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setInitialBudget(budgetRes.data.initialBudget);
      setAllocations(allocRes.data);
      showNotification('Đã xóa chi tiêu!');
    } catch (err) {
      showNotification(err.response?.data?.error || 'Lỗi xóa chi tiêu');
    }
  };

  // Theme toggle
  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Total allocations
  const totalAmount =
    parseFloat(allocations.essentials || 0) +
    parseFloat(allocations.savings || 0) +
    parseFloat(allocations.selfInvestment || 0) +
    parseFloat(allocations.charity || 0) +
    parseFloat(allocations.emergency || 0);

  // Expense history logic
  const sortedExpenses = [...expenses].reverse();
  const COLLAPSED_COUNT = 1;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 overflow-x-hidden ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'
          : 'bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-900'
      }`}
      style={{
        minHeight: '100vh',
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'none',
      }}
    >
      {/* Snackbar */}
      <div
        className={`fixed z-50 left-1/2 -translate-x-1/2 bottom-6 px-6 py-3 rounded-xl shadow-lg font-medium text-base transition-all duration-500
          ${
            showSnackbar
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4 pointer-events-none'
          }
          ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
        `}
        role="status"
        aria-live="polite"
        style={{
          maxWidth: '95vw',
          width: 'max-content',
          minWidth: 180,
          boxSizing: 'border-box',
        }}
      >
        {snackbarMsg}
      </div>

      {/* Topbar - match Home.js */}
      <header
        className="sticky top-0 z-40 bg-opacity-95 shadow-sm"
        style={{
          WebkitBackdropFilter:
            typeof window !== 'undefined' && window.innerWidth <= 640
              ? undefined
              : 'blur(10px)',
          backdropFilter:
            typeof window !== 'undefined' && window.innerWidth <= 640
              ? undefined
              : 'blur(10px)',
        }}
      >
        <div className="flex items-center justify-between px-3 py-2 md:py-4 max-w-3xl mx-auto">
          <h1
            className="font-extrabold tracking-tight flex items-center gap-2 app-title"
            style={{
              fontSize: '1.35rem',
              letterSpacing: '-0.01em',
              textRendering: 'optimizeLegibility',
              WebkitFontSmoothing: 'antialiased',
              fontWeight: 900,
              lineHeight: 1.1,
            }}
          >
            <svg width="28" height="28" viewBox="0 0 32 32" aria-label="expenses" fill="none">
              <circle cx="16" cy="16" r="14" fill="#22c55e" fillOpacity="0.12"/>
              <circle cx="16" cy="16" r="14" stroke="#22c55e" strokeWidth="2"/>
              <path d="M10 20v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/>
              <rect x="13" y="14" width="6" height="6" rx="1" fill="#22c55e" fillOpacity="0.18"/>
            </svg>
            <span className="title-text">Quản lý chi tiêu</span>
          </h1>
          <button
            onClick={toggleDarkMode}
            aria-label="Chuyển đổi chế độ sáng/tối"
            className={`rounded-full p-2 shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400
              ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-blue-100'}
            `}
          >
            {isDarkMode ? (
              <svg className="w-6 h-6 text-yellow-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
                <path d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-1 sm:px-3 py-6" style={{width: '100%'}}>
        {/* Error - Chỉ hiển thị lỗi tải trang ban đầu */}
        {error && !initialBudget && (
          <div className="mb-4">
            <div className="flex items-center gap-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 px-4 py-2 rounded-lg shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Budget input */}
        {initialBudget === null || initialBudget === 0 ? (
          <section className="mb-6">
            <div className="glass-card p-4 rounded-2xl shadow-xl">
              <h2 className="text-lg font-bold mb-2">Nhập ngân sách ban đầu</h2>
              <form onSubmit={handleBudgetSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="initialBudget">
                    Ngân sách ban đầu (VND)
                  </label>
                  <input
                    id="initialBudget"
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className={`input-modern ${isDarkMode ? 'dark' : ''}`}
                    placeholder="Nhập ngân sách ban đầu"
                    required
                    min="1"
                    inputMode="numeric"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-modern w-full"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Đang xử lý...
                    </span>
                  ) : (
                    'Lưu ngân sách'
                  )}
                </button>
              </form>
            </div>
          </section>
        ) : (
          <>
            {/* Add more budget */}
            <section className="mb-6">
              <div className="glass-card p-4 rounded-2xl shadow-xl">
                <h2 className="text-lg font-bold mb-2">Nạp thêm ngân sách</h2>
                <form onSubmit={handleBudgetSubmit} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="addBudget">
                      Số tiền nạp thêm (VND)
                    </label>
                    <input
                      id="addBudget"
                      type="number"
                      value={newBudget}
                      onChange={(e) => setNewBudget(e.target.value)}
                      className={`input-modern ${isDarkMode ? 'dark' : ''}`}
                      placeholder="Nhập số tiền nạp thêm"
                      min="1"
                      inputMode="numeric"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-modern w-full"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Đang xử lý...
                      </span>
                    ) : (
                      'Nạp thêm'
                    )}
                  </button>
                </form>
              </div>
            </section>

            {/* Budget balance */}
            <section className="mb-6">
              <div className="glass-card p-4 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold mb-1">Số dư ngân sách</h2>
                    <button
                        onClick={toggleAllVisibility}
                        aria-label="Hiện/Ẩn tất cả số tiền"
                        className={`p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-gray-800 focus:ring-blue-400' : 'focus:ring-offset-blue-100 focus:ring-blue-500'}`}
                    >
                        {isAnyAmountVisible ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                        )}
                    </button>
                </div>
                <div className="cursor-pointer flex items-center justify-between" onClick={() => toggleVisibility('budgetBalance')}>
                    <p className="text-2xl font-extrabold text-blue-500 dark:text-blue-300 tracking-tight">
                        {visibility.budgetBalance ? formatVND(initialBudget) : '******** VND'}
                    </p>
                    <span className="text-3xl animate-pulse">💰</span>
                </div>
              </div>
            </section>

            {/* Add expense */}
            <section className="mb-6">
              <div className="glass-card p-4 rounded-2xl shadow-xl">
                <h2 className="text-lg font-bold mb-2">Thêm chi tiêu</h2>
                <form onSubmit={handleExpenseSubmit} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="amount">
                      Số tiền (VND)
                    </label>
                    <input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className={`input-modern ${isDarkMode ? 'dark' : ''}`}
                      placeholder="Nhập số tiền"
                      required
                      min="1"
                      inputMode="numeric"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="category">
                      Danh mục
                    </label>
                    <div className="category-select-wrapper">
                      <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={`input-modern category-select ${isDarkMode ? 'dark' : ''}`}
                        required
                      >
                        <option value="">Chọn danh mục</option>
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.label}>
                            {cat.label.replace(/\s\(\d+%\)/, '')}
                            {allocations[cat.value] > 0 ? ` (${formatVND(allocations[cat.value])})` : ''}
                          </option>
                        ))}
                      </select>
                      {/* Mobile: show icon and color for selected category */}
                      <div className="category-mobile-visual">
                        {(() => {
                          const cat = categories.find(c => c.label === category);
                          if (!cat) return null;
                          return (
                            <span className="flex items-center gap-1">
                              <span>{cat.icon}</span>
                              <span style={{color: cat.color, fontWeight: 600, fontSize: '1rem'}}>{cat.label}</span>
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="purpose">
                      Mục đích sử dụng
                    </label>
                    <input
                      id="purpose"
                      type="text"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className={`input-modern ${isDarkMode ? 'dark' : ''}`}
                      placeholder="Nhập mục đích (ví dụ: Mua thực phẩm)"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="location">
                      Vị trí chi tiêu
                    </label>
                    <input
                      id="location"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className={`input-modern ${isDarkMode ? 'dark' : ''}`}
                      placeholder="Nhập vị trí (ví dụ: Siêu thị VinMart)"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="date">
                      Ngày
                    </label>
                    <input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className={`input-modern ${isDarkMode ? 'dark' : ''}`}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-modern w-full"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Đang xử lý...
                      </span>
                    ) : (
                      'Thêm chi tiêu'
                    )}
                  </button>
                </form>
              </div>
            </section>

            {/* Expense history */}
            <section className="mb-6">
              <div className="glass-card p-4 rounded-2xl shadow-xl">
                <h2 className="text-lg font-bold mb-2 flex items-center justify-between">
                  Lịch sử chi tiêu
                  {sortedExpenses.length > COLLAPSED_COUNT && (
                    <button
                      className="ml-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-green-400 text-white font-medium shadow hover:scale-105 active:scale-95 transition-all duration-200 text-sm"
                      onClick={() => setShowAllExpenses((prev) => !prev)}
                      aria-expanded={showAllExpenses}
                      aria-label={showAllExpenses ? "Thu nhỏ" : "Xem tất cả"}
                      type="button"
                    >
                      {showAllExpenses ? "Thu nhỏ" : "Xem tất cả"}
                    </button>
                  )}
                </h2>
                <div className="overflow-x-auto" style={{WebkitOverflowScrolling: 'touch'}}>
                  <table
                    className={`min-w-full text-xs sm:text-sm rounded-xl overflow-hidden ${
                      isDarkMode ? 'bg-gray-900' : ''
                    }`}
                    style={{
                      minWidth: 600,
                      width: '100%',
                      tableLayout: 'auto',
                    }}
                  >
                    <thead>
                      <tr
                        className={
                          isDarkMode
                            ? 'bg-gradient-to-r from-gray-800 to-gray-700'
                            : 'bg-gradient-to-r from-blue-100 to-green-100'
                        }
                      >
                        <th className="px-2 py-2 text-left font-semibold whitespace-nowrap">Ngày</th>
                        <th className="px-2 py-2 text-left font-semibold whitespace-nowrap">Danh mục</th>
                        <th className="px-2 py-2 text-left font-semibold whitespace-nowrap">Số tiền (VND)</th>
                        <th className="px-2 py-2 text-left font-semibold whitespace-nowrap">Mục đích</th>
                        <th className="px-2 py-2 text-left font-semibold whitespace-nowrap">Vị trí</th>
                        <th className="px-2 py-2 text-left font-semibold whitespace-nowrap">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedExpenses.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className={`text-center py-6 ${
                              isDarkMode ? 'text-gray-500' : 'text-gray-400'
                            }`}
                          >
                            Không có chi tiêu nào.
                          </td>
                        </tr>
                      ) : (
                        (showAllExpenses ? sortedExpenses : sortedExpenses.slice(0, COLLAPSED_COUNT)).map((expense, index) => (
                          <tr
                            key={index}
                            className={`transition-colors duration-200 ${
                              isDarkMode
                                ? 'hover:bg-gray-800'
                                : 'hover:bg-blue-50'
                            }`}
                            style={
                              isDarkMode
                                ? { backgroundColor: index % 2 === 0 ? '#23263a' : '#181a29' }
                                : {}
                            }
                          >
                            <td className={`px-2 py-2 ${isDarkMode ? 'text-gray-200' : ''}`}>{expense.date}</td>
                            <td className={`px-2 py-2 ${isDarkMode ? 'text-gray-200' : ''}`}>{expense.category}</td>
                            <td className={`px-2 py-2 font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                              {formatVND(expense.amount)}
                            </td>
                            <td className={`px-2 py-2 ${isDarkMode ? 'text-gray-200' : ''}`}>{expense.purpose}</td>
                            <td className={`px-2 py-2 ${isDarkMode ? 'text-gray-200' : ''}`}>{expense.location}</td>
                            <td className="px-2 py-2">
                              <button
                                onClick={() => handleDeleteExpense(expenses.length - 1 - index)}
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg font-medium shadow hover:scale-105 active:scale-95 transition-all duration-200
                                  ${
                                    isDarkMode
                                      ? 'bg-gradient-to-r from-red-700 to-pink-700 text-white'
                                      : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                                  }
                                `}
                                aria-label="Xóa chi tiêu"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Xóa
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Budget allocations */}
            <section className="mb-6">
              <div className="glass-card p-4 rounded-2xl shadow-xl">
                <h2 className="text-lg font-bold mb-2">Phân bổ ngân sách</h2>
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <div
                      key={cat.value}
                      className={`rounded-xl p-3 shadow-md bg-gradient-to-br cursor-pointer`}
                      onClick={() => toggleVisibility(cat.value)}
                      style={{
                        background: isDarkMode
                          ? `linear-gradient(135deg, ${cat.color}22 0%, #22223b 100%)`
                          : `linear-gradient(135deg, ${cat.color}22 0%, #fff 100%)`,
                        color: isDarkMode ? '#fff' : '#22223b',
                        minWidth: 0,
                        wordBreak: 'break-word',
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1 pointer-events-none">
                        <span>{cat.icon}</span>
                        <span className="font-semibold">{cat.label}</span>
                      </div>
                      <span className="text-xl font-bold">
                        {visibility[cat.value] ? formatVND(allocations[cat.value] || 0) : '******** VND'}
                      </span>
                    </div>
                  ))}
                </section>
              </div>
            </section>

            {/* Total allocations */}
            {totalAmount > 0 && (
              <section className="mb-6">
                <div 
                    className="glass-card p-4 rounded-2xl shadow-xl flex flex-col items-center cursor-pointer"
                    onClick={() => toggleVisibility('totalAllocations')}
                >
                  <h2 className="text-lg font-bold mb-1 pointer-events-none">Tổng số tiền phân bổ</h2>
                  <p className="text-2xl font-extrabold text-gray-700 dark:text-gray-200 mb-1">
                    {visibility.totalAllocations ? formatVND(totalAmount) : '******** VND'}
                  </p>
                  <p className="text-base italic text-gray-500 dark:text-gray-400">
                    {visibility.totalAllocations ? numberToWords(totalAmount) : '********'}
                  </p>
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* Modern glassmorphism and utility classes */}
   <style>{`



        .glass-card {



          background: rgba(255,255,255,1);



          backdrop-filter: blur(0px) saturate(1.1);



          border: 1.5px solid rgba(200,200,255,0.13);



        }



        .dark .glass-card {



          background: rgba(30,32,40,0.98);



          border: 1.5px solid rgba(80,80,120,0.18);



        }



        .input-modern {



          width: 100%;



          padding: 0.7rem 1rem;



          border-radius: 0.8rem;



          border: 1.5px solid #d1d5db;



          background: #fff;



          font-size: 1.05rem;



          font-weight: 500;



          color: #22223b;



          transition: border-color 0.2s, box-shadow 0.2s;



          outline: none;



          box-shadow: 0 1px 2px 0 rgba(59,130,246,0.04);



        }



        .input-modern:focus {



          border-color: #3b82f6;



          box-shadow: 0 0 0 2px #3b82f655;



        }



        .input-modern.dark {



          background: #23263a;



          color: #fff;



          border-color: #374151;



        }



        .btn-modern {



          display: inline-flex;



          align-items: center;



          justify-content: center;



          padding: 0.8rem 1.3rem;



          border-radius: 0.8rem;



          font-weight: 700;



          font-size: 1.05rem;



          background: linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%);



          color: #fff;



          box-shadow: 0 2px 8px 0 rgba(59,130,246,0.10);



          transition: background 0.2s, transform 0.1s;



        }



        .btn-modern:disabled {



          background: #a5b4fc;



          cursor: not-allowed;



        }



        .btn-modern:not(:disabled):hover {



          background: linear-gradient(90deg, #2563eb 0%, #0ea5e9 100%);



          transform: scale(1.03);



        }



        @media (max-width: 900px) {



          main, .glass-card { max-width: 100vw !important; }



        }



        @media (max-width: 640px) {



          .glass-card { padding: 1rem !important; }



          .input-modern, .btn-modern { font-size: 1.01rem; padding: 0.7rem 1rem; }



          .text-2xl, .text-3xl { font-size: 1.45rem !important; }



          .text-lg, .text-xl { font-size: 1.18rem !important; }



          .rounded-2xl { border-radius: 1.1rem !important; }



          .rounded-xl { border-radius: 0.8rem !important; }



          .p-4 { padding: 1rem !important; }



          .p-6 { padding: 1.2rem !important; }



          .mb-8 { margin-bottom: 1.3rem !important; }



          .mb-6 { margin-bottom: 1.1rem !important; }



          .max-w-3xl { max-width: 100vw !important; }



          .overflow-x-auto { -webkit-overflow-scrolling: touch; }



          .glass-card, .input-modern, .btn-modern {



            box-shadow: 0 2px 8px 0 rgba(59,130,246,0.10) !important;



          }



          /* Title nét căng */



          .app-title {



            font-size: 1.25rem !important;



            font-weight: 900 !important;



            letter-spacing: -0.01em !important;



            text-shadow: 0 1px 0 #fff, 0 0px 0 #000;



            color: #22223b !important;



            -webkit-font-smoothing: antialiased !important;



            text-rendering: geometricPrecision !important;



          }



          .dark .app-title {



            color: #fff !important;



            text-shadow: 0 1px 0 #23263a, 0 0px 0 #fff;



          }



          .app-title .title-text {



            font-size: 1.18rem !important;



            font-weight: 900 !important;



            letter-spacing: -0.01em !important;



            line-height: 1.1 !important;



          }



          /* Category select mobile style */



          .category-select-wrapper {



            position: relative;



            width: 100%;



          }



          .category-select {



            font-size: 1.08rem !important;



            font-weight: 600 !important;



            padding-right: 2.5rem !important;



            background: #f9fafb !important;



            border: 1.5px solid #d1d5db !important;



            color: #22223b !important;



            appearance: none;



            -webkit-appearance: none;



            border-radius: 0.8rem !important;



            min-height: 2.7rem !important;



          }



          .category-select.dark {



            background: #23263a !important;



            color: #fff !important;



            border: 1.5px solid #374151 !important;



          }



          .category-mobile-visual {



            display: flex;



            align-items: center;



            gap: 0.5rem;



            margin-top: 0.3rem;



            min-height: 1.5rem;



            font-size: 1.01rem;



            font-weight: 600;



          }



        }



        @media (max-width: 400px) {



          .glass-card { padding: 0.7rem !important; }



          .input-modern, .btn-modern { font-size: 0.98rem; padding: 0.6rem 0.8rem; }



          .app-title { font-size: 1.08rem !important; }



          .app-title .title-text { font-size: 1.01rem !important; }



        }



        .animate-shake {



          animation: shake 0.3s;



        }



        @keyframes shake {



          0% { transform: translateX(0); }



          20% { transform: translateX(-4px); }



          40% { transform: translateX(4px); }



          60% { transform: translateX(-2px); }



          80% { transform: translateX(2px); }



          100% { transform: translateX(0); }



        }



        /* Prevent horizontal scroll on mobile */



        html, body {



          max-width: 100vw;



          overflow-x: hidden;



        }



        /* Make everything crisp on mobile */



        @media (max-width: 640px) {



          body, .glass-card, .input-modern, .btn-modern, .rounded-xl, .rounded-2xl, .shadow-xl, .shadow, .shadow-md {



            filter: none !important;



            backdrop-filter: none !important;



            background-blur: none !important;



            -webkit-filter: none !important;



            -webkit-backdrop-filter: none !important;



            box-shadow: 0 2px 8px 0 rgba(59,130,246,0.10) !important;



          }



          .glass-card {



            background: #fff !important;



            border: 1.5px solid #e5e7eb !important;



          }



          .dark .glass-card {



            background: #23263a !important;



            border: 1.5px solid #374151 !important;



          }



        }



      `}</style>
    </div>
  );
}

export default Expenses;
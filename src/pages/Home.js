import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import numberToWords from '../utils/numberToWords';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryIcons = {
  essentials: (
    <svg width="32" height="32" viewBox="0 0 32 32" aria-label="Tiêu dùng thiết yếu" fill="none">
      <rect x="4" y="8" width="24" height="16" rx="4" fill="#10B981" fillOpacity="0.12"/>
      <rect x="4" y="8" width="24" height="16" rx="4" stroke="#10B981" strokeWidth="2"/>
      <path d="M10 16h12" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="10" cy="20" r="1.5" fill="#10B981"/>
      <circle cx="22" cy="20" r="1.5" fill="#10B981"/>
    </svg>
  ),
  savings: (
    <svg width="32" height="32" viewBox="0 0 32 32" aria-label="Tiết kiệm bắt buộc" fill="none">
      <ellipse cx="16" cy="20" rx="8" ry="4" fill="#3B82F6" fillOpacity="0.12"/>
      <ellipse cx="16" cy="20" rx="8" ry="4" stroke="#3B82F6" strokeWidth="2"/>
      <rect x="10" y="8" width="12" height="8" rx="3" fill="#3B82F6" fillOpacity="0.12"/>
      <rect x="10" y="8" width="12" height="8" rx="3" stroke="#3B82F6" strokeWidth="2"/>
      <path d="M16 8v-2" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  selfInvestment: (
    <svg width="32" height="32" viewBox="0 0 32 32" aria-label="Đầu tư bản thân" fill="none">
      <rect x="8" y="10" width="16" height="12" rx="3" fill="#F59E0B" fillOpacity="0.12"/>
      <rect x="8" y="10" width="16" height="12" rx="3" stroke="#F59E0B" strokeWidth="2"/>
      <path d="M12 14h8M12 18h5" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="16" cy="22" r="1.5" fill="#F59E0B"/>
    </svg>
  ),
  charity: (
    <svg width="32" height="32" viewBox="0 0 32 32" aria-label="Từ thiện" fill="none">
      <path d="M16 25s-7-4.5-7-10a5 5 0 0 1 10 0 5 5 0 0 1 10 0c0 5.5-7 10-7 10z" fill="#8B5CF6" fillOpacity="0.12"/>
      <path d="M16 25s-7-4.5-7-10a5 5 0 0 1 10 0 5 5 0 0 1 10 0c0 5.5-7 10-7 10z" stroke="#8B5CF6" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  ),
  emergency: (
    <svg width="32" height="32" viewBox="0 0 32 32" aria-label="Dự phòng linh hoạt" fill="none">
      <circle cx="16" cy="16" r="12" fill="#F97316" fillOpacity="0.12"/>
      <circle cx="16" cy="16" r="12" stroke="#F97316" strokeWidth="2"/>
      <path d="M16 11v6M16 21h.01" stroke="#F97316" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
};

const categories = [
  { value: 'essentials', label: 'Tiêu dùng thiết yếu (50%)', color: '#10B981', icon: CategoryIcons.essentials },
  { value: 'savings', label: 'Tiết kiệm bắt buộc (20%)', color: '#3B82F6', icon: CategoryIcons.savings },
  { value: 'selfInvestment', label: 'Đầu tư bản thân (15%)', color: '#F59E0B', icon: CategoryIcons.selfInvestment },
  { value: 'charity', label: 'Từ thiện (5%)', color: '#8B5CF6', icon: CategoryIcons.charity },
  { value: 'emergency', label: 'Dự phòng linh hoạt (10%)', color: '#F97316', icon: CategoryIcons.emergency },
];

function Home() {
  // State
  const [allocations, setAllocations] = useState({
    essentials: 0,
    savings: 0,
    selfInvestment: 0,
    charity: 0,
    emergency: 0,
  });
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [searchDetails, setSearchDetails] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMonthYear, setSelectedMonthYear] = useState('');
  const [isSearchMenuOpen, setIsSearchMenuOpen] = useState(false);
  const [expandedMonths, setExpandedMonths] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const transactionsPerPage = 6;
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const mainRef = useRef(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentPage]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate('/login');
        return;
      }
      setIsLoading(true);
      try {
        const [allocRes, expenseRes] = await Promise.all([
          axios.get('https://backend-rockefeller-finance.onrender.com/api/allocations', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('https://backend-rockefeller-finance.onrender.com/api/expenses', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setAllocations(allocRes.data);
        setTransactionHistory(
          expenseRes.data.map((tx) => ({
            ...tx,
            category: {
              'Tiêu dùng thiết yếu': 'essentials',
              'Tiết kiệm bắt buộc': 'savings',
              'Đầu tư bản thân': 'selfInvestment',
              'Từ thiện': 'charity',
              'Dự phòng linh hoạt': 'emergency',
            }[tx.category],
            details: tx.purpose,
            timestamp: tx.date,
          }))
        );
        setError('');
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        } else {
          setError(err.response?.data?.error || 'Lỗi tải dữ liệu');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, [token, navigate]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.background = '#111827';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.background = '#F3F4F6';
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const formatVND = (value) => {
    const num = parseFloat(value) || 0;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const totalAmount = useMemo(() =>
    categories.reduce((sum, cat) => sum + parseFloat(allocations[cat.value] || 0), 0)
  , [allocations]);

  const recentTransactionsForChart = transactionHistory.slice(0, 5);
  const categoryTotals = categories.reduce((acc, cat) => {
    acc[cat.value] = recentTransactionsForChart
      .filter((tx) => tx?.category === cat.value)
      .reduce((sum, tx) => sum + (parseFloat(tx?.amount) || 0), 0);
    return acc;
  }, { essentials: 0, savings: 0, selfInvestment: 0, charity: 0, emergency: 0 });

  const chartData = {
    labels: categories.map((cat) => cat.label),
    datasets: [
      {
        data: categories.map((cat) => categoryTotals[cat.value]),
        backgroundColor: categories.map((cat) => cat.color),
        hoverBackgroundColor: categories.map((cat) => cat.color + 'CC'),
        borderWidth: 2,
        borderColor: isDarkMode ? '#1F2937' : '#FFFFFF',
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: isDarkMode ? '#F3F4F6' : '#1F2937',
          font: { size: 15, family: 'Inter, sans-serif', weight: 'bold' },
          padding: 18,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${formatVND(context.raw)}`;
          },
        },
        backgroundColor: isDarkMode ? '#22223b' : '#fff',
        titleColor: isDarkMode ? '#fff' : '#22223b',
        bodyColor: isDarkMode ? '#fff' : '#22223b',
        borderColor: isDarkMode ? '#fff' : '#22223b',
        borderWidth: 1,
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    cutout: '70%',
  };

  const availableMonths = useMemo(() => {
    const months = new Set();
    transactionHistory.forEach((transaction) => {
      if (!transaction?.timestamp) return;
      const date = new Date(transaction.timestamp.split('/').reverse().join('-'));
      const monthYear = date.toLocaleString('vi-VN', { month: 'long', year: 'numeric' });
      months.add(monthYear);
    });
    return [...months].sort((a, b) => {
      const [monthA, yearA] = a.split(' ');
      const [monthB, yearB] = b.split(' ');
      const dateA = new Date(yearA, new Date(Date.parse(monthA + " 1, 2000")).getMonth());
      const dateB = new Date(yearB, new Date(Date.parse(monthB + " 1, 2000")).getMonth());
      return dateB - dateA;
    });
  }, [transactionHistory]);

  const filteredTransactions = useMemo(() => {
    return transactionHistory.filter((tx) => {
      if (!tx) return false;
      const amount = parseFloat(tx.amount || 0);
      const min = parseFloat(minAmount) || 0;
      const max = parseFloat(maxAmount) || Infinity;
      const amountMatch = amount >= min && amount <= max;
      const detailsMatch = searchDetails ? (tx.details || '').toLowerCase().includes(searchDetails.toLowerCase()) : true;
      const locationMatch = searchLocation ? (tx.location || '').toLowerCase().includes(searchLocation.toLowerCase()) : true;
      const categoryMatch = selectedCategory ? tx.category === selectedCategory : true;
      const monthMatch = selectedMonthYear
        ? new Date(tx.timestamp.split('/').reverse().join('-')).toLocaleString('vi-VN', { month: 'long', year: 'numeric' }) === selectedMonthYear
        : true;
      return amountMatch && detailsMatch && locationMatch && categoryMatch && monthMatch;
    });
  }, [transactionHistory, minAmount, maxAmount, searchDetails, searchLocation, selectedCategory, selectedMonthYear]);

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  // Đảo ngược thứ tự giao dịch để giao dịch mới nhất lên đầu
  const paginatedTransactions = filteredTransactions
    .slice()
    .reverse()
    .slice((currentPage - 1) * transactionsPerPage, currentPage * transactionsPerPage);

  // Group by month
  const paginatedGrouped = useMemo(() => {
    const grouped = {};
    paginatedTransactions.forEach((transaction) => {
      if (!transaction?.timestamp) return;
      const date = new Date(transaction.timestamp.split('/').reverse().join('-'));
      const monthYear = date.toLocaleString('vi-VN', { month: 'long', year: 'numeric' });
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(transaction);
    });
    return grouped;
  }, [paginatedTransactions]);

  const toggleMonth = (monthYear) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [monthYear]: !prev[monthYear],
    }));
  };

  const toggleSearchMenu = () => setIsSearchMenuOpen((prev) => !prev);

  const handleResetSearch = () => {
    setMinAmount('');
    setMaxAmount('');
    setSearchDetails('');
    setSearchLocation('');
    setSelectedCategory('');
    setSelectedMonthYear('');
    setCurrentPage(1);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isSearchMenuOpen && e.key === 'Escape') {
        setIsSearchMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchMenuOpen]);

  // Helper: sort transactions by timestamp descending (mới nhất lên đầu)
  const sortTransactionsByDateDesc = (transactions) => {
    return [...transactions].sort((a, b) => {
      // timestamp dạng dd/mm/yyyy
      if (!a?.timestamp || !b?.timestamp) return 0;
      const [da, ma, ya] = a.timestamp.split('/').map(Number);
      const [db, mb, yb] = b.timestamp.split('/').map(Number);
      const dateA = new Date(ya, ma - 1, da);
      const dateB = new Date(yb, mb - 1, db);
      return dateB - dateA;
    });
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-900'}`}
      ref={mainRef}
    >
      {/* Mobile Topbar */}
      <header className="sticky top-0 z-40 bg-opacity-80 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 md:py-4 max-w-4xl mx-auto">
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight flex items-center gap-2 font-quicksand">
            <svg width="28" height="28" viewBox="0 0 32 32" aria-label="dashboard" fill="none">
              <circle cx="16" cy="16" r="14" fill="#2563eb" fillOpacity="0.12"/>
              <circle cx="16" cy="16" r="14" stroke="#2563eb" strokeWidth="2"/>
              <path d="M10 20v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/>
              <rect x="13" y="14" width="6" height="6" rx="1" fill="#2563eb" fillOpacity="0.18"/>
            </svg>
            Bảng điều khiển
          </h1>
          <button
            aria-label="Chuyển chế độ sáng/tối"
            onClick={toggleDarkMode}
            className={`rounded-full p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-100 hover:bg-blue-200'}`}
          >
            {isDarkMode ? (
              <svg width="24" height="24" viewBox="0 0 24 24" aria-label="Light mode" fill="none">
                <circle cx="12" cy="12" r="5" fill="#FDE68A"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" aria-label="Dark mode" fill="none">
                <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79z" fill="#1E293B"/>
              </svg>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-2 md:px-6 py-4 md:py-8">
        {/* Notification */}
        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <svg className="animate-spin h-10 w-10 text-blue-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg shadow animate-fade-in">{error}</div>
        )}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg shadow animate-fade-in">{successMessage}</div>
        )}

        {!isLoading && (
          <>
            {/* Financial Quote */}
            <div className="mb-6 p-4 rounded-xl shadow bg-gradient-to-r from-blue-200 via-blue-100 to-blue-50 text-blue-900 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800">
              <p className="italic text-center text-base md:text-lg font-medium font-quicksand">
                <span className="font-bold text-blue-600 dark:text-blue-300">*32 Lá Thư*:</span> "Kỷ luật tài chính bắt đầu từ việc theo dõi chi tiêu hàng ngày. Hãy kiểm tra ngân sách của bạn thường xuyên!"
              </p>
            </div>

            {/* Overview Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className={`p-5 rounded-2xl shadow-lg col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col items-center justify-center bg-gradient-to-br ${isDarkMode ? 'from-gray-800 via-gray-900 to-gray-800' : 'from-blue-100 via-white to-blue-50'} transition`}>
                <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" aria-label="balance" fill="none">
                    <rect x="3" y="7" width="18" height="10" rx="4" fill="#2563eb" fillOpacity="0.10"/>
                    <rect x="3" y="7" width="18" height="10" rx="4" stroke="#2563eb" strokeWidth="2"/>
                    <path d="M7 12h10" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Tổng số dư
                </h3>
                <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-300 mb-1">{formatVND(totalAmount)}</p>
                <p className="text-sm italic text-gray-500 dark:text-gray-300">{numberToWords(totalAmount)}</p>
              </div>
              {categories.map((cat) => (
                <div
                  key={cat.value}
                  className={`p-4 rounded-2xl shadow-lg flex flex-col items-center justify-center bg-gradient-to-br ${isDarkMode ? 'from-gray-800 via-gray-900 to-gray-800' : 'from-white via-blue-50 to-blue-100'} transition`}
                >
                  <span className="mb-1">{cat.icon}</span>
                  <h3 className="text-base font-semibold text-center">{cat.label}</h3>
                  <p className="text-xl font-bold" style={{ color: cat.color }}>{formatVND(allocations[cat.value] || 0)}</p>
                </div>
              ))}
            </section>

            {/* Chart */}
            <section className="mb-8">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <svg width="22" height="22" viewBox="0 0 24 24" aria-label="chart" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#2563eb" fillOpacity="0.10"/>
                  <circle cx="12" cy="12" r="10" stroke="#2563eb" strokeWidth="2"/>
                  <path d="M12 6v6l4 2" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Phân tích chi tiêu gần đây
              </h3>
              <div className={`p-4 rounded-2xl shadow-lg bg-gradient-to-br ${isDarkMode ? 'from-gray-800 via-gray-900 to-gray-800' : 'from-white via-blue-50 to-blue-100'} transition`}>
                {recentTransactionsForChart.length > 0 ? (
                  <div className="relative" style={{ height: '260px', minHeight: '200px' }}>
                    <Doughnut data={chartData} options={chartOptions} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xs text-gray-500 dark:text-gray-300">Tổng</span>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-300">{formatVND(
                        recentTransactionsForChart.reduce((sum, tx) => sum + (parseFloat(tx.amount) || 0), 0)
                      )}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-300 text-center">Chưa có giao dịch để phân tích.</p>
                )}
              </div>
            </section>

            {/* Filters */}
            <section className="mb-6 relative">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" aria-label="filter" fill="none">
                  <rect x="4" y="4" width="16" height="16" rx="4" fill="#2563eb" fillOpacity="0.10"/>
                  <rect x="4" y="4" width="16" height="16" rx="4" stroke="#2563eb" strokeWidth="2"/>
                  <path d="M8 10h8M10 14h4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Bộ lọc giao dịch
              </h3>
              <div className="flex flex-col gap-3 md:gap-0 md:grid md:grid-cols-2 lg:grid-cols-4 mb-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Số tiền tối thiểu (VND)</label>
                  <input
                    type="number"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${isDarkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}
                    placeholder="Tối thiểu"
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Số tiền tối đa (VND)</label>
                  <input
                    type="number"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${isDarkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}
                    placeholder="Tối đa"
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Chi tiết</label>
                  <input
                    type="text"
                    value={searchDetails}
                    onChange={(e) => setSearchDetails(e.target.value)}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${isDarkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}
                    placeholder="Ví dụ: Mua thực phẩm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Vị trí</label>
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${isDarkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}
                    placeholder="Ví dụ: VinMart"
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-2 mt-2">
                <button
                  onClick={toggleSearchMenu}
                  className={`w-full md:w-auto px-4 py-2 rounded-lg text-white font-semibold ${isSearchMenuOpen ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} transition`}
                  aria-expanded={isSearchMenuOpen}
                  aria-controls="advanced-filters"
                >
                  {isSearchMenuOpen ? 'Ẩn bộ lọc nâng cao' : 'Bộ lọc nâng cao'}
                </button>
                <button
                  onClick={handleResetSearch}
                  className={`w-full md:w-auto px-4 py-2 rounded-lg text-white font-semibold ${isDarkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-500 hover:bg-gray-600'} transition`}
                >
                  Xóa bộ lọc
                </button>
              </div>
              {/* Advanced Filters */}
              {isSearchMenuOpen && (
                <>
                  {/* Overlay chỉ làm mờ nền, không làm mờ advanced filter */}
                  <div
                    className="fixed inset-0 z-30 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity duration-300"
                    onClick={() => setIsSearchMenuOpen(false)}
                    aria-label="Đóng bộ lọc nâng cao"
                  />
                  <div
                    id="advanced-filters"
                    className={`fixed left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 mt-0 rounded-xl shadow-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gradient-to-br ${isDarkMode ? 'from-gray-800 via-gray-900 to-gray-800' : 'from-white via-blue-50 to-blue-100'} animate-fade-in w-11/12 max-w-xl`}
                    onClick={e => e.stopPropagation()}
                  >
                    <div>
                      <label className="block text-xs font-medium mb-1">Danh mục</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}
                      >
                        <option value="">Tất cả danh mục</option>
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Tháng/Năm</label>
                      <select
                        value={selectedMonthYear}
                        onChange={(e) => setSelectedMonthYear(e.target.value)}
                        className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}
                      >
                        <option value="">Tất cả thời gian</option>
                        {availableMonths.map((month) => (
                          <option key={month} value={month}>{month}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      className="md:col-span-2 mt-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition"
                      onClick={() => setIsSearchMenuOpen(false)}
                      type="button"
                    >
                      Đóng bộ lọc nâng cao
                    </button>
                  </div>
                </>
              )}
            </section>

            {/* Transactions */}
            <section>
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" aria-label="transactions" fill="none">
                  <rect x="4" y="4" width="16" height="16" rx="4" fill="#2563eb" fillOpacity="0.10"/>
                  <rect x="4" y="4" width="16" height="16" rx="4" stroke="#2563eb" strokeWidth="2"/>
                  <path d="M8 10h8M10 14h4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Giao dịch gần đây
              </h3>
              {Object.keys(paginatedGrouped).length > 0 ? (
                <>
                  {Object.keys(paginatedGrouped).sort((a, b) => {
                    // Đảo ngược thứ tự tháng: tháng mới nhất lên đầu
                    const [monthA, yearA] = a.split(' ');
                    const [monthB, yearB] = b.split(' ');
                    const dateA = new Date(yearA, new Date(Date.parse(monthA + " 1, 2000")).getMonth());
                    const dateB = new Date(yearB, new Date(Date.parse(monthB + " 1, 2000")).getMonth());
                    return dateB - dateA;
                  }).map((monthYear) => (
                    <div key={monthYear} className="mb-4">
                      <button
                        onClick={() => toggleMonth(monthYear)}
                        className={`w-full flex justify-between items-center p-3 rounded-lg text-left font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-100 hover:bg-blue-200'}`}
                        aria-expanded={!!expandedMonths[monthYear]}
                        aria-controls={`transactions-${monthYear}`}
                      >
                        <span>{monthYear} <span className="font-normal text-sm text-gray-500 dark:text-gray-300">({paginatedGrouped[monthYear].length} giao dịch)</span></span>
                        <svg
                          className={`w-5 h-5 transform transition-transform duration-200 ${expandedMonths[monthYear] ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {expandedMonths[monthYear] && (
                        <div
                          id={`transactions-${monthYear}`}
                          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2 animate-fade-in"
                        >
                          {/* Hiển thị giao dịch mới nhất lên đầu, sắp xếp theo timestamp giảm dần */}
                          {sortTransactionsByDateDesc(paginatedGrouped[monthYear]).map((transaction, index) => (
                            <div
                              key={index}
                              className={`p-4 rounded-2xl shadow-lg flex flex-col gap-1 bg-gradient-to-br ${isDarkMode ? 'from-gray-800 via-gray-900 to-gray-800' : 'from-white via-blue-50 to-blue-100'} transition`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">{categories.find(cat => cat.value === transaction.category)?.icon}</span>
                                <span className="font-semibold">{categories.find(cat => cat.value === transaction.category)?.label || 'Không xác định'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 dark:text-gray-300">Số tiền:</span>
                                <span className="font-bold text-blue-600 dark:text-blue-300">{formatVND(transaction.amount)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 dark:text-gray-300">Chi tiết:</span>
                                <span>{transaction.details || <span className="italic text-gray-400">Không có</span>}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 dark:text-gray-300">Vị trí:</span>
                                <span>{transaction.location || <span className="italic text-gray-400">Không có</span>}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 dark:text-gray-300">Thời gian:</span>
                                <span>{transaction.timestamp || <span className="italic text-gray-400">Không có</span>}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {/* Pagination */}
                  <div className="flex flex-wrap justify-center gap-2 mt-6">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg font-semibold ${currentPage === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white transition`}
                    >
                      Trước
                    </button>
                    <span className="px-4 py-2 font-semibold">{`Trang ${currentPage} / ${totalPages || 1}`}</span>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages || 1))}
                      disabled={currentPage === (totalPages || 1)}
                      className={`px-4 py-2 rounded-lg font-semibold ${currentPage === (totalPages || 1) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white transition`}
                    >
                      Sau
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-4 bg-yellow-100 text-yellow-700 rounded-xl shadow text-center animate-fade-in">
                  Không tìm thấy giao dịch phù hợp với bộ lọc.
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Lên đầu trang"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
      {/* 
        Đã chuyển overlay và advanced filter thành fixed, 
        overlay không làm mờ advanced filter nữa.
      */}
    </div>
  );
}

export default Home;
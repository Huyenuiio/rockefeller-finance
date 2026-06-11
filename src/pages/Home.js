import React, { useState, useEffect, useMemo, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import AllocationHeader from '../components/Home/AllocationHeader';
import AllocationChart from '../components/Home/AllocationChart';
import TransactionFilters from '../components/Home/TransactionFilters';
import TransactionHistoryList from '../components/Home/TransactionHistoryList';
import { categories } from '../constants/categories';
import { FinanceContext } from '../contexts/FinanceContext';
import numberToWords from '../utils/numberToWords';
import '../styles/pages/Home.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const initialVisibilityState = categories.reduce((acc, category) => {
  acc[category.value] = false;
  return acc;
}, { total: false });

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
  const { isDarkMode } = useContext(FinanceContext);
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

  // State mới để quản lý ẩn/hiện cho từng phần tử
  const [visibility, setVisibility] = useState(initialVisibilityState);

  const transactionsPerPage = 6;
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const mainRef = useRef(null);

  // Hàm bật/tắt cho một phần tử cụ thể dựa vào key
  const toggleVisibility = (key) => {
    setVisibility(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Hàm bật/tắt tất cả (cho nút con mắt)
  const toggleAllVisibility = () => {
    // Nếu có ít nhất một mục đang ẩn, thì hiện tất cả. Ngược lại, ẩn tất cả.
    const shouldShowAll = Object.values(visibility).some(v => v === false);
    const newState = Object.keys(visibility).reduce((acc, key) => {
      acc[key] = shouldShowAll;
      return acc;
    }, {});
    setVisibility(newState);
  };

  // Biến để quyết định icon con mắt nào sẽ hiển thị
  const isAnyAmountVisible = Object.values(visibility).some(v => v === true);

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
          axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/allocations`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/expenses`, {
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

  const paginatedTransactions = filteredTransactions
    .slice()
    .reverse()
    .slice((currentPage - 1) * transactionsPerPage, currentPage * transactionsPerPage);

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

  const sortTransactionsByDateDesc = (transactions) => {
    return [...transactions].sort((a, b) => {
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
      className="min-h-screen transition-colors duration-300 bg-[var(--bg-primary)] text-[var(--text-primary)]"
      ref={mainRef}
    >
      <header className="sticky top-0 z-40 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] bg-opacity-95 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-4 max-w-7xl mx-auto">
          <h1 className="text-lg md:text-xl font-display font-bold tracking-wider text-[var(--accent-gold)] flex items-center gap-3">
            <div className="w-8 h-8 border border-[var(--accent-gold)] flex items-center justify-center bg-black">
              <span className="font-display font-bold text-[var(--accent-gold)] text-sm">R</span>
            </div>
            BẢNG ĐIỀU KHIỂN
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <svg className="animate-spin h-10 w-10 text-[var(--accent-gold)]" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 border border-red-500/30 bg-red-500/5 text-red-500 font-sans text-sm">{error}</div>
        )}
        {successMessage && (
          <div className="mb-4 p-4 border border-green-500/30 bg-green-500/5 text-green-500 font-sans text-sm">{successMessage}</div>
        )}

        {!isLoading && (
          <>
            <div className="mb-8 p-4 border border-[var(--border-color)] bg-[rgba(var(--accent-gold-rgb),0.02)]">
              <p className="italic text-center text-sm text-[var(--text-secondary)] font-sans">
                <span className="font-bold font-display text-[var(--accent-gold)] tracking-wider">38 LÁ THƯ:</span> "Kỷ luật tài chính bắt đầu từ việc theo dõi chi tiêu hàng ngày. Hãy kiểm tra ngân sách của bạn thường xuyên!"
              </p>
            </div>

            <AllocationHeader
              categories={categories}
              totalAmount={totalAmount}
              allocations={allocations}
              visibility={visibility}
              toggleVisibility={toggleVisibility}
              toggleAllVisibility={toggleAllVisibility}
              isAnyAmountVisible={isAnyAmountVisible}
              formatVND={formatVND}
              numberToWords={numberToWords}
              isDarkMode={isDarkMode}
            />

            <AllocationChart
              chartData={chartData}
              chartOptions={chartOptions}
              recentTransactionsForChart={recentTransactionsForChart}
              formatVND={formatVND}
              isDarkMode={isDarkMode}
            />

            <TransactionFilters
              minAmount={minAmount} setMinAmount={setMinAmount}
              maxAmount={maxAmount} setMaxAmount={setMaxAmount}
              searchDetails={searchDetails} setSearchDetails={setSearchDetails}
              searchLocation={searchLocation} setSearchLocation={setSearchLocation}
              selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
              selectedMonthYear={selectedMonthYear} setSelectedMonthYear={setSelectedMonthYear}
              isSearchMenuOpen={isSearchMenuOpen} setIsSearchMenuOpen={setIsSearchMenuOpen}
              categories={categories}
              availableMonths={availableMonths}
              handleResetSearch={handleResetSearch}
              toggleSearchMenu={toggleSearchMenu}
              isDarkMode={isDarkMode}
            />

            <TransactionHistoryList
              paginatedGrouped={paginatedGrouped}
              expandedMonths={expandedMonths}
              toggleMonth={toggleMonth}
              sortTransactionsByDateDesc={sortTransactionsByDateDesc}
              categories={categories}
              formatVND={formatVND}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              isDarkMode={isDarkMode}
            />
          </>
        )}
      </main>

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 p-3 bg-[var(--accent-gold)] text-black border border-black shadow-lg hover:bg-[var(--accent-gold-hover)] transition focus:outline-none rounded-none"
          aria-label="Lên đầu trang"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7-7" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default Home;
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TrendingDown } from 'lucide-react';
import ExpenseForm from '../components/Expenses/ExpenseForm';
import ExpenseHistory from '../components/Expenses/ExpenseHistory';
import AllocationCards from '../components/Expenses/AllocationCards';
import ExpenseDashboardHeader from '../components/Expenses/ExpenseDashboardHeader';
import SpendingChart from '../components/Expenses/SpendingChart';
import DepositModal from '../components/Expenses/DepositModal';
import { FinanceContext } from '../contexts/FinanceContext';
import { categories } from '../constants/categories';
import { numberToWords } from '../constants/investments';

const initialVisibilityState = categories.reduce((acc, category) => {
  acc[category.value] = false;
  return acc;
}, { budgetBalance: false, totalAllocations: false });

function Expenses() {
  const navigate = useNavigate();
  // ... (keep state)
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
  const { isDarkMode } = useContext(FinanceContext);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [showAllExpenses, setShowAllExpenses] = useState(false);
  const [visibility, setVisibility] = useState(initialVisibilityState);
  const token = localStorage.getItem('token');
  const snackbarTimeout = useRef(null);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  const handleDepositClick = () => {
    setIsDepositModalOpen(true);
  };

  const toggleVisibility = (key) => {
    setVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isAnyAmountVisible = Object.values(visibility).some(v => v === true);

  const toggleAllVisibility = () => {
    const shouldShowAll = !isAnyAmountVisible;
    const newState = Object.keys(visibility).reduce((acc, key) => {
      acc[key] = shouldShowAll;
      return acc;
    }, {});
    setVisibility(newState);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.background = '#111827';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.background = '#F3F4F6';
    }
  }, [isDarkMode]);

  const showNotification = (message) => {
    setSnackbarMsg(message);
    setShowSnackbar(true);
    if (snackbarTimeout.current) clearTimeout(snackbarTimeout.current);
    snackbarTimeout.current = setTimeout(() => setShowSnackbar(false), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [budgetRes, expensesRes, allocationsRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/initial-budget`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/expenses`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/allocations`, {
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
  }, [token]);

  const formatVND = (value) => {
    const num = parseFloat(value) || 0;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

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
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/initial-budget`,
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
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/expenses`,
        {
          amount: parsedAmount,
          category,
          purpose,
          location,
          date: date || new Date().toISOString(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExpenses(response.data);
      const [budgetRes, allocRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/initial-budget`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/allocations`, {
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

  const handleDeleteExpense = async (index) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/expenses/${index}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExpenses(response.data);
      const [budgetRes, allocRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/initial-budget`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/allocations`, {
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


  const totalAmount =
    parseFloat(allocations.essentials || 0) +
    parseFloat(allocations.savings || 0) +
    parseFloat(allocations.selfInvestment || 0) +
    parseFloat(allocations.charity || 0) +
    parseFloat(allocations.emergency || 0);

  const totalExpensesSpent = expenses.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
  const sortedExpenses = [...expenses].reverse();
  const COLLAPSED_COUNT = 5;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 overflow-x-hidden ${isDarkMode
        ? 'bg-slate-950 text-white'
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
          ${showSnackbar ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
          ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
        `}
        role="status"
        aria-live="polite"
        style={{ maxWidth: '95vw', width: 'max-content', minWidth: 180, boxSizing: 'border-box' }}
      >
        {snackbarMsg}
      </div>

      {/* Topbar */}
      <header
        className="z-40 bg-opacity-95"
      >
        <div className="flex items-center justify-between px-3 py-4 md:py-6 max-w-7xl mx-auto">
          <h1 className="font-extrabold tracking-tight flex items-center gap-2 app-title" style={{ fontSize: '1.35rem', fontWeight: 900 }}>
            <svg width="28" height="28" viewBox="0 0 32 32" aria-label="expenses" fill="none">
              <circle cx="16" cy="16" r="14" fill="#22c55e" fillOpacity="0.12" />
              <circle cx="16" cy="16" r="14" stroke="#22c55e" strokeWidth="2" />
              <path d="M10 20v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
              <rect x="13" y="14" width="6" height="6" rx="1" fill="#22c55e" fillOpacity="0.18" />
            </svg>
            <span className="title-text">Quản lý chi tiêu</span>
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {initialBudget === null || initialBudget === 0 ? (
          <section className="max-w-md mx-auto">
            <div className={`p-8 rounded-3xl shadow-2xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-100'}`}>
              <h2 className="text-2xl font-black mb-6 text-center">Thiết lập ngân sách</h2>
              <form onSubmit={handleBudgetSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2 opacity-70" htmlFor="initialBudget">Ngân sách khởi tạo (VND)</label>
                  <input id="initialBudget" type="number" value={newBudget} onChange={(e) => setNewBudget(e.target.value)} className={`input-modern ${isDarkMode ? 'dark' : ''}`} placeholder="Ví dụ: 10,000,000" required min="1" inputMode="numeric" />
                </div>
                <button type="submit" disabled={isSubmitting} className="btn-modern w-full py-4 text-lg">
                  {isSubmitting ? "Đang xử lý..." : "Bắt đầu quản lý"}
                </button>
              </form>
            </div>
          </section>
        ) : (
          <div className="flex flex-col gap-8">
            {/* Hero Section */}
            <ExpenseDashboardHeader
              initialBudget={initialBudget}
              totalExpenses={totalExpensesSpent}
              visibility={visibility}
              toggleVisibility={toggleVisibility}
              formatVND={formatVND}
              isDarkMode={isDarkMode}
              onDeposit={handleDepositClick}
            />

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left Column: Visuals & History */}
              <div className="lg:col-span-2 flex flex-col gap-8">
                <SpendingChart
                  categories={categories}
                  allocations={allocations}
                  isDarkMode={isDarkMode}
                  formatVND={formatVND}
                />

                <section>
                  <div className="flex items-center justify-between mb-6 px-2">
                    <h2 className="text-2xl font-black">Hoạt động gần đây</h2>
                    <button
                      onClick={() => navigate('/transactions')}
                      className={`group flex items-center gap-1 text-sm font-bold transition-all ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'}`}
                    >
                      Xem tất cả
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                  <div className={`rounded-3xl shadow-xl border overflow-hidden ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-blue-100'}`}>
                    <ExpenseHistory
                      sortedExpenses={sortedExpenses.slice(0, 5)}
                      showAllExpenses={false}
                      setShowAllExpenses={() => navigate('/transactions')}
                      handleDeleteExpense={handleDeleteExpense}
                      expenses={expenses}
                      formatVND={formatVND}
                      isDarkMode={isDarkMode}
                      COLLAPSED_COUNT={5}
                    />
                  </div>
                </section>
              </div>

              {/* Right Column: Actions & Allocations */}
              <div className="flex flex-col gap-8">
                <div className={`p-1 rounded-[2rem] shadow-2xl ${isDarkMode ? 'bg-gradient-to-b from-gray-700 to-gray-800' : 'bg-gradient-to-b from-blue-100 to-white'}`}>
                  <ExpenseForm
                    handleExpenseSubmit={handleExpenseSubmit}
                    amount={amount} setAmount={setAmount}
                    category={category} setCategory={setCategory}
                    purpose={purpose} setPurpose={setPurpose}
                    location={location} setLocation={setLocation}
                    date={date} setDate={setDate}
                    isSubmitting={isSubmitting}
                    categories={categories}
                    allocations={allocations}
                    formatVND={formatVND}
                    numberToWords={numberToWords}
                    isDarkMode={isDarkMode}
                  />
                </div>

                <AllocationCards
                  categories={categories}
                  visibility={visibility}
                  toggleVisibility={toggleVisibility}
                  allocations={allocations}
                  formatVND={formatVND}
                  isDarkMode={isDarkMode}
                />

                {totalAmount > 0 && (
                  <div
                    className={`p-6 rounded-3xl shadow-xl cursor-pointer border transition-all duration-300 transform hover:scale-[1.02] ${isDarkMode ? 'bg-gray-800/80 border-gray-700 hover:bg-gray-800' : 'bg-white border-blue-100 hover:bg-gray-50'}`}
                    onClick={() => toggleVisibility('totalAllocations')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold opacity-60 uppercase tracking-widest">Tổng chi tiêu</h3>
                      <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500"><TrendingDown size={20} /></div>
                    </div>
                    <p className="text-3xl font-black text-blue-600 dark:text-blue-300">
                      {visibility.totalAllocations ? formatVND(totalAmount) : '••••••••'}
                    </p>
                    <p className="text-xs italic opacity-50 mt-1 font-medium">
                      {visibility.totalAllocations ? numberToWords(totalAmount) : 'Nhấn để xem'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Premium Deposit Modal */}
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        newBudget={newBudget}
        setNewBudget={setNewBudget}
        handleBudgetSubmit={handleBudgetSubmit}
        isSubmitting={isSubmitting}
        isDarkMode={isDarkMode}
        formatVND={formatVND}
        numberToWords={numberToWords}
      />

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



          border - color: #3b82f6;



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



          main, .glass - card {max - width: 100vw !important; }



        }



        @media (max-width: 640px) {



          .glass - card {padding: 1rem !important; }



        .input-modern, .btn-modern {font - size: 1.01rem; padding: 0.7rem 1rem; }



        .text-2xl, .text-3xl {font - size: 1.45rem !important; }



        .text-lg, .text-xl {font - size: 1.18rem !important; }



        .rounded-2xl {border - radius: 1.1rem !important; }



        .rounded-xl {border - radius: 0.8rem !important; }



        .p-4 {padding: 1rem !important; }



        .p-6 {padding: 1.2rem !important; }



        .mb-8 {margin - bottom: 1.3rem !important; }



        .mb-6 {margin - bottom: 1.1rem !important; }



        .max-w-3xl {max - width: 100vw !important; }



        .overflow-x-auto {-webkit - overflow - scrolling: touch; }



        .glass-card, .input-modern, .btn-modern {



          box - shadow: 0 2px 8px 0 rgba(59,130,246,0.10) !important;



          }



        /* Title nét căng */



        .app-title {



          font - size: 1.25rem !important;



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



          font - size: 1.18rem !important;



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



          font - size: 1.08rem !important;



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



          .glass - card {padding: 0.7rem !important; }



        .input-modern, .btn-modern {font - size: 0.98rem; padding: 0.6rem 0.8rem; }



        .app-title {font - size: 1.08rem !important; }



        .app-title .title-text {font - size: 1.01rem !important; }



        }



        .animate-shake {



          animation: shake 0.3s;



        }



        @keyframes shake {



          0 % { transform: translateX(0); }



          20% {transform: translateX(-4px); }



        40% {transform: translateX(4px); }



        60% {transform: translateX(-2px); }



        80% {transform: translateX(2px); }



        100% {transform: translateX(0); }



        }



        /* Prevent horizontal scroll on mobile */



        html, body {



          max - width: 100vw;



        overflow-x: hidden;



        }



        /* Make everything crisp on mobile */



        @media (max-width: 640px) {



          body, .glass - card, .input - modern, .btn - modern, .rounded - xl, .rounded - 2xl, .shadow-xl, .shadow, .shadow-md {



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



      `}</style >
    </div >
  );
}

export default Expenses;
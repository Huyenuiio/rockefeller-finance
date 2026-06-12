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
import { API_URL } from '../config';

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
  const { isDarkMode } = useContext(FinanceContext);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [visibility, setVisibility] = useState(initialVisibilityState);
  const token = localStorage.getItem('token');
  const snackbarTimeout = useRef(null);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  const handleDepositClick = () => {
    setNewBudget('');
    setIsDepositModalOpen(true);
  };

  const toggleVisibility = (key) => {
    setVisibility(prev => ({ ...prev, [key]: !prev[key] }));
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
          axios.get(`${API_URL}/api/initial-budget`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/api/expenses`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/api/allocations`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setInitialBudget(budgetRes.data.initialBudget);
        setExpenses(expensesRes.data);
        setAllocations(allocationsRes.data);
      } catch (err) {
        showNotification(err.response?.data?.error || 'Lỗi lấy dữ liệu');
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
        `${API_URL}/api/initial-budget`,
        { initialBudget: parsedBudget },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInitialBudget(response.data.initialBudget);
      setAllocations(response.data.allocations);
      showNotification('Ngân sách đã được cập nhật!');
      setIsDepositModalOpen(false);
      setNewBudget('');
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
        `${API_URL}/api/expenses`,
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
        axios.get(`${API_URL}/api/initial-budget`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/api/allocations`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setInitialBudget(budgetRes.data.initialBudget);
      setAllocations(allocRes.data);
      setAmount('');
      setCategory('');
      setPurpose('');
      setLocation('');
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
        `${API_URL}/api/expenses/${index}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExpenses(response.data);
      const [budgetRes, allocRes] = await Promise.all([
        axios.get(`${API_URL}/api/initial-budget`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/api/allocations`, {
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

  const sortedExpenses = [...expenses].reverse();

  return (
    <div className="min-h-screen transition-colors duration-300 bg-[var(--bg-primary)] text-[var(--text-primary)]" style={{ minHeight: '100vh', WebkitOverflowScrolling: 'touch', overscrollBehavior: 'none' }}>
      <div className={`fixed z-50 left-1/2 -translate-x-1/2 bottom-6 px-5 py-3 border border-[var(--border-color)] bg-black text-white text-xs font-display tracking-wider uppercase transition-all duration-300 ${showSnackbar ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`} role="status" aria-live="polite" style={{ maxWidth: '95vw', width: 'max-content', minWidth: 180 }}>
        {snackbarMsg}
      </div>
      <header className="sticky top-0 z-40 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] bg-opacity-95 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-4 max-w-7xl mx-auto">
          <h1 className="text-lg md:text-xl font-display font-bold tracking-wider text-[var(--accent-gold)] flex items-center gap-3">
            <div className="w-8 h-8 border border-[var(--accent-gold)] flex items-center justify-center bg-black">
              <span className="font-display font-bold text-[var(--accent-gold)] text-sm">R</span>
            </div>
            QUẢN LÝ CHI TIÊU
          </h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {initialBudget === null || initialBudget === 0 ? (
          <section className="max-w-md mx-auto">
            <div className="p-8 border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-2xl relative">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-[var(--accent-gold)]" />
              <h2 className="text-xl font-display font-bold mb-6 text-center text-[var(--accent-gold)] uppercase tracking-wider">Thiết lập ngân sách</h2>
              <form onSubmit={handleBudgetSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-display font-bold tracking-wider uppercase text-[var(--text-secondary)] mb-2" htmlFor="initialBudget">Ngân sách khởi tạo (VND)</label>
                  <input
                    id="initialBudget"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={newBudget}
                    onChange={(e) => {
                      const cleanVal = e.target.value.replace(/\D/g, '');
                      setNewBudget(cleanVal);
                    }}
                    className="rockefeller-input font-mono"
                    placeholder="Ví dụ: 10,000,000"
                    required
                  />
                  {newBudget && (
                    <div className="mt-2.5 p-3.5 border border-[var(--border-color)] bg-[rgba(var(--accent-gold-rgb),0.02)] transition-all">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)]">Số tiền xác nhận</span>
                        <span className="text-sm font-mono font-bold text-[var(--accent-gold)]">{formatVND(newBudget)}</span>
                      </div>
                      <p className="text-[10px] font-display uppercase tracking-wider text-[var(--text-muted)] mt-1.5 leading-relaxed font-medium">
                        {numberToWords(newBudget)}
                      </p>
                    </div>
                  )}
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full btn-gold-primary py-3 text-xs uppercase tracking-widest font-bold">
                  {isSubmitting ? "Đang xử lý..." : "Khởi tạo tài khoản"}
                </button>
              </form>
            </div>
          </section>
        ) : (
          <div className="flex flex-col gap-8">
            <ExpenseDashboardHeader initialBudget={initialBudget} totalExpenses={expenses.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0)} visibility={visibility} toggleVisibility={toggleVisibility} formatVND={formatVND} isDarkMode={isDarkMode} onDeposit={handleDepositClick} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 flex flex-col gap-8">
                <SpendingChart categories={categories} allocations={allocations} isDarkMode={isDarkMode} formatVND={formatVND} />
                <section>
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h2 className="text-xs font-display font-bold tracking-widest text-[var(--accent-gold)] uppercase flex items-center gap-2">HOẠT ĐỘNG GẦN ĐÂY</h2>
                    <button onClick={() => navigate('/transactions')} className="text-xs font-display font-bold tracking-wider uppercase text-[var(--accent-gold)] hover:text-[var(--accent-gold-hover)] flex items-center gap-1">Xem tất cả</button>
                  </div>
                  <div className="border border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden">
                    <ExpenseHistory sortedExpenses={sortedExpenses.slice(0, 5)} showAllExpenses={false} setShowAllExpenses={() => navigate('/transactions')} handleDeleteExpense={handleDeleteExpense} expenses={expenses} formatVND={formatVND} isDarkMode={isDarkMode} COLLAPSED_COUNT={5} />
                  </div>
                </section>
              </div>
              <div className="flex flex-col gap-6">
                <div className="border border-[var(--border-color)] bg-[var(--bg-secondary)] p-6 relative">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-[var(--accent-gold)]" />
                  <ExpenseForm handleExpenseSubmit={handleExpenseSubmit} amount={amount} setAmount={setAmount} category={category} setCategory={setCategory} purpose={purpose} setPurpose={setPurpose} location={location} setLocation={setLocation} date={date} setDate={setDate} isSubmitting={isSubmitting} categories={categories} allocations={allocations} formatVND={formatVND} numberToWords={numberToWords} isDarkMode={isDarkMode} />
                </div>
                <AllocationCards categories={categories} visibility={visibility} toggleVisibility={toggleVisibility} allocations={allocations} formatVND={formatVND} isDarkMode={isDarkMode} />
                {totalAmount > 0 && (
                  <div className="p-5 border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-[var(--accent-gold)] transition duration-200 cursor-pointer select-none" onClick={() => toggleVisibility('totalAllocations')}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-[10px] font-display font-bold tracking-wider uppercase text-[var(--text-muted)]">TỔNG CHI TIÊU HẠN MỨC</h3>
                      <div className="p-1.5 border border-[var(--border-color)] text-[var(--accent-gold)]"><TrendingDown size={16} /></div>
                    </div>
                    <p className="text-2xl font-mono font-bold text-[var(--text-primary)]">{visibility.totalAllocations ? formatVND(totalAmount) : '••••••••'}</p>
                    <p className="text-[10px] uppercase tracking-wider font-display text-[var(--text-muted)] mt-1 font-medium">{visibility.totalAllocations ? numberToWords(totalAmount) : 'Nhấp để xem bằng chữ'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
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
    </div>
  );
}

export default Expenses;
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AccountActions from '../components/Settings/AccountActions';
import ConfirmModal from '../components/Settings/ConfirmModal';
import { FinanceContext } from '../contexts/FinanceContext';

// Utility for haptic feedback (mobile UX)
const haptic = () => {
  if (window.navigator.vibrate) window.navigator.vibrate(30);
};

function Settings() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { isDarkMode, toggleDarkMode } = useContext(FinanceContext);
  const [showConfirm, setShowConfirm] = useState({ type: null, open: false });
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Modern theme toggle with system preference
  // Modern theme toggle with system preference
  const handleToggleTheme = () => {
    toggleDarkMode();
    haptic();
  };

  // Confirm dialog logic
  const openConfirm = (type) => {
    setShowConfirm({ type, open: true });
    haptic();
  };
  const closeConfirm = () => setShowConfirm({ type: null, open: false });

  // Modern async handler with animation
  const handleAction = async (type) => {
    setIsSubmitting(true);
    setError('');
    try {
      if (type === 'deleteAccount') {
        await axios.delete(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/account`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.removeItem('token');
        navigate('/login');
      } else if (type === 'resetBudget') {
        await axios.delete(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/budget`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        navigate('/expenses');
      }
      closeConfirm();
    } catch (err) {
      setError(err.response?.data?.error || 'Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${isDarkMode
        ? 'bg-slate-950 text-white'
        : 'bg-gradient-to-br from-blue-50 via-white to-green-50 text-gray-900'
        }`}
      style={{
        fontFamily: "'Inter', 'Roboto', 'San Francisco', 'Segoe UI', Arial, sans-serif",
        backgroundAttachment: 'fixed',
      }}
    >
      <main className="flex flex-col items-center justify-center px-2 py-8 min-h-screen">
        <section
          className="w-full max-w-7xl glass-card-modern rounded-3xl shadow-2xl p-6 sm:p-10 animate-fade-in"
          style={{
            ...(typeof window !== 'undefined' && window.innerWidth > 640
              ? { backdropFilter: 'blur(24px) saturate(180%)' }
              : {}),
            background: isDarkMode ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255,255,255,0.85)',
            boxShadow: isDarkMode ? '0 8px 32px 0 rgba(0, 0, 0, 0.4)' : '0 8px 32px 0 rgba(31, 38, 135, 0.18), 0 1.5px 6px 0 rgba(0,0,0,0.04)',
            border: isDarkMode ? '1.5px solid rgba(255,255,255,0.05)' : '1.5px solid rgba(0,0,0,0.06)',
          }}
        >
          <header className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <span className="inline-block animate-gradient-x bg-gradient-to-r from-blue-500 via-green-400 to-purple-500 bg-clip-text text-transparent">
                Cài đặt
              </span>
              <span className="ml-1 text-lg">⚙️</span>
            </h2>
            <button
              onClick={handleToggleTheme}
              className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl font-semibold shadow-lg transition-all duration-300 ${isDarkMode ? 'bg-gray-800 text-blue-200' : 'bg-gradient-to-r from-blue-400 to-green-400 text-white'
                }`}
            >
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </header>

          {error && (
            <div className="mb-4 animate-shake bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          <AccountActions
            handleAction={handleAction}
            isSubmitting={isSubmitting}
            showConfirm={showConfirm}
            openConfirm={openConfirm}
          />
        </section>
      </main>

      <ConfirmModal
        showConfirm={showConfirm}
        isDarkMode={isDarkMode}
        isSubmitting={isSubmitting}
        closeConfirm={closeConfirm}
        handleAction={handleAction}
      />

      <style>{`
        .glass-card-modern { border-radius: 2rem; }
        .animate-fade-in { animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1); }
        .animate-pop-in { animation: popIn 0.35s cubic-bezier(.4,0,.2,1); }
        .animate-shake { animation: shake 0.4s both; }
        .animate-gradient-x { background-size: 200% 200%; animation: gradientX 2.5s linear infinite; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
        @keyframes popIn { 0% { opacity: 0; transform: scale(0.85); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes shake { 10%, 90% { transform: translateX(-1px); } 20%, 80% { transform: translateX(2px); } 30%, 50%, 70% { transform: translateX(-4px); } 40%, 60% { transform: translateX(4px); } }
        @keyframes gradientX { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
      `}</style>
    </div>
  );
}

export default Settings;
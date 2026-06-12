import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AccountActions from '../components/Settings/AccountActions';
import ConfirmModal from '../components/Settings/ConfirmModal';
import { FinanceContext } from '../contexts/FinanceContext';
import { API_URL } from '../config';

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

  const handleToggleTheme = () => {
    toggleDarkMode();
    haptic();
  };

  const openConfirm = (type) => {
    setShowConfirm({ type, open: true });
    haptic();
  };
  const closeConfirm = () => setShowConfirm({ type: null, open: false });

  const handleAction = async (type) => {
    setIsSubmitting(true);
    setError('');
    try {
      if (type === 'deleteAccount') {
        await axios.delete(`${API_URL}/api/account`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.removeItem('token');
        navigate('/login');
      } else if (type === 'resetBudget') {
        await axios.delete(`${API_URL}/api/budget`, {
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
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      {/* Topbar */}
      <header className="sticky top-0 z-40 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] bg-opacity-95 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-4 max-w-7xl mx-auto">
          <h1 className="text-lg md:text-xl font-display font-bold tracking-wider text-[var(--accent-gold)] flex items-center gap-3">
            <div className="w-8 h-8 border border-[var(--accent-gold)] flex items-center justify-center bg-black">
              <span className="font-display font-bold text-[var(--accent-gold)] text-sm">R</span>
            </div>
            THIẾT LẬP HỆ THỐNG
          </h1>
          <button
            onClick={handleToggleTheme}
            className="btn-gold-outline px-4 py-2 text-xs font-display font-bold uppercase tracking-widest"
          >
            {isDarkMode ? 'Giao diện sáng' : 'Giao diện tối'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <section className="p-6 sm:p-8 border border-[var(--border-color)] bg-[var(--bg-secondary)] relative">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-[var(--accent-gold)]" />

          {error && (
            <div className="mb-6 border border-red-500/30 bg-red-500/5 text-red-500 px-4 py-3 text-xs font-display uppercase tracking-wider">
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
    </div>
  );
}

export default Settings;
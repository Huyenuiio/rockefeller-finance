import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Utility for haptic feedback (mobile UX)
const haptic = () => {
  if (window.navigator.vibrate) window.navigator.vibrate(30);
};

function Settings() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem('theme') === 'dark'
  );
  const [showConfirm, setShowConfirm] = useState({ type: null, open: false });
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Modern theme toggle with system preference
  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
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
        await axios.delete('https://backend-rockefeller-finance.onrender.com/api/account', {
          headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.removeItem('token');
        navigate('/login');
      } else if (type === 'resetBudget') {
        await axios.delete('https://backend-rockefeller-finance.onrender.com/api/budget', {
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

  // Responsive, glassmorphic, animated, ultra-modern UI
  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white'
          : 'bg-gradient-to-br from-blue-50 via-white to-green-50 text-gray-900'
      }`}
      style={{
        fontFamily:
          "'Inter', 'Roboto', 'San Francisco', 'Segoe UI', Arial, sans-serif",
        backgroundAttachment: 'fixed',
      }}
    >
      <main className="flex flex-col items-center justify-center px-2 py-8 min-h-screen">
        <section
          className="w-full max-w-lg glass-card-modern rounded-3xl shadow-2xl p-6 sm:p-10 animate-fade-in"
          style={{
            // Chỉ làm mờ trên desktop/tablet, không làm mờ trên mobile
            ...(typeof window !== 'undefined' && window.innerWidth > 640
              ? { backdropFilter: 'blur(24px) saturate(180%)' }
              : {}),
            background:
              isDarkMode
                ? 'rgba(24, 24, 32, 0.85)'
                : 'rgba(255,255,255,0.85)',
            boxShadow:
              '0 8px 32px 0 rgba(31, 38, 135, 0.18), 0 1.5px 6px 0 rgba(0,0,0,0.04)',
            border: isDarkMode
              ? '1.5px solid rgba(255,255,255,0.08)'
              : '1.5px solid rgba(0,0,0,0.06)',
          }}
        >
          <header className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <span
                className="inline-block animate-gradient-x bg-gradient-to-r from-blue-500 via-green-400 to-purple-500 bg-clip-text text-transparent"
                style={{ letterSpacing: '0.01em' }}
              >
                Cài đặt
              </span>
              <span className="ml-1 text-lg" aria-label="⚙️" role="img">
                ⚙️
              </span>
            </h2>
            <button
              onClick={toggleDarkMode}
              className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl font-semibold shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-blue-200 hover:from-gray-700 hover:to-gray-600'
                  : 'bg-gradient-to-r from-blue-400 to-green-400 text-white hover:from-blue-500 hover:to-green-500'
              }`}
              aria-label="Chuyển chế độ sáng/tối"
            >
              <span className="sr-only">Chuyển chế độ sáng/tối</span>
              {isDarkMode ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                  </svg>
                  <span className="hidden sm:inline">Light Mode</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71" />
                  </svg>
                  <span className="hidden sm:inline">Dark Mode</span>
                </>
              )}
              <span
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-green-400 group-hover:w-3/4 transition-all duration-300"
                aria-hidden="true"
              />
            </button>
          </header>

          {error && (
            <div className="mb-4 animate-shake">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm ${
                  isDarkMode
                    ? 'bg-red-900 text-red-200'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          <section className="mb-2">
            <h3 className="text-xl font-bold mb-3 tracking-tight">Quản lý tài khoản</h3>
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => openConfirm('resetBudget')}
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-semibold text-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400
                    ${
                      isSubmitting
                        ? 'bg-gradient-to-r from-gray-400 to-gray-300 text-gray-200 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white hover:from-orange-500 hover:to-yellow-500 active:scale-98'
                    }
                  `}
                  aria-label="Xóa toàn bộ số tiền"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-7 0h10" />
                  </svg>
                  {isSubmitting && showConfirm.type === 'resetBudget' ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Đang xử lý...
                    </span>
                  ) : (
                    'Xóa toàn bộ số tiền'
                  )}
                </button>
              </li>
              <li>
                <button
                  onClick={() => openConfirm('deleteAccount')}
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-semibold text-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400
                    ${
                      isSubmitting
                        ? 'bg-gradient-to-r from-gray-400 to-gray-300 text-gray-200 cursor-not-allowed'
                        : 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 active:scale-98'
                    }
                  `}
                  aria-label="Xóa tài khoản"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  {isSubmitting && showConfirm.type === 'deleteAccount' ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Đang xử lý...
                    </span>
                  ) : (
                    'Xóa tài khoản'
                  )}
                </button>
              </li>
            </ul>
          </section>
        </section>
      </main>

      {/* Confirm Modal */}
      {showConfirm.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
          aria-modal="true"
          role="dialog"
        >
          <div
            className={`w-[95vw] max-w-sm rounded-2xl p-6 shadow-2xl glass-card-modern border
              ${isDarkMode ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200'}
              animate-pop-in
            `}
          >
            <h4 className="text-xl font-bold mb-2 text-center">
              {showConfirm.type === 'deleteAccount'
                ? 'Xác nhận xóa tài khoản'
                : 'Xác nhận xóa toàn bộ số tiền'}
            </h4>
            <p className="mb-6 text-center text-base">
              {showConfirm.type === 'deleteAccount'
                ? 'Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác!'
                : 'Bạn có chắc chắn muốn xóa toàn bộ số tiền? Dữ liệu ngân sách sẽ về 0!'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={closeConfirm}
                className="flex-1 px-4 py-2 rounded-xl font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button
                onClick={() => handleAction(showConfirm.type)}
                className={`flex-1 px-4 py-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2
                  ${
                    showConfirm.type === 'deleteAccount'
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 focus:ring-red-400'
                      : 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white hover:from-orange-500 hover:to-yellow-500 focus:ring-orange-400'
                  }
                  ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}
                `}
                disabled={isSubmitting}
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
                  showConfirm.type === 'deleteAccount' ? 'Xóa tài khoản' : 'Xóa toàn bộ số tiền'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations & Modern CSS */}
      <style>{`
        .glass-card-modern {
          box-shadow: 0 8px 32px 0 rgba(31,38,135,0.18), 0 1.5px 6px 0 rgba(0,0,0,0.04);
          border-radius: 2rem;
        }
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1);
        }
        .animate-pop-in {
          animation: popIn 0.35s cubic-bezier(.4,0,.2,1);
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradientX 2.5s linear infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px);}
          to { opacity: 1; transform: none;}
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.85);}
          100% { opacity: 1; transform: scale(1);}
        }
        @keyframes shake {
          10%, 90% { transform: translateX(-1px);}
          20%, 80% { transform: translateX(2px);}
          30%, 50%, 70% { transform: translateX(-4px);}
          40%, 60% { transform: translateX(4px);}
        }
        @keyframes gradientX {
          0% { background-position: 0% 50%;}
          100% { background-position: 100% 50%;}
        }
        @media (max-width: 640px) {
          .glass-card-modern { padding: 1.25rem !important; }
          h2, h3, h4 { font-size: 1.15rem !important; }
        }
      `}</style>
    </div>
  );
}

export default Settings;
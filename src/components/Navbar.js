import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/home', label: 'Trang chủ', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6" />
    </svg>
  ) },
  { to: '/expenses', label: 'Chi tiêu', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0V4m0 16v-4m8-4h-4m-8 0H4" />
    </svg>
  ) },
  { to: '/investments', label: 'Đầu tư', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 7h7v7" />
    </svg>
  ) },
  { to: '/settings', label: 'Cài đặt', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7zm7.94-2.06a1 1 0 0 0 .26-1.09l-1.1-3.18a1 1 0 0 0-.76-.65l-3.37-.49a1 1 0 0 0-.95.26l-2.38 2.38a1 1 0 0 0-.26.95l.49 3.37a1 1 0 0 0 .65.76l3.18 1.1a1 1 0 0 0 1.09-.26l2.38-2.38z" />
    </svg>
  ) },
];

function Navbar({ isDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav
      className={`hidden md:block px-8 py-3 shadow-xl rounded-b-3xl border-b-2 border-opacity-10
        ${isDarkMode
          ? 'bg-gradient-to-r from-gray-950 via-gray-900 to-gray-800 border-gray-700'
          : 'bg-gradient-to-r from-blue-50 via-white to-blue-100 border-blue-200'
        }
        backdrop-blur-lg transition-all duration-500`}
      aria-label="Main navigation"
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo & Brand */}
        <div
          className={`flex items-center gap-3 text-3xl font-black tracking-tight select-none
            ${isDarkMode ? 'text-white' : 'text-blue-700'}
            drop-shadow-lg`}
        >
          <span className="inline-flex items-center gap-2">
            <svg
              className="w-9 h-9 text-yellow-400 animate-spin-slow"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2.5" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 2a10 10 0 0 1 10 10"
                className="stroke-yellow-400"
                strokeWidth="2.5"
              />
            </svg>
            <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              Rockefeller Finance
            </span>
          </span>
        </div>
        {/* Navigation Links */}
        <ul className="flex items-center gap-1.5">
          {navItems.map(({ to, label, icon }) => (
            <li key={to}>
              <Link
                to={to}
                className={`
                  group flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-base
                  transition-all duration-200
                  shadow-sm
                  ${location.pathname === to
                    ? isDarkMode
                      ? 'bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg scale-105'
                      : 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg scale-105'
                    : isDarkMode
                      ? 'text-gray-200 hover:bg-gray-800 hover:text-blue-300'
                      : 'text-blue-700 hover:bg-blue-100 hover:text-blue-600'
                  }
                  focus:outline-none focus:ring-2 focus:ring-blue-400
                `}
                aria-current={location.pathname === to ? 'page' : undefined}
              >
                <span className="transition-transform duration-200 group-hover:scale-110">{icon}</span>
                <span className="hidden sm:inline">{label}</span>
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={handleLogout}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-base
                bg-gradient-to-r from-red-500 to-pink-500 text-white
                hover:from-red-600 hover:to-pink-600
                shadow-lg transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-pink-400
                active:scale-95
              `}
              aria-label="Đăng xuất"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" />
              </svg>
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

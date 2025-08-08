import React, { useState, useEffect, memo, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, DollarSign, Briefcase, Settings, LogOut, Menu, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// Responsive, modern Sidebar with improved mobile UX
const Sidebar = memo(() => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // On mobile, always expanded
    if (window.innerWidth < 768) return false;
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  // Responsive: update isMobile on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // On mobile, always expanded
      if (window.innerWidth < 768) setIsCollapsed(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Color palette for 2025 look
  const colors = {
    primary: '#2563eb', // blue-600
    secondary: '#60a5fa', // blue-400
    tertiary: '#f1f5f9', // slate-100
    background: isDarkMode ? 'rgba(30,41,59,0.85)' : 'rgba(255,255,255,0.85)',
    glass: isDarkMode
      ? 'bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-gray-900/60'
      : 'bg-gradient-to-br from-white/80 via-blue-50/70 to-white/60',
    border: isDarkMode ? 'border-gray-700/60' : 'border-blue-200/60',
    shadow: isDarkMode ? 'shadow-blue-900/30' : 'shadow-blue-200/40',
    navItemActiveBg: isDarkMode
      ? 'bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900'
      : 'bg-gradient-to-r from-blue-600 to-blue-400',
    navItemInactiveBg: isDarkMode
      ? 'hover:bg-gray-800/80'
      : 'hover:bg-blue-100/80',
    navItemInactiveText: isDarkMode
      ? 'text-gray-200'
      : 'text-gray-700',
    navItemActiveText: 'text-white',
    navItemHoverText: isDarkMode
      ? 'hover:text-blue-300'
      : 'hover:text-blue-700',
  };

  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem('sidebarCollapsed', isCollapsed);
    }
  }, [isCollapsed, isMobile]);

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  const menuItems = [
    { path: '/home', label: 'Trang chủ', icon: Home },
    { path: '/expenses', label: 'Chi tiêu', icon: DollarSign },
    { path: '/investments', label: 'Đầu tư', icon: Briefcase },
    { path: '/settings', label: 'Cài đặt', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch('https://backend-rockefeller-finance.onrender.com/api/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      localStorage.removeItem('token');
      navigate('/login');
      toast.success('Đăng xuất thành công!');
    } catch (err) {
      toast.error('Lỗi khi đăng xuất');
    }
  };

  const toggleSidebar = () => {
    // On mobile, don't allow collapse
    if (isMobile) return;
    setIsCollapsed((c) => !c);
  };
  const toggleMobileMenu = () => setIsMobileMenuOpen((m) => !m);

  // Helper: close sidebar on mobile when navigating
  const handleMenuItemClick = () => {
    if (isMobile) setIsMobileMenuOpen(false);
  };

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isMobile && isMobileMenuOpen) setIsMobileMenuOpen(false);
    // eslint-disable-next-line
  }, [location.pathname, isMobile]);

  // Prevent scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, isMobile]);

  // Close sidebar if click outside (on mobile)
  useEffect(() => {
    if (!isMobileMenuOpen || !isMobile) return;
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen, isMobile]);

  // Animation classes for 2025 feel
  const sidebarAnim = `
    transition-all duration-500 ease-[cubic-bezier(.77,0,.18,1)]
    will-change-transform
    backdrop-blur-xl
    ${colors.glass}
    ${colors.shadow}
    border-r-2 ${colors.border}
  `;

  // Modern nav item style
  const navItemBase =
    'group flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-base transition-all duration-200 cursor-pointer select-none';
  // Use explicit bg/text for dark mode fix
  const navItemActive = `
    ${colors.navItemActiveBg} ${colors.navItemActiveText}
    shadow-lg scale-[1.04] border border-blue-300/30
  `;
  const navItemInactive = `
    ${colors.navItemInactiveText} ${colors.navItemInactiveBg} ${colors.navItemHoverText}
    transition-colors
  `;

  // Modern mobile menu button
  const mobileMenuBtn =
    'md:hidden fixed top-4 left-4 z-[100] p-2 rounded-full bg-white/80 dark:bg-gray-900/80 shadow-lg border border-blue-200/40 dark:border-gray-700/40 backdrop-blur-lg transition-all duration-200 hover:scale-110';

  // Modern collapse/expand button
  const collapseBtn =
    'p-1.5 rounded-full hover:bg-blue-100/80 dark:hover:bg-gray-800/80 text-blue-600 dark:text-blue-300 transition-all duration-200 shadow-sm border border-blue-200/40 dark:border-gray-700/40';

  // Modern dark mode button
  const darkModeBtn =
    'w-full p-2 mb-2 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 transition-all duration-200 shadow-md hover:scale-105';

  // Modern logout button
  const logoutBtn =
    'flex items-center gap-3 p-2 rounded-xl w-full transition-all duration-200 bg-gradient-to-r from-red-500/90 to-pink-500/90 text-white hover:from-red-600 hover:to-pink-600 shadow-md hover:scale-105';

  // Sidebar width
  const sidebarWidth = isCollapsed && !isMobile ? 72 : isMobile ? '80vw' : 270;
  const sidebarMinWidth = isCollapsed && !isMobile ? 72 : isMobile ? 0 : 270;
  const sidebarMaxWidth = isCollapsed && !isMobile ? 72 : isMobile ? '90vw' : 270;

  return (
    <>
      {/* Mobile menu button */}
      <button
        className={mobileMenuBtn}
        onClick={toggleMobileMenu}
        aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
        style={{
          boxShadow: '0 4px 24px 0 rgba(33,113,181,0.10)',
          border: '1.5px solid #e0e7ef',
          display: isMobile ? 'block' : 'none',
        }}
      >
        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>
      {/* Sidebar */}
      <nav
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 h-screen z-50 flex flex-col
          ${sidebarAnim}
          ${isMobile
            ? isMobileMenuOpen
              ? 'translate-x-0'
              : '-translate-x-full'
            : 'translate-x-0'
          }
        `}
        style={{
          width: sidebarWidth,
          minWidth: sidebarMinWidth,
          maxWidth: sidebarMaxWidth,
          background: colors.background,
          boxShadow: isDarkMode
            ? '0 8px 32px 0 rgba(33,113,181,0.18)'
            : '0 8px 32px 0 rgba(33,113,181,0.10)',
          borderRight: isDarkMode ? '2px solid #33415580' : '2px solid #e0e7ef99',
          transition: 'all 0.5s cubic-bezier(.77,0,.18,1)',
        }}
        aria-label="Sidebar navigation"
      >
        {/* Logo & Collapse */}
        <div className="flex items-center justify-between px-4 py-5">
          {(!isCollapsed || isMobile) && (
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Rockefeller Finance"
                className="w-10 h-10 rounded-full shadow-md border border-blue-200/60 dark:border-gray-700/60"
                draggable={false}
              />
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
                Rockefeller
              </span>
            </div>
          )}
          {/* Collapse button only on desktop */}
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className={`${collapseBtn} hidden md:block`}
              aria-label={isCollapsed ? 'Mở sidebar' : 'Thu gọn sidebar'}
              tabIndex={0}
            >
              {isCollapsed ? <Menu size={22} /> : <X size={22} />}
            </button>
          )}
        </div>
        {/* Quote */}
        {(!isCollapsed || isMobile) && (
          <div
            className={`px-4 py-3 mb-3 mx-3 rounded-2xl shadow-sm border border-blue-200/40 dark:border-gray-700/40 ${
              isDarkMode
                ? 'bg-gradient-to-r from-gray-900/80 via-gray-800/70 to-gray-900/60 text-white'
                : 'bg-gradient-to-r from-blue-50/80 via-white/80 to-blue-100/70 text-gray-900'
            }`}
          >
            <p className="text-xs italic flex items-center gap-1.5">
              <AlertCircle size={15} className="text-blue-400" />
              <span>
                <span className="font-bold text-blue-600">32 Lá Thư</span>: "Điều hướng thông minh, lập kế hoạch tài chính hiệu quả."
              </span>
            </p>
          </div>
        )}
        {/* Menu */}
        <ul className="flex-1 flex flex-col gap-1 px-2 py-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200/40 dark:scrollbar-thumb-gray-700/40 scrollbar-track-transparent">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    ${navItemBase}
                    ${isActive ? navItemActive : navItemInactive}
                    ${isCollapsed && !isMobile ? 'justify-center px-2 py-3' : ''}
                    focus:outline-none focus:ring-2 focus:ring-blue-400/60
                  `}
                  title={item.label}
                  onClick={handleMenuItemClick}
                  tabIndex={
                    isMobile
                      ? isMobileMenuOpen
                        ? 0
                        : -1
                      : 0
                  }
                  style={{
                    transition: 'all 0.18s cubic-bezier(.77,0,.18,1)',
                    minHeight: 48,
                  }}
                >
                  <item.icon size={22} className="transition-transform duration-200 group-hover:scale-110" />
                  {(!isCollapsed || isMobile) && (
                    <span className="transition-all duration-200 group-hover:translate-x-1">
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
        {/* Bottom actions */}
        <div className="w-full px-3 pb-5 mt-auto flex flex-col gap-2">
          {(!isCollapsed || isMobile) && (
            <button
              onClick={() => setIsDarkMode((d) => !d)}
              className={darkModeBtn}
              aria-label="Chuyển đổi chế độ sáng/tối"
              style={{
                letterSpacing: '0.01em',
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              {isDarkMode ? 'Chế độ Sáng' : 'Chế độ Tối'}
            </button>
          )}
          <button
            onClick={() => {
              handleLogout();
              if (isMobile) setIsMobileMenuOpen(false);
            }}
            className={`${logoutBtn} ${(isCollapsed && !isMobile) ? 'justify-center px-2 py-3' : ''}`}
            title={isCollapsed && !isMobile ? 'Đăng xuất' : ''}
            aria-label="Đăng xuất"
            tabIndex={0}
          >
            <LogOut size={20} />
            {(!isCollapsed || isMobile) && <span>Đăng xuất</span>}
          </button>
        </div>
      </nav>
      {/* Overlay for mobile */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 md:hidden transition-all duration-300"
          onClick={toggleMobileMenu}
          aria-label="Đóng menu"
        ></div>
      )}
    </>
  );
});

export default Sidebar;
import React, { useState, useEffect, memo, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, DollarSign, Briefcase, Settings, LogOut, Menu, X, AlertCircle, List } from 'lucide-react';
import toast from 'react-hot-toast';
import { useContext } from 'react';
import { FinanceContext } from '../contexts/FinanceContext';

// Responsive, modern Sidebar with Rockefeller aesthetic (rigid, standard gold & obsidian)
const Sidebar = memo(() => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (window.innerWidth < 768) return false;
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });
  const { isDarkMode } = useContext(FinanceContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) setIsCollapsed(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const colors = {
    background: 'var(--bg-secondary)',
    border: 'border-[var(--border-color)]',
    navItemActiveBg: 'bg-[var(--accent-gold)]',
    navItemActiveText: 'text-black font-bold',
    navItemInactiveText: 'text-[var(--text-secondary)]',
    navItemHoverText: 'hover:text-[var(--accent-gold)]',
    navItemHoverBg: 'hover:bg-[rgba(var(--accent-gold-rgb),0.06)]',
  };

  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem('sidebarCollapsed', isCollapsed);
    }
  }, [isCollapsed, isMobile]);

  const menuItems = [
    { path: '/home', label: 'Trang chủ', icon: Home },
    { path: '/expenses', label: 'Chi tiêu', icon: DollarSign },
    { path: '/transactions', label: 'Lịch sử', icon: List },
    { path: '/investments', label: 'Đầu tư', icon: Briefcase },
    { path: '/settings', label: 'Cài đặt', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/logout`, {
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
    if (isMobile) return;
    setIsCollapsed((c) => !c);
  };
  const toggleMobileMenu = () => setIsMobileMenuOpen((m) => !m);

  const handleMenuItemClick = () => {
    if (isMobile) setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (isMobile && isMobileMenuOpen) setIsMobileMenuOpen(false);
  }, [location.pathname, isMobile]);

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

  const sidebarAnim = `
    transition-all duration-500 ease-[cubic-bezier(.77,0,.18,1)]
    will-change-transform
    backdrop-blur-xl
    border-r ${colors.border}
  `;

  const navItemBase =
    'group flex items-center gap-3 px-4 py-3 rounded-none font-medium text-base transition-all duration-200 cursor-pointer select-none';

  const navItemActive = `
    ${colors.navItemActiveBg} ${colors.navItemActiveText}
    shadow-sm border-l-4 border-black
  `;
  const navItemInactive = `
    ${colors.navItemInactiveText} ${colors.navItemHoverBg} ${colors.navItemHoverText}
    transition-colors
  `;

  const mobileMenuBtn =
    'md:hidden fixed top-4 left-4 z-[100] p-2 rounded-none bg-[var(--bg-secondary)] shadow-lg border border-[var(--border-color)] backdrop-blur-lg transition-all duration-200 hover:scale-105';

  const collapseBtn =
    'p-1.5 rounded-none hover:bg-[rgba(var(--accent-gold-rgb),0.1)] text-[var(--accent-gold)] transition-all duration-200 border border-[var(--border-color)]';

  const logoutBtn =
    'flex items-center gap-3 p-2.5 border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-red-500 hover:border-red-500 transition-all duration-200 w-full rounded-none';

  const sidebarWidth = isCollapsed && !isMobile ? 72 : isMobile ? '80vw' : 270;
  const sidebarMinWidth = isCollapsed && !isMobile ? 72 : isMobile ? 0 : 270;
  const sidebarMaxWidth = isCollapsed && !isMobile ? 72 : isMobile ? '90vw' : 270;

  useEffect(() => {
    const root = document.documentElement;
    if (isMobile) {
      root.style.setProperty('--sidebar-width', '0px');
    } else {
      root.style.setProperty('--sidebar-width', `${sidebarWidth}px`);
    }
  }, [sidebarWidth, isMobile]);

  return (
    <>
      {/* Mobile menu button */}
      <button
        className={mobileMenuBtn}
        onClick={toggleMobileMenu}
        aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
        style={{
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
          boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
          transition: 'all 0.5s cubic-bezier(.77,0,.18,1)',
        }}
        aria-label="Sidebar navigation"
      >
        {/* Logo & Collapse */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-[var(--border-color)]">
          {(!isCollapsed || isMobile) && (
            <div className="flex items-center gap-3">
              {/* Monogram Monolith R logo */}
              <div className="w-10 h-10 border border-[var(--accent-gold)] flex items-center justify-center bg-black select-none">
                <span className="font-display font-bold text-[var(--accent-gold)] text-xl">R</span>
              </div>
              <span className="text-xl font-display font-bold tracking-wider text-[var(--accent-gold)]">
                ROCKEFELLER
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
              {isCollapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
          )}
        </div>

        {/* Quote */}
        {(!isCollapsed || isMobile) && (
          <div className="p-4 border-b border-[var(--border-color)] bg-[rgba(var(--accent-gold-rgb),0.02)]">
            <p className="text-xs italic flex items-start gap-2 text-[var(--text-secondary)]">
              <AlertCircle size={14} className="text-[var(--accent-gold)] mt-0.5 flex-shrink-0" />
              <span>
                <span className="font-bold font-display text-[var(--accent-gold)]">38 LÁ THƯ:</span> "Kỷ luật là nền tảng của mọi vinh quang tài chính."
              </span>
            </p>
          </div>
        )}

        {/* Menu */}
        <ul className="flex-1 flex flex-col gap-1 py-4 overflow-y-auto">
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
                    focus:outline-none focus:ring-1 focus:ring-[var(--accent-gold)]
                  `}
                  title={item.label}
                  onClick={handleMenuItemClick}
                  tabIndex={isMobile ? (isMobileMenuOpen ? 0 : -1) : 0}
                  style={{
                    transition: 'all 0.18s cubic-bezier(.77,0,.18,1)',
                    minHeight: 48,
                  }}
                >
                  <item.icon size={20} className="transition-transform duration-200 group-hover:scale-105" />
                  {(!isCollapsed || isMobile) && (
                    <span className="font-display text-sm tracking-wider uppercase">
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Bottom actions */}
        <div className="w-full p-4 border-t border-[var(--border-color)] mt-auto flex flex-col gap-2">
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
            <LogOut size={18} />
            {(!isCollapsed || isMobile) && <span className="font-display text-xs tracking-wider uppercase">Đăng xuất</span>}
          </button>
        </div>
      </nav>
      {/* Overlay for mobile */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-40 md:hidden transition-all duration-300"
          onClick={toggleMobileMenu}
          aria-label="Đóng menu"
        ></div>
      )}
    </>
  );
});

export default Sidebar;
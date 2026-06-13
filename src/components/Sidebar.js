import React, { useState, useEffect, memo, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, DollarSign, Briefcase, Settings, LogOut, Menu, X, AlertCircle, List } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL } from '../config';

// Responsive, modern Sidebar with Rockefeller aesthetic (rigid, standard gold & obsidian)
const Sidebar = memo(() => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (window.innerWidth < 768) return false;
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });
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
        await fetch(`${API_URL}/api/logout`, {
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
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

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
    'group flex items-center px-4 py-3 rounded-none font-medium text-base transition-all duration-200 cursor-pointer select-none';

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
    'flex items-center p-2.5 border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-red-500 hover:border-red-500 transition-all duration-200 w-full rounded-none';

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
        <div 
          className={`flex items-center border-b border-[var(--border-color)] py-5 px-4 transition-all duration-300 ${
            isCollapsed && !isMobile ? 'justify-center' : 'justify-between'
          }`}
        >
          <div 
            className={`flex items-center overflow-hidden transition-all duration-300 ${
              isCollapsed && !isMobile ? 'max-w-0 opacity-0 pointer-events-none' : 'max-w-[200px] opacity-100'
            }`}
          >
            {/* Monogram Monolith R logo */}
            <div className="w-10 h-10 border border-[var(--accent-gold)] flex items-center justify-center bg-black select-none flex-shrink-0">
              <span className="font-display font-bold text-[var(--accent-gold)] text-xl">R</span>
            </div>
            <span className="text-xl font-display font-bold tracking-wider text-[var(--accent-gold)] whitespace-nowrap ml-3">
              ROCKEFELLER
            </span>
          </div>
          {/* Collapse button only on desktop */}
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className={`${collapseBtn} hidden md:block flex-shrink-0`}
              aria-label={isCollapsed ? 'Mở sidebar' : 'Thu gọn sidebar'}
              tabIndex={0}
            >
              {isCollapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
          )}
        </div>

        {/* Quote */}
        <div 
          className={`overflow-hidden transition-all duration-300 border-b border-[var(--border-color)] bg-[rgba(var(--accent-gold-rgb),0.02)] ${
            isCollapsed && !isMobile ? 'max-h-0 p-0 border-b-0 opacity-0 whitespace-nowrap delay-0 duration-200' : 'max-h-[120px] p-4 opacity-100 delay-100 duration-300'
          }`}
        >
          <p className="text-xs italic flex items-start gap-2 text-[var(--text-secondary)] whitespace-normal">
            <AlertCircle size={14} className="text-[var(--accent-gold)] mt-0.5 flex-shrink-0" />
            <span>
              <span className="font-bold font-display text-[var(--accent-gold)]">38 LÁ THƯ:</span> "Kỷ luật là nền tảng của mọi vinh quang tài chính."
            </span>
          </p>
        </div>

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
                    focus:outline-none focus:ring-1 focus:ring-[var(--accent-gold)]
                  `}
                  title={item.label}
                  onClick={handleMenuItemClick}
                  tabIndex={isMobile ? (isMobileMenuOpen ? 0 : -1) : 0}
                  style={{
                    transition: 'all 0.3s cubic-bezier(.77,0,.18,1)',
                    minHeight: 48,
                    paddingLeft: isCollapsed && !isMobile ? '26px' : '16px',
                    paddingRight: isCollapsed && !isMobile ? '26px' : '16px',
                  }}
                >
                  <item.icon size={20} className="transition-transform duration-200 group-hover:scale-105 flex-shrink-0" />
                  <span 
                    className={`font-display text-sm tracking-wider uppercase transition-all duration-300 overflow-hidden whitespace-nowrap inline-block ${
                      isCollapsed && !isMobile ? 'opacity-0 max-w-0 ml-0 delay-0 duration-200' : 'opacity-100 max-w-[200px] ml-3 delay-150 duration-300'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Bottom actions */}
        <div 
          className={`w-full border-t border-[var(--border-color)] mt-auto flex flex-col gap-2 transition-all duration-300 ${
            isCollapsed && !isMobile ? 'p-0 py-4' : 'p-4'
          }`}
        >
          <button
            onClick={() => {
              handleLogout();
              if (isMobile) setIsMobileMenuOpen(false);
            }}
            className={`${logoutBtn} ${isCollapsed && !isMobile ? 'border-0' : 'border'}`}
            title={isCollapsed && !isMobile ? 'Đăng xuất' : ''}
            aria-label="Đăng xuất"
            tabIndex={isMobile ? (isMobileMenuOpen ? 0 : -1) : 0}
            style={{
              transition: 'all 0.3s cubic-bezier(.77,0,.18,1)',
              paddingLeft: isCollapsed && !isMobile ? '27px' : '10px',
              paddingRight: isCollapsed && !isMobile ? '27px' : '10px',
              justifyContent: 'flex-start',
            }}
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span 
              className={`font-display text-xs tracking-wider uppercase transition-all duration-300 overflow-hidden whitespace-nowrap inline-block ${
                isCollapsed && !isMobile ? 'opacity-0 max-w-0 ml-0 delay-0 duration-200' : 'opacity-100 max-w-[200px] ml-3 delay-150 duration-300'
              }`}
            >
              Đăng xuất
            </span>
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
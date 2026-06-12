import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { FinanceProvider } from './contexts/FinanceContext';
import { API_URL } from './config';
// import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Expenses from './pages/Expenses';
import Transactions from './pages/Transactions';
import Investments from './pages/Investments';
// import Goals from './pages/Goals';
// import ReportsPage from './pages/ReportsPage';
import './index.css';
import Login from './components/Login';
import Settings from './pages/Settings';


// Component kiểm tra quyền truy cập + check initialBudget bằng axios
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const checkBudget = async () => {
      if (token) {
        try {
          const response = await axios.get(`${API_URL}/api/initial-budget`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.initialBudget === 0) {
            navigate('/expenses');
          }
        } catch (err) {
          console.error('Lỗi kiểm tra ngân sách:', err);
          navigate('/login');
        }
      }
    };
    checkBudget();
  }, [token, navigate]);

  return token ? (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {children}
    </div>
  ) : (
    <Navigate to="/login" replace />
  );
};

function AppLayout() {
  return (
    <div className="min-h-screen transition-colors duration-300 bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Sidebar />
      <div
        className="flex-1 flex flex-col transition-all duration-500 ease-[cubic-bezier(.77,0,.18,1)]"
        style={{ paddingLeft: 'var(--sidebar-width, 0px)' }}
      >
        <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 w-full overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/investments" element={<Investments />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

const App = () => {
  return (
    <GoogleOAuthProvider clientId="578342193292-7u10o2pleqmqpni3e8cl829e9f6oqhqg.apps.googleusercontent.com">
      <FinanceProvider>
        <div className="grain-overlay" />
        <Router>
          <Routes>
            {/* Trang login độc lập, không dùng sidebar, navbar */}
            <Route path="/login" element={<Login />} />

            {/* Đóng gói layout chung với kiểm tra token */}
            <Route
              path="/*" /* Bắt tất cả route còn lại */
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </FinanceProvider>
    </GoogleOAuthProvider>
  );
};

export default App;

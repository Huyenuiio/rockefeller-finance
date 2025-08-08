import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FinanceProvider } from './contexts/FinanceContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Expenses from './pages/Expenses';
// import Budget from './pages/Budget';
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
          const response = await axios.get('https://backend-rockefeller-finance.onrender.com/api/initial-budget', {
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
  // Layout chung cho các trang yêu cầu đăng nhập:
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/expenses" element={<Expenses />} />
            {/* <Route path="/budget" element={<Budget />} /> */}
            <Route path="/investments" element={<Investments />} />
            {/* <Route path="/goals" element={<Goals />} /> */}
            {/* <Route path="/reports" element={<ReportsPage />} /> */}
            {/* Nếu muốn thêm routes khác hãy thêm ở đây */}
              <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

const App = () => {
  return (
    <FinanceProvider>
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

          {/* Nếu muốn redirect trang root, có thể chuyển thành: */}
          {/* <Route path="/" element={<Navigate to="/home" replace />} /> */}
        </Routes>
      </Router>
    </FinanceProvider>
  );
};

export default App;

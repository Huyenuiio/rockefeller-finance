import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Eye, EyeOff, KeyRound, User, Moon, Sun } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { FinanceContext } from '../contexts/FinanceContext';

function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { isDarkMode, toggleDarkMode } = useContext(FinanceContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!username || username.length < 3 || username.length > 20) {
      newErrors.username = 'Tên người dùng phải từ 3 đến 20 ký tự';
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      newErrors.username = 'Tên người dùng chỉ chứa chữ cái và số';
    }
    if (!password || password.length < 6 || password.length > 20) {
      newErrors.password = 'Mật khẩu phải từ 6 đến 20 ký tự';
    }
    if (!/[0-9]/.test(password)) {
      newErrors.password = 'Mật khẩu phải chứa ít nhất một số';
    }
    if (!isLoginMode && password !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin!');
      return;
    }
    setIsSubmitting(true);
    try {
      const endpoint = isLoginMode
        ? `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/login`
        : `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/register`;
      const response = await axios.post(endpoint, { username, password });
      if (isLoginMode) {
        localStorage.setItem('token', response.data.token);
        toast.success('Đăng nhập thành công!');
        setTimeout(() => navigate('/home'), 1000);
      } else {
        toast.success('Đăng ký thành công! Đang chuyển sang đăng nhập...');
        setIsLoginMode(true);
        setPassword('');
        setConfirmPassword('');
        setTimeout(async () => {
          try {
            const loginResponse = await axios.post(
              `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/login`,
              { username, password }
            );
            localStorage.setItem('token', loginResponse.data.token);
            navigate('/home');
          } catch (err) {
            toast.error(err.response?.data?.error || 'Lỗi đăng nhập tự động');
          }
        }, 1000);
      }
      setErrors({});
    } catch (err) {
      toast.error(err.response?.data?.error || (isLoginMode ? 'Lỗi đăng nhập' : 'Lỗi đăng ký'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    toast('Vui lòng liên hệ hỗ trợ tại support@rockefeller-finance.com để đặt lại mật khẩu.', {
      duration: 5000,
    });
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/google-login`,
        { credential: credentialResponse.credential }
      );
      localStorage.setItem('token', response.data.token);
      toast.success('Đăng nhập Google thành công!');
      setTimeout(() => navigate('/home'), 1000);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Lỗi đăng nhập Google');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4 transition-colors duration-300">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <div className="w-full max-w-md p-8 border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-2xl relative">
        {/* Decorative Gold Header Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-[var(--accent-gold)]" />

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 border border-[var(--accent-gold)] flex items-center justify-center bg-black">
              <span className="font-display font-bold text-[var(--accent-gold)] text-sm">R</span>
            </div>
            <h2 className="text-xl font-display font-bold tracking-wider text-[var(--accent-gold)]">
              {isLoginMode ? 'ROCKEFELLER' : 'SIGN UP'}
            </h2>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition hover:scale-105"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* 38 Letters Quote */}
        <div className="mb-6 p-4 border-y border-[var(--border-color)] bg-[rgba(var(--accent-gold-rgb),0.02)]">
          <p className="italic text-xs text-[var(--text-secondary)] leading-relaxed">
            <span className="font-bold font-display text-[var(--accent-gold)]">38 LÁ THƯ:</span> "Kỷ luật tài chính bắt đầu từ việc quản lý thông tin cá nhân an toàn. Hãy sử dụng mật khẩu mạnh!"
          </p>
        </div>

        {/* Mode Select Tabs */}
        <div className="flex mb-6 border border-[var(--border-color)]">
          <button
            type="button"
            onClick={() => setIsLoginMode(true)}
            className={`flex-1 p-2.5 font-display text-xs tracking-wider uppercase transition ${
              isLoginMode
                ? 'bg-[var(--accent-gold)] text-black font-bold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-transparent'
            }`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => setIsLoginMode(false)}
            className={`flex-1 p-2.5 font-display text-xs tracking-wider uppercase transition ${
              !isLoginMode
                ? 'bg-[var(--accent-gold)] text-black font-bold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-transparent'
            }`}
          >
            Đăng ký
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-display tracking-wider uppercase text-[var(--text-secondary)] mb-1">
              Tên người dùng
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[var(--text-muted)]">
                <User size={16} />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`rockefeller-input ${errors.username ? 'border-red-500' : ''}`}
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Nhập tên người dùng"
                disabled={isSubmitting}
              />
            </div>
            {errors.username && <p className="text-red-500 text-xs mt-1 font-medium">{errors.username}</p>}
          </div>

          <div>
            <label className="block text-xs font-display tracking-wider uppercase text-[var(--text-secondary)] mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[var(--text-muted)]">
                <KeyRound size={16} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`rockefeller-input ${errors.password ? 'border-red-500' : ''}`}
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                placeholder="Nhập mật khẩu"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
          </div>

          {!isLoginMode && (
            <div>
              <label className="block text-xs font-display tracking-wider uppercase text-[var(--text-secondary)] mb-1">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[var(--text-muted)]">
                  <KeyRound size={16} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`rockefeller-input ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  placeholder="Xác nhận mật khẩu"
                  disabled={isSubmitting}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 font-medium">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-gold-primary py-3 text-xs uppercase tracking-widest font-bold mt-2"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-black" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Đang xử lý...
              </span>
            ) : isLoginMode ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-[var(--border-color)]"></div>
          <span className="px-3 text-[var(--text-muted)] text-xs font-display tracking-wider uppercase">Hoặc</span>
          <div className="flex-1 border-t border-[var(--border-color)]"></div>
        </div>

        <div className="flex justify-center border border-[var(--border-color)] p-2 bg-black">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Đăng nhập Google thất bại')}
            useOneTap
            theme="filled_black"
            shape="square"
            width="100%"
          />
        </div>

        {isLoginMode && (
          <div className="mt-4 text-center">
            <button
              onClick={handleForgotPassword}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition hover:underline"
              disabled={isSubmitting}
            >
              Quên mật khẩu?
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
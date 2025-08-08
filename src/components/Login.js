import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
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
        ? 'https://backend-rockefeller-finance.onrender.com/api/login'
        : 'https://backend-rockefeller-finance.onrender.com/api/register';
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
              'https://backend-rockefeller-finance.onrender.com/api/login',
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

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <div className={`w-full max-w-md p-8 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">{isLoginMode ? 'Đăng nhập' : 'Đăng ký'}</h2>
          <button
            onClick={toggleDarkMode}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition transform hover:scale-105"
          >
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
        <div className="mb-6 p-4 rounded bg-blue-100 text-blue-800">
          <p className="italic">
            *32 Lá Thư*: "Kỷ luật tài chính bắt đầu từ việc quản lý thông tin cá nhân an toàn. Hãy sử dụng mật khẩu mạnh!"
          </p>
        </div>
        <div className="flex mb-6">
          <button
            onClick={() => setIsLoginMode(true)}
            className={`flex-1 p-2 rounded-l ${isLoginMode ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} transition`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => setIsLoginMode(false)}
            className={`flex-1 p-2 rounded-r ${!isLoginMode ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} transition`}
          >
            Đăng ký
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Tên người dùng</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'
              } ${errors.username ? 'border-red-500' : ''}`}
              placeholder="Nhập tên người dùng"
              disabled={isSubmitting}
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>
          <div className="mb-4 relative">
            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'
              } ${errors.password ? 'border-red-500' : ''}`}
              placeholder="Nhập mật khẩu"
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-9 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          {!isLoginMode && (
            <div className="mb-4 relative">
              <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'
                } ${errors.confirmPassword ? 'border-red-500' : ''}`}
                placeholder="Xác nhận mật khẩu"
                disabled={isSubmitting}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-2 rounded text-white ${
              isSubmitting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
            } transition transform hover:scale-105`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Đang xử lý...
              </span>
            ) : isLoginMode ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>
        {isLoginMode && (
          <button
            onClick={handleForgotPassword}
            className="mt-4 text-blue-500 hover:underline"
            disabled={isSubmitting}
          >
            Quên mật khẩu?
          </button>
        )}
      </div>
    </div>
  );
}

export default Login;
import React, { useState, useContext } from 'react';
import { FinanceContext } from '../contexts/FinanceContext';

function ExpenseTracker() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('essentials');
  const [details, setDetails] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedMonths, setExpandedMonths] = useState({});
  const { deductFromCategory, transactionHistory } = useContext(FinanceContext);

  const categories = [
    { value: 'essentials', label: 'Tiêu dùng thiết yếu (50%)' },
    { value: 'savings', label: 'Tiết kiệm bắt buộc (20%)' },
    { value: 'selfInvestment', label: 'Đầu tư bản thân (15%)' },
    { value: 'charity', label: 'Từ thiện (5%)' },
    { value: 'emergency', label: 'Dự phòng linh hoạt (10%)' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (parsedAmount <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ!');
      return;
    }
    if (!details.trim()) {
      alert('Vui lòng nhập chi tiết giao dịch!');
      return;
    }
    if (!location.trim()) {
      alert('Vui lòng nhập vị trí giao dịch!');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const success = deductFromCategory(category, parsedAmount, details, location);
      setIsSubmitting(false);
      if (success) {
        setAmount('');
        setDetails('');
        setLocation('');
        alert('Giao dịch đã được ghi lại!');
      } else {
        alert('Không đủ số dư trong danh mục này!');
      }
    }, 1000);
  };

  // Nhóm giao dịch theo tháng
  const groupByMonth = (transactions) => {
    const grouped = {};
    transactions.forEach((transaction) => {
      const date = new Date(transaction.timestamp.split(',')[0].split('/').reverse().join('-'));
      const monthYear = date.toLocaleString('vi-VN', { month: 'long', year: 'numeric' });
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(transaction);
    });
    return grouped;
  };

  const groupedTransactions = groupByMonth(transactionHistory);

  const toggleMonth = (monthYear) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [monthYear]: !prev[monthYear],
    }));
  };

  const formatVND = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Theo dõi chi tiêu chi tiết</h2>
      <form onSubmit={handleSubmit} className="max-w-md mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Danh mục</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Số tiền (VND)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Nhập số tiền"
            required
            min="1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Chi tiết</label>
          <input
            type="text"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Nhập chi tiết (ví dụ: Mua thực phẩm)"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Vị trí</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Nhập vị trí (ví dụ: Siêu thị Coopmart)"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full p-2 rounded text-white ${
            isSubmitting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          } transition transform hover:scale-105 duration-200`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Đang xử lý...
            </span>
          ) : (
            'Thêm giao dịch'
          )}
        </button>
      </form>
      <h3 className="text-lg font-semibold mb-4">Lịch sử chi tiêu</h3>
      {Object.keys(groupedTransactions).length > 0 ? (
        Object.keys(groupedTransactions).sort((a, b) => {
          const dateA = new Date(a.split(' ')[1], new Date().toLocaleString('vi-VN', { month: 'long' }).indexOf(a.split(' ')[0]));
          const dateB = new Date(b.split(' ')[1], new Date().toLocaleString('vi-VN', { month: 'long' }).indexOf(b.split(' ')[0]));
          return dateB - dateA;
        }).map((monthYear) => (
          <div key={monthYear} className="mb-4">
            <button
              onClick={() => toggleMonth(monthYear)}
              className="w-full flex justify-between items-center p-3 bg-gray-200 rounded text-left hover:bg-gray-300 transition duration-200"
            >
              <span className="font-semibold">{monthYear} ({groupedTransactions[monthYear].length} giao dịch)</span>
              <svg
                className={`w-5 h-5 transform transition-transform duration-200 ${expandedMonths[monthYear] ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedMonths[monthYear] && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                {groupedTransactions[monthYear].map((transaction, index) => (
                  <div key={index} className="p-4 rounded shadow bg-white transition transform hover:scale-105 duration-200">
                    <p><strong>Danh mục:</strong> {categories.find(cat => cat.value === transaction.category)?.label}</p>
                    <p><strong>Số tiền:</strong> {formatVND(transaction.amount)}</p>
                    <p><strong>Chi tiết:</strong> {transaction.details}</p>
                    <p><strong>Vị trí:</strong> {transaction.location}</p>
                    <p><strong>Thời gian:</strong> {transaction.timestamp}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-600">Chưa có giao dịch nào.</p>
      )}
    </div>
  );
}

export default ExpenseTracker;
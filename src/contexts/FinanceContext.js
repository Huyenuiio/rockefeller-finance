import React, { createContext, useState } from 'react';

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [allocations, setAllocations] = useState({
    essentials: 0,
    savings: 0,
    selfInvestment: 0,
    charity: 0,
    emergency: 0,
  });

  const [transactionHistory, setTransactionHistory] = useState([]);

  const allocateFunds = (amount) => {
    const parsedAmount = parseFloat(amount);
    if (parsedAmount <= 0) return;

    setAllocations((prev) => ({
      essentials: prev.essentials + parsedAmount * 0.5,
      savings: prev.savings + parsedAmount * 0.2,
      selfInvestment: prev.selfInvestment + parsedAmount * 0.15,
      charity: prev.charity + parsedAmount * 0.05,
      emergency: prev.emergency + parsedAmount * 0.1,
    }));
  };

  const deductFromCategory = (category, amount, details, location) => {
    const parsedAmount = parseFloat(amount);
    if (parsedAmount <= 0 || !allocations[category] || allocations[category] < parsedAmount) {
      return false;
    }

    setAllocations((prev) => ({
      ...prev,
      [category]: prev[category] - parsedAmount,
    }));

    const timestamp = new Date().toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    setTransactionHistory((prev) => [
      {
        category,
        amount: parsedAmount,
        details,
        location,
        timestamp,
      },
      ...prev,
    ]);

    return true;
  };

  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem('darkMode') === 'true'
  );

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('darkMode', next);
      return next;
    });
  };

  return (
    <FinanceContext.Provider value={{
      allocations,
      allocateFunds,
      deductFromCategory,
      transactionHistory,
      isDarkMode,
      toggleDarkMode
    }}>
      {children}
    </FinanceContext.Provider>
  );
};
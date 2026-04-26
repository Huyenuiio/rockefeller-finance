import React from 'react';

const AllocationHeader = ({ categories, totalAmount, allocations, visibility, toggleVisibility, toggleAllVisibility, isAnyAmountVisible, formatVND, numberToWords, isDarkMode }) => {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 font-quicksand">
            <div className={`p-5 rounded-2xl shadow-lg col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col items-center justify-center bg-gradient-to-br ${isDarkMode ? 'from-gray-800 via-gray-900 to-gray-800' : 'from-blue-100 via-white to-blue-50'} transition`}>
                <div className="flex items-center justify-center gap-3 mb-1">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <svg width="24" height="24" viewBox="0 0 24 24" aria-label="balance" fill="none">
                            <rect x="3" y="7" width="18" height="10" rx="4" fill="#2563eb" fillOpacity="0.10" />
                            <rect x="3" y="7" width="18" height="10" rx="4" stroke="#2563eb" strokeWidth="2" />
                            <path d="M7 12h10" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Tổng số dư
                    </h3>
                    <button
                        onClick={toggleAllVisibility}
                        aria-label="Hiện/Ẩn tất cả số tiền"
                        className={`p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-gray-800 focus:ring-blue-400' : 'focus:ring-offset-blue-100 focus:ring-blue-500'}`}
                    >
                        {isAnyAmountVisible ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                        )}
                    </button>
                </div>

                <div className="text-center cursor-pointer" onClick={() => toggleVisibility('total')}>
                    <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-300 mb-1">
                        {visibility.total ? formatVND(totalAmount) : '******** VND'}
                    </p>
                    <p className="text-sm italic text-gray-500 dark:text-gray-300">
                        {visibility.total ? numberToWords(totalAmount) : '********'}
                    </p>
                </div>
            </div>

            {categories.map((cat) => (
                <div
                    key={cat.value}
                    className={`p-4 rounded-2xl shadow-lg flex flex-col items-center justify-center bg-gradient-to-br ${isDarkMode ? 'from-gray-800 via-gray-900 to-gray-800' : 'from-white via-blue-50 to-blue-100'} transition cursor-pointer`}
                    onClick={() => toggleVisibility(cat.value)}
                >
                    <span className="mb-1 pointer-events-none">{cat.icon}</span>
                    <h3 className="text-base font-semibold text-center pointer-events-none">{cat.label}</h3>
                    <p
                        className="text-xl font-bold"
                        style={{ color: cat.color }}
                    >
                        {visibility[cat.value] ? formatVND(allocations[cat.value] || 0) : '******** VND'}
                    </p>
                </div>
            ))}
        </section>
    );
};

export default AllocationHeader;

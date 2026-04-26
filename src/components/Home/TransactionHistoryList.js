import React from 'react';

const TransactionHistoryList = ({
    paginatedGrouped,
    expandedMonths,
    toggleMonth,
    sortTransactionsByDateDesc,
    categories,
    formatVND,
    currentPage,
    setCurrentPage,
    totalPages,
    isDarkMode
}) => {
    return (
        <section>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2 font-quicksand">
                <svg width="20" height="20" viewBox="0 0 24 24" aria-label="transactions" fill="none">
                    <rect x="4" y="4" width="16" height="16" rx="4" fill="#2563eb" fillOpacity="0.10" />
                    <rect x="4" y="4" width="16" height="16" rx="4" stroke="#2563eb" strokeWidth="2" />
                    <path d="M8 10h8M10 14h4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Giao dịch gần đây
            </h3>
            {Object.keys(paginatedGrouped).length > 0 ? (
                <>
                    {Object.keys(paginatedGrouped).sort((a, b) => {
                        const [monthA, yearA] = a.split(' ');
                        const [monthB, yearB] = b.split(' ');
                        const dateA = new Date(yearA, new Date(Date.parse(monthA + " 1, 2000")).getMonth());
                        const dateB = new Date(yearB, new Date(Date.parse(monthB + " 1, 2000")).getMonth());
                        return dateB - dateA;
                    }).map((monthYear) => (
                        <div key={monthYear} className="mb-4 font-quicksand">
                            <button
                                onClick={() => toggleMonth(monthYear)}
                                className={`w-full flex justify-between items-center p-3 rounded-lg text-left font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-100 hover:bg-blue-200'}`}
                                aria-expanded={!!expandedMonths[monthYear]}
                                aria-controls={`transactions-${monthYear}`}
                            >
                                <span>{monthYear} <span className="font-normal text-sm text-gray-500 dark:text-gray-300">({paginatedGrouped[monthYear].length} giao dịch)</span></span>
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
                                <div
                                    id={`transactions-${monthYear}`}
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2 animate-fade-in"
                                >
                                    {sortTransactionsByDateDesc(paginatedGrouped[monthYear]).map((transaction, index) => (
                                        <div
                                            key={index}
                                            className={`p-4 rounded-2xl shadow-lg flex flex-col gap-1 bg-gradient-to-br ${isDarkMode ? 'from-gray-800 via-gray-900 to-gray-800' : 'from-white via-blue-50 to-blue-100'} transition`}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-lg">{categories.find(cat => cat.value === transaction.category)?.icon}</span>
                                                <span className="font-semibold">{categories.find(cat => cat.value === transaction.category)?.label || 'Không xác định'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-500 dark:text-gray-300">Số tiền:</span>
                                                <span className="font-bold text-blue-600 dark:text-blue-300">{formatVND(transaction.amount)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-500 dark:text-gray-300">Chi tiết:</span>
                                                <span>{transaction.details || <span className="italic text-gray-400">Không có</span>}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-500 dark:text-gray-300">Vị trí:</span>
                                                <span>{transaction.location || <span className="italic text-gray-400">Không có</span>}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-500 dark:text-gray-300">Thời gian:</span>
                                                <span>{transaction.timestamp || <span className="italic text-gray-400">Không có</span>}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    <div className="flex flex-wrap justify-center gap-2 mt-6 font-quicksand">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-lg font-semibold ${currentPage === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white transition`}
                        >
                            Trước
                        </button>
                        <span className="px-4 py-2 font-semibold">{`Trang ${currentPage} / ${totalPages || 1}`}</span>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages || 1))}
                            disabled={currentPage === (totalPages || 1)}
                            className={`px-4 py-2 rounded-lg font-semibold ${currentPage === (totalPages || 1) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white transition`}
                        >
                            Sau
                        </button>
                    </div>
                </>
            ) : (
                <div className="p-4 bg-yellow-100 text-yellow-700 rounded-xl shadow text-center animate-fade-in font-quicksand">
                    Không tìm thấy giao dịch phù hợp với bộ lọc.
                </div>
            )}
        </section>
    );
};

export default TransactionHistoryList;

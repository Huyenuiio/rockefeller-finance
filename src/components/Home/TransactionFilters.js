import React from 'react';

const TransactionFilters = ({
    minAmount, setMinAmount,
    maxAmount, setMaxAmount,
    searchDetails, setSearchDetails,
    searchLocation, setSearchLocation,
    selectedCategory, setSelectedCategory,
    selectedMonthYear, setSelectedMonthYear,
    isSearchMenuOpen, setIsSearchMenuOpen,
    categories,
    availableMonths,
    handleResetSearch,
    toggleSearchMenu,
    isDarkMode
}) => {
    return (
        <section className="mb-6 relative font-quicksand">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2 font-quicksand">
                <svg width="20" height="20" viewBox="0 0 24 24" aria-label="filter" fill="none">
                    <rect x="4" y="4" width="16" height="16" rx="4" fill="#2563eb" fillOpacity="0.10" />
                    <rect x="4" y="4" width="16" height="16" rx="4" stroke="#2563eb" strokeWidth="2" />
                    <path d="M8 10h8M10 14h4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Bộ lọc giao dịch
            </h3>
            <div className="flex flex-col gap-3 md:gap-0 md:grid md:grid-cols-2 lg:grid-cols-4 mb-3">
                <div>
                    <label className="block text-xs font-medium mb-1">Số tiền tối thiểu (VND)</label>
                    <input
                        type="number"
                        value={minAmount}
                        onChange={(e) => setMinAmount(e.target.value)}
                        className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${isDarkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}
                        placeholder="Tối thiểu"
                        min={0}
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium mb-1">Số tiền tối đa (VND)</label>
                    <input
                        type="number"
                        value={maxAmount}
                        onChange={(e) => setMaxAmount(e.target.value)}
                        className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${isDarkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}
                        placeholder="Tối đa"
                        min={0}
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium mb-1">Chi tiết</label>
                    <input
                        type="text"
                        value={searchDetails}
                        onChange={(e) => setSearchDetails(e.target.value)}
                        className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${isDarkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}
                        placeholder="Ví dụ: Mua thực phẩm"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium mb-1">Vị trí</label>
                    <input
                        type="text"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${isDarkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}
                        placeholder="Ví dụ: VinMart"
                    />
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-2 mt-2">
                <button
                    onClick={toggleSearchMenu}
                    className={`w-full md:w-auto px-4 py-2 rounded-lg text-white font-semibold ${isSearchMenuOpen ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} transition`}
                    aria-expanded={isSearchMenuOpen}
                    aria-controls="advanced-filters"
                >
                    {isSearchMenuOpen ? 'Ẩn bộ lọc nâng cao' : 'Bộ lọc nâng cao'}
                </button>
                <button
                    onClick={handleResetSearch}
                    className={`w-full md:w-auto px-4 py-2 rounded-lg text-white font-semibold ${isDarkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-500 hover:bg-gray-600'} transition`}
                >
                    Xóa bộ lọc
                </button>
            </div>
            {isSearchMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 z-30 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setIsSearchMenuOpen(false)}
                        aria-label="Đóng bộ lọc nâng cao"
                    />
                    <div
                        id="advanced-filters"
                        className={`fixed left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 mt-0 rounded-xl shadow-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gradient-to-br ${isDarkMode ? 'from-gray-800 via-gray-900 to-gray-800' : 'from-white via-blue-50 to-blue-100'} animate-fade-in w-11/12 max-w-xl`}
                        onClick={e => e.stopPropagation()}
                    >
                        <div>
                            <label className="block text-xs font-medium mb-1">Danh mục</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}
                            >
                                <option value="">Tất cả danh mục</option>
                                {categories.map((cat) => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1">Tháng/Năm</label>
                            <select
                                value={selectedMonthYear}
                                onChange={(e) => setSelectedMonthYear(e.target.value)}
                                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}
                            >
                                <option value="">Tất cả thời gian</option>
                                {availableMonths.map((month) => (
                                    <option key={month} value={month}>{month}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            className="md:col-span-2 mt-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition"
                            onClick={() => setIsSearchMenuOpen(false)}
                            type="button"
                        >
                            Đóng bộ lọc nâng cao
                        </button>
                    </div>
                </>
            )}
        </section>
    );
};

export default TransactionFilters;

import React from 'react';
import { Filter, RotateCcw, Sliders, X } from 'lucide-react';

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
        <section className="mb-8 relative">
            <h3 className="text-xs font-display font-bold tracking-widest text-[var(--accent-gold)] mb-3 flex items-center gap-2 uppercase">
                <Filter size={16} />
                BỘ LỌC GIAO DỊCH
            </h3>
            
            {/* Filters Input Grid */}
            <div className="p-5 border border-[var(--border-color)] bg-[var(--bg-card)] shadow-sm hover:border-[var(--accent-gold)] transition-all duration-300 mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-[10px] font-display font-bold tracking-wider uppercase text-[var(--text-muted)] mb-1.5">
                            Số tiền tối thiểu (VND)
                        </label>
                        <input
                            type="number"
                            value={minAmount}
                            onChange={(e) => setMinAmount(e.target.value)}
                            className="rockefeller-input text-sm font-mono w-full"
                            placeholder="Tối thiểu"
                            min={0}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-display font-bold tracking-wider uppercase text-[var(--text-muted)] mb-1.5">
                            Số tiền tối đa (VND)
                        </label>
                        <input
                            type="number"
                            value={maxAmount}
                            onChange={(e) => setMaxAmount(e.target.value)}
                            className="rockefeller-input text-sm font-mono w-full"
                            placeholder="Tối đa"
                            min={0}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-display font-bold tracking-wider uppercase text-[var(--text-muted)] mb-1.5">
                            Chi tiết giao dịch
                        </label>
                        <input
                            type="text"
                            value={searchDetails}
                            onChange={(e) => setSearchDetails(e.target.value)}
                            className="rockefeller-input text-sm w-full"
                            placeholder="Ví dụ: Mua thực phẩm"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-display font-bold tracking-wider uppercase text-[var(--text-muted)] mb-1.5">
                            Địa điểm giao dịch
                        </label>
                        <input
                            type="text"
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                            className="rockefeller-input text-sm w-full"
                            placeholder="Ví dụ: VinMart"
                        />
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={toggleSearchMenu}
                    className="btn-gold-primary py-2.5 px-4 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all duration-300"
                    aria-expanded={isSearchMenuOpen}
                    aria-controls="advanced-filters"
                >
                    <Sliders size={14} />
                    {isSearchMenuOpen ? 'Ẩn bộ lọc nâng cao' : 'Bộ lọc nâng cao'}
                </button>
                <button
                    onClick={handleResetSearch}
                    className="btn-gold-outline py-2.5 px-4 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all duration-300"
                >
                    <RotateCcw size={14} />
                    Xóa bộ lọc
                </button>
            </div>

            {/* Advanced Filters Panel */}
            {isSearchMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setIsSearchMenuOpen(false)}
                        aria-label="Đóng bộ lọc nâng cao"
                    />
                    <div
                        id="advanced-filters"
                        className="fixed left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-lg p-6 bg-[var(--bg-card)] border border-[var(--border-color)] shadow-2xl relative animate-in zoom-in-95 duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsSearchMenuOpen(false)}
                            className="absolute right-4 top-4 p-1.5 border border-[var(--border-color)] hover:border-[var(--accent-gold)] text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-all duration-200"
                            aria-label="Đóng bộ lọc nâng cao"
                        >
                            <X size={16} />
                        </button>
                        
                        <h4 className="text-sm font-display font-bold tracking-widest text-[var(--accent-gold)] mb-5 uppercase">
                            BỘ LỌC NÂNG CAO
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-[10px] font-display font-bold tracking-wider uppercase text-[var(--text-muted)] mb-1.5">
                                    Danh mục phân bổ
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="rockefeller-input text-sm bg-[var(--bg-secondary)] w-full"
                                >
                                    <option value="">Tất cả danh mục</option>
                                    {categories.map((cat) => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-display font-bold tracking-wider uppercase text-[var(--text-muted)] mb-1.5">
                                    Chu kỳ thời gian
                                </label>
                                <select
                                    value={selectedMonthYear}
                                    onChange={(e) => setSelectedMonthYear(e.target.value)}
                                    className="rockefeller-input text-sm bg-[var(--bg-secondary)] w-full"
                                >
                                    <option value="">Tất cả thời gian</option>
                                    {availableMonths.map((month) => (
                                        <option key={month} value={month}>{month}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button
                            className="w-full btn-gold-primary py-3 text-xs uppercase tracking-widest font-bold transition-all duration-300"
                            onClick={() => setIsSearchMenuOpen(false)}
                            type="button"
                        >
                            Áp dụng bộ lọc
                        </button>
                    </div>
                </>
            )}
        </section>
    );
};

export default TransactionFilters;

import React from 'react';
import { Eye, EyeOff, Shield } from 'lucide-react';

const AllocationHeader = ({ categories, totalAmount, allocations, visibility, toggleVisibility, toggleAllVisibility, isAnyAmountVisible, formatVND, numberToWords, isDarkMode }) => {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Total Balance Card */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 p-6 border border-[var(--border-color)] bg-[var(--bg-card)] flex flex-col items-center justify-center relative shadow-sm hover:border-[var(--accent-gold)] transition-all duration-300">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <Shield size={18} className="text-[var(--accent-gold)]" />
                    <h3 className="text-sm font-display font-bold tracking-widest text-[var(--accent-gold)] uppercase">
                        TỔNG TÀI SẢN ỦY THÁC
                    </h3>
                    <button
                        onClick={toggleAllVisibility}
                        aria-label="Hiện/Ẩn tất cả số tiền"
                        className="p-1 hover:text-[var(--accent-gold)] text-[var(--text-muted)] transition focus:outline-none"
                    >
                        {isAnyAmountVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                </div>

                <div className="text-center cursor-pointer select-none" onClick={() => toggleVisibility('total')}>
                    <p className="text-3xl md:text-4xl font-mono font-bold text-[var(--text-primary)] tracking-tight mb-2 hover:text-[var(--accent-gold)] transition-colors">
                        {visibility.total ? formatVND(totalAmount) : '••••••••'}
                    </p>
                    <p className="text-xs uppercase tracking-wider font-display text-[var(--text-muted)]">
                        {visibility.total ? numberToWords(totalAmount) : 'Nhấp để xem bằng chữ'}
                    </p>
                </div>
            </div>

            {/* Category Cards */}
            {categories.map((cat) => (
                <div
                    key={cat.value}
                    className="p-5 border border-[var(--border-color)] bg-[var(--bg-card)] flex flex-col items-center justify-center h-full relative shadow-sm hover:border-[var(--accent-gold)] hover:-translate-y-1 transition-all duration-300 cursor-pointer select-none group"
                    onClick={() => toggleVisibility(cat.value)}
                >
                    <span className="mb-2 opacity-95 transition-transform duration-300 group-hover:scale-110">{cat.icon}</span>
                    <h3 className="text-[10px] font-sans font-bold tracking-widest text-[var(--text-muted)] text-center uppercase mb-2 group-hover:text-[var(--accent-gold)] transition-colors duration-300">
                        {cat.label}
                    </h3>
                    <p
                        className="text-lg font-mono font-bold tracking-tight transition-colors duration-300 group-hover:text-[var(--accent-gold)]"
                        style={{ color: isDarkMode ? '#FFFFFF' : '#0F172A' }}
                    >
                        {visibility[cat.value] ? formatVND(allocations[cat.value] || 0) : '••••••••'}
                    </p>
                </div>
            ))}
        </section>
    );
};

export default AllocationHeader;

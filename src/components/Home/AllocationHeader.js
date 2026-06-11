import React from 'react';
import { Eye, EyeOff, Shield } from 'lucide-react';

const AllocationHeader = ({ categories, totalAmount, allocations, visibility, toggleVisibility, toggleAllVisibility, isAnyAmountVisible, formatVND, numberToWords, isDarkMode }) => {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Total Balance Card */}
            <div className="p-6 border border-[var(--border-color)] col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col items-center justify-center bg-[var(--bg-secondary)] relative shadow-sm">
                {/* Gold accent top bar */}
                <div className="absolute top-0 left-0 w-full h-[3px] bg-[var(--accent-gold)]" />
                
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
                    <p className="text-3xl md:text-4xl font-mono font-bold text-[var(--text-primary)] tracking-tight mb-2">
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
                    className="p-5 border border-[var(--border-color)] flex flex-col items-center justify-center bg-[var(--bg-secondary)] hover:border-[var(--accent-gold)] transition duration-200 cursor-pointer relative shadow-sm select-none"
                    onClick={() => toggleVisibility(cat.value)}
                >
                    <div className="absolute top-0 left-0 w-full h-[2px] opacity-40" style={{ backgroundColor: cat.color }} />
                    <span className="mb-2 opacity-90">{cat.icon}</span>
                    <h3 className="text-[10px] font-sans font-bold tracking-widest text-[var(--text-muted)] text-center uppercase mb-2">
                        {cat.label}
                    </h3>
                    <p
                        className="text-lg font-mono font-bold tracking-tight"
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

import React from 'react';
import { Eye, EyeOff, Shield, PlusCircle } from 'lucide-react';
import feedback from '../../utils/feedback';

const AllocationHeader = ({
    categories,
    totalAmount,
    allocations,
    visibility,
    toggleVisibility,
    toggleAllVisibility,
    isAnyAmountVisible,
    formatVND,
    numberToWords,
    isDarkMode,
    onDeposit
}) => {
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
                        onClick={() => {
                            feedback.tap();
                            toggleAllVisibility();
                        }}
                        aria-label="Hiện/Ẩn tất cả số tiền"
                        title={isAnyAmountVisible ? "Ẩn tất cả số tiền" : "Hiện tất cả số tiền"}
                        className="p-1 hover:text-[var(--accent-gold)] text-[var(--text-muted)] transition focus:outline-none"
                    >
                        {isAnyAmountVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                <div
                    className="text-center cursor-pointer select-none"
                    onClick={() => {
                        feedback.tap();
                        toggleVisibility('total');
                    }}
                    title="Nhấp để ẩn/hiện số dư"
                >
                    <p className="text-3xl md:text-4xl font-mono font-bold text-[var(--text-primary)] tracking-tight mb-2 hover:text-[var(--accent-gold)] transition-colors">
                        {visibility.total ? formatVND(totalAmount) : '••••••••'}
                    </p>
                    <p className="text-xs uppercase tracking-wider font-display text-[var(--text-muted)]">
                        {visibility.total ? numberToWords(totalAmount) : 'Nhấp để hiển thị bằng chữ'}
                    </p>
                </div>

                {onDeposit && (
                    <button
                        onClick={() => {
                            feedback.tap();
                            onDeposit();
                        }}
                        className="mt-4 btn-gold-outline py-2 px-4 text-xs font-display font-bold uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all"
                    >
                        <PlusCircle size={14} /> Nạp thêm ngân sách
                    </button>
                )}
            </div>

            {/* Category Cards */}
            {categories.map((cat) => (
                <div
                    key={cat.value}
                    className="p-5 border border-[var(--border-color)] bg-[var(--bg-card)] flex flex-col items-center justify-center h-full relative shadow-sm hover:border-[var(--accent-gold)] hover:-translate-y-1 transition-all duration-300 cursor-pointer select-none group"
                    onClick={() => {
                        feedback.tap();
                        toggleVisibility(cat.value);
                    }}
                    title="Nhấp để ẩn/hiện số tiền danh mục"
                >
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-muted)]">
                        {visibility[cat.value] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </div>
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

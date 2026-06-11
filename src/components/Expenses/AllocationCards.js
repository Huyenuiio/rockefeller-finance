import React from 'react';

const AllocationCards = ({ categories, visibility, toggleVisibility, allocations, formatVND, isDarkMode }) => {
    return (
        <section className="mb-6">
            <h2 className="text-xs font-display font-bold tracking-widest text-[var(--accent-gold)] mb-3 uppercase">
                PHÂN BỔ NGÂN SÁCH HIỆN TẠI
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((cat) => (
                    <div
                        key={cat.value}
                        className="p-4 border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-[var(--accent-gold)] transition duration-200 cursor-pointer relative shadow-sm select-none"
                        onClick={() => toggleVisibility(cat.value)}
                    >
                        <div className="absolute top-0 left-0 w-full h-[2px] opacity-40" style={{ backgroundColor: cat.color }} />
                        <div className="flex items-center gap-2 mb-2 pointer-events-none opacity-80">
                            <span className="scale-75 origin-left">{cat.icon}</span>
                            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[var(--text-muted)]">
                                {cat.label.replace(/\s\(\d+%\)/, '')}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-base font-mono font-bold tracking-tight" style={{ color: isDarkMode ? '#FFFFFF' : '#0F172A' }}>
                                {visibility[cat.value] ? formatVND(allocations[cat.value] || 0) : '••••••••'}
                            </span>
                            <span className="text-[9px] font-sans font-bold text-[var(--text-muted)] uppercase tracking-widest mt-0.5">Số dư khả dụng</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AllocationCards;

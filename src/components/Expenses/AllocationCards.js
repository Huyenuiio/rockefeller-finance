import React from 'react';

const AllocationCards = ({ categories, visibility, toggleVisibility, allocations, formatVND, isDarkMode }) => {
    return (
        <section className="mb-6">
            <div className="glass-card p-4 rounded-2xl shadow-xl">
                <h2 className="text-lg font-bold mb-2">Phân bổ ngân sách</h2>
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {categories.map((cat) => (
                        <div
                            key={cat.value}
                            className={`rounded-2xl p-4 shadow-sm border transition-all hover:shadow-md cursor-pointer`}
                            onClick={() => toggleVisibility(cat.value)}
                            style={{
                                borderColor: isDarkMode ? `${cat.color}44` : `${cat.color}22`,
                                background: isDarkMode
                                    ? `linear-gradient(135deg, ${cat.color}11 0%, #1f2937 100%)`
                                    : `linear-gradient(135deg, ${cat.color}08 0%, #fff 100%)`,
                            }}
                        >
                            <div className="flex items-center gap-2 mb-2 pointer-events-none opacity-80">
                                <span className="scale-75 origin-left">{cat.icon}</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider">{cat.label.replace(/\s\(\d+%\)/, '')}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-black" style={{ color: cat.color }}>
                                    {visibility[cat.value] ? formatVND(allocations[cat.value] || 0) : '••••••••'}
                                </span>
                                <span className="text-[9px] font-bold opacity-40 uppercase tracking-tighter">Số dư khả dụng</span>
                            </div>
                        </div>
                    ))}
                </section>
            </div>
        </section>
    );
};

export default AllocationCards;

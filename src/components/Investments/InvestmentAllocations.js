import React from 'react';
import { BookOpen, ShieldAlert } from 'lucide-react';

const InvestmentAllocations = ({ allocations, formatVND, numberToWords }) => {
    return (
        <section className="mb-6">
            <h2 className="text-xs font-display font-bold tracking-widest text-[var(--accent-gold)] mb-3 uppercase">
                PHÂN BỔ QUỸ TÀI SẢN ĐẦU TƯ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Self Investment */}
                <div className="p-5 border border-[var(--border-color)] bg-[var(--bg-secondary)] relative shadow-sm">
                    <div className="absolute top-0 left-0 w-[4px] h-full bg-[#f59e42]" />
                    <div className="flex items-center gap-2 mb-2 pl-2">
                        <BookOpen size={16} className="text-[#f59e42]" />
                        <span className="text-xs font-display font-bold tracking-wider text-[#f59e42] uppercase">
                            Đầu tư bản thân (15%)
                        </span>
                    </div>
                    <div className="pl-2">
                        <div className="text-2xl font-mono font-bold text-[var(--text-primary)]">
                            {formatVND(allocations.selfInvestment)}
                        </div>
                        <div className="text-[10px] font-display uppercase tracking-wider text-[var(--text-muted)] mt-1">
                            {numberToWords(allocations.selfInvestment)}
                        </div>
                    </div>
                </div>

                {/* Emergency */}
                <div className="p-5 border border-[var(--border-color)] bg-[var(--bg-secondary)] relative shadow-sm">
                    <div className="absolute top-0 left-0 w-[4px] h-full bg-[#a855f7]" />
                    <div className="flex items-center gap-2 mb-2 pl-2">
                        <ShieldAlert size={16} className="text-[#a855f7]" />
                        <span className="text-xs font-display font-bold tracking-wider text-[#a855f7] uppercase">
                            Dự phòng linh hoạt (10%)
                        </span>
                    </div>
                    <div className="pl-2">
                        <div className="text-2xl font-mono font-bold text-[var(--text-primary)]">
                            {formatVND(allocations.emergency)}
                        </div>
                        <div className="text-[10px] font-display uppercase tracking-wider text-[var(--text-muted)] mt-1">
                            {numberToWords(allocations.emergency)}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InvestmentAllocations;

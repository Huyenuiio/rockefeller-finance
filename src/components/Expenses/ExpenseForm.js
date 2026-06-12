import React from 'react';
import { Coins, Tag, FileText, MapPin, Calendar, PlusCircle } from 'lucide-react';

const ExpenseForm = ({
    handleExpenseSubmit,
    amount, setAmount,
    category, setCategory,
    purpose, setPurpose,
    location, setLocation,
    date, setDate,
    isSubmitting,
    categories,
    allocations,
    formatVND,
    numberToWords,
    isDarkMode
}) => {
    return (
        <div className="bg-[var(--bg-secondary)]">
            <div className="flex items-center gap-3 mb-6">
                <PlusCircle size={18} className="text-[var(--accent-gold)]" />
                <h2 className="text-xs font-display font-bold tracking-widest text-[var(--accent-gold)] uppercase">
                    THÊM GIAO DỊCH
                </h2>
            </div>

            <form onSubmit={handleExpenseSubmit} className="space-y-4">
                <div className="space-y-4">
                    {/* Amount Field */}
                    <div>
                        <label className="flex items-center gap-2 text-[10px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5" htmlFor="amount">
                            <Coins size={12} /> SỐ TIỀN CHI TIÊU (VND)
                        </label>
                        <input
                            id="amount"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={amount}
                            onChange={(e) => {
                                const cleanVal = e.target.value.replace(/\D/g, '');
                                setAmount(cleanVal);
                            }}
                            className="rockefeller-input font-mono text-xl font-bold py-3"
                            placeholder="0"
                            required
                        />

                        {/* Verifying Helper Area */}
                        {amount && parseInt(amount) > 0 && (
                            <div className="mt-2.5 p-3 border border-[var(--border-color)] bg-[rgba(var(--accent-gold-rgb),0.02)] flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)]">Xác nhận</span>
                                    <span className="text-xs font-mono font-bold text-[var(--text-primary)]">{formatVND(amount)}</span>
                                </div>
                                <p className="text-[10px] font-display text-[var(--accent-gold)] leading-tight uppercase tracking-wider">
                                    {numberToWords(parseInt(amount))}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Category Field */}
                    <div>
                        <label className="flex items-center gap-2 text-[10px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5" htmlFor="category">
                            <Tag size={12} /> HẠN MỨC QUỸ PHÂN BỔ
                        </label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="rockefeller-input text-xs font-medium bg-[var(--bg-secondary)] py-2.5"
                            required
                        >
                            <option value="">Chọn danh mục</option>
                            {categories.map((cat) => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label.replace(/\s\(\d+%\)/, '')}
                                    {allocations[cat.value] > 0 ? ` (${formatVND(allocations[cat.value])})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Purpose Field */}
                    <div>
                        <label className="flex items-center gap-2 text-[10px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5" htmlFor="purpose">
                            <FileText size={12} /> CHI TIẾT SỬ DỤNG VỐN
                        </label>
                        <input
                            id="purpose"
                            type="text"
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            className="rockefeller-input text-xs"
                            placeholder="Ví dụ: Ăn sáng, Sửa xe..."
                            required
                        />
                    </div>

                    {/* Location & Date Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-[10px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5" htmlFor="location">
                                <MapPin size={12} /> ĐỊA ĐIỂM
                            </label>
                            <input
                                id="location"
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="rockefeller-input text-xs"
                                placeholder="VinMart, Quán phở..."
                                required
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-[10px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5" htmlFor="date">
                                <Calendar size={12} /> NGÀY GIAO DỊCH
                            </label>
                            <input
                                id="date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="rockefeller-input text-xs font-mono"
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-gold-primary py-3.5 text-xs uppercase tracking-widest font-bold mt-2"
                >
                    {isSubmitting ? (
                        <div className="flex items-center justify-center gap-3">
                            <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent" />
                            ĐANG XỬ LÝ...
                        </div>
                    ) : (
                        'XÁC NHẬN CHI TIÊU'
                    )}
                </button>
            </form>
        </div>
    );
};

export default ExpenseForm;

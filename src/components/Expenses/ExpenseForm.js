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
        <div className={`p-6 rounded-[1.8rem] shadow-xl ${isDarkMode ? 'bg-gray-800/40' : 'bg-white'}`}>
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                    <PlusCircle size={24} />
                </div>
                <h2 className="text-xl font-black tracking-tight">Thêm giao dịch</h2>
            </div>

            <form onSubmit={handleExpenseSubmit} className="space-y-5">
                <div className="space-y-4">
                    {/* Amount Field */}
                    <div className="group">
                        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-50 mb-2" htmlFor="amount">
                            <Coins size={14} /> Số tiền (VND)
                        </label>
                        <input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className={`input-modern w-full ${isDarkMode ? 'dark' : ''} !rounded-2xl !py-4 !text-2xl !font-black !tracking-tighter transition-all focus:scale-[1.01] focus:border-blue-500`}
                            placeholder="0"
                            required
                            min="1"
                            inputMode="numeric"
                        />

                        {/* Verifying Helper Area */}
                        {amount && parseInt(amount) > 0 && (
                            <div className={`mt-3 p-3 rounded-2xl border flex flex-col gap-1 animate-in slide-in-from-top-2 duration-300 ${isDarkMode ? 'bg-blue-500/5 border-blue-500/10 text-blue-300' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
                                <div className="flex items-center justify-between opacity-80">
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Xác nhận nhanh</span>
                                    <span className="text-xs font-black">{formatVND(amount)}</span>
                                </div>
                                <p className="text-[11px] font-bold leading-tight uppercase tracking-tight">
                                    {numberToWords(parseInt(amount))}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Category Field */}
                    <div>
                        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-50 mb-2" htmlFor="category">
                            <Tag size={14} /> Danh mục
                        </label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className={`input-modern w-full ${isDarkMode ? 'dark' : ''} !rounded-2xl !py-3 !font-bold transition-all appearance-none cursor-pointer focus:scale-[1.01]`}
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
                        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-50 mb-2" htmlFor="purpose">
                            <FileText size={14} /> Mục đích chi tiêu
                        </label>
                        <input
                            id="purpose"
                            type="text"
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            className={`input-modern w-full ${isDarkMode ? 'dark' : ''} !rounded-2xl !py-3 font-medium transition-all focus:scale-[1.01]`}
                            placeholder="Ví dụ: Ăn sáng, Sửa xe..."
                            required
                        />
                    </div>

                    {/* Location & Date Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-50 mb-2" htmlFor="location">
                                <MapPin size={14} /> Vị trí
                            </label>
                            <input
                                id="location"
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className={`input-modern w-full ${isDarkMode ? 'dark' : ''} !rounded-2xl !py-3 text-sm transition-all focus:scale-[1.01]`}
                                placeholder="VinMart, Quán phở..."
                                required
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-50 mb-2" htmlFor="date">
                                <Calendar size={14} /> Ngày
                            </label>
                            <input
                                id="date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className={`input-modern w-full ${isDarkMode ? 'dark' : ''} !rounded-2xl !py-3 text-sm transition-all appearance-none focus:scale-[1.01]`}
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-modern w-full !rounded-2xl !py-4 shadow-xl shadow-blue-500/20 active:scale-95 transition-all text-base tracking-wide"
                >
                    {isSubmitting ? (
                        <div className="flex items-center justify-center gap-3">
                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                            Đang xử lý...
                        </div>
                    ) : (
                        'Xác nhận chi tiêu'
                    )}
                </button>
            </form>
        </div>
    );
};

export default ExpenseForm;

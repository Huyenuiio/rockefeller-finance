import React from 'react';
import { Wallet, PlusCircle, LayoutGrid, LayoutList } from 'lucide-react';

const BudgetBalance = ({
    initialBudget,
    visibility,
    toggleVisibility,
    toggleAllVisibility,
    isAnyAmountVisible,
    formatVND,
    isDarkMode,
    newBudget,
    setNewBudget,
    handleBudgetSubmit,
    isSubmitting
}) => {
    return (
        <section className="mb-6">
            <div className={`p-8 rounded-[2.5rem] shadow-xl border ${isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white border-blue-50'}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                                <Wallet size={24} />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight">Số dư ngân sách</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <p className="text-4xl font-black text-blue-600 dark:text-blue-400 tracking-tighter" onClick={() => toggleVisibility('budgetBalance')}>
                                {visibility.budgetBalance ? formatVND(initialBudget) : '••••••••'}
                            </p>
                            <button
                                onClick={toggleAllVisibility}
                                className={`p-2 rounded-xl transition-all ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-50 hover:bg-blue-100'}`}
                                title={isAnyAmountVisible ? "Ẩn tất cả" : "Hiện tất cả"}
                            >
                                {isAnyAmountVisible ? <LayoutList size={18} /> : <LayoutGrid size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="w-full md:w-96">
                        <form onSubmit={handleBudgetSubmit} className="relative group">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4 mb-1 block">Cập nhật ngân sách / Nạp thêm</label>
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <input
                                        id="initialBudget"
                                        type="number"
                                        value={newBudget}
                                        onChange={(e) => setNewBudget(e.target.value)}
                                        className={`input-modern w-full !rounded-2xl !py-3 !pl-10 !text-sm font-bold ${isDarkMode ? 'dark' : ''} border-2 focus:border-blue-500 transition-all`}
                                        placeholder="Nhập số tiền..."
                                        required
                                        min="1"
                                        inputMode="numeric"
                                    />
                                    <PlusCircle size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-500 opacity-50" />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn-modern !rounded-2xl !py-3 px-6 !shadow-none active:scale-95 transition-all text-sm whitespace-nowrap"
                                >
                                    {isSubmitting ? "..." : "Cập nhật"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BudgetBalance;

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
            <div className="p-8 border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-sm relative">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-[var(--accent-gold)]" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <Wallet size={18} className="text-[var(--accent-gold)]" />
                            <h2 className="text-xs font-display font-bold tracking-widest text-[var(--accent-gold)] uppercase">
                                SỐ DƯ NGÂN SÁCH
                            </h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <p className="text-3xl font-mono font-bold text-[var(--text-primary)] tracking-tight cursor-pointer" onClick={() => toggleVisibility('budgetBalance')}>
                                {visibility.budgetBalance ? formatVND(initialBudget) : '••••••••'}
                            </p>
                            <button
                                onClick={toggleAllVisibility}
                                className="p-1.5 border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition focus:outline-none"
                                title={isAnyAmountVisible ? "Ẩn tất cả" : "Hiện tất cả"}
                            >
                                {isAnyAmountVisible ? <LayoutList size={14} /> : <LayoutGrid size={14} />}
                            </button>
                        </div>
                    </div>

                    <div className="w-full md:w-96">
                        <form onSubmit={handleBudgetSubmit} className="relative group">
                            <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1.5 block">
                                CẬP NHẬT NGÂN SÁCH
                            </label>
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <input
                                        id="initialBudget"
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={newBudget}
                                        onChange={(e) => {
                                            const cleanVal = e.target.value.replace(/\D/g, '');
                                            setNewBudget(cleanVal);
                                        }}
                                        className="rockefeller-input pl-10 text-xs font-mono"
                                        placeholder="Nhập số tiền..."
                                        required
                                    />
                                    <PlusCircle size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--accent-gold)]" />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn-gold-primary py-2.5 px-4 text-xs font-bold uppercase tracking-widest"
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

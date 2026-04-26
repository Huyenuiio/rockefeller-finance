import React from 'react';
import { Eye, EyeOff, Wallet, ArrowUpRight, TrendingDown } from 'lucide-react';

const ExpenseDashboardHeader = ({
    initialBudget,
    totalExpenses,
    visibility,
    toggleVisibility,
    formatVND,
    isDarkMode,
    onDeposit
}) => {
    return (
        <div className={`relative overflow-hidden p-8 rounded-[2.5rem] shadow-2xl transition-all duration-500 ${isDarkMode ? 'bg-slate-900 border border-white/5 shadow-blue-500/5' : 'bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-700'} text-white group`}>
            {/* Background elements */}
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white opacity-[0.03] rounded-full blur-3xl pointer-events-none group-hover:opacity-[0.05] transition-opacity" />
            <div className="absolute bottom-[-10%] left-[-5%] w-48 h-48 bg-blue-300 opacity-[0.02] rounded-full blur-2xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                {/* Balance Info */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-white/10 w-fit px-4 py-2 rounded-2xl backdrop-blur-md border border-white/10 group-hover:bg-white/15 transition-all">
                        <Wallet size={18} className="text-yellow-300" />
                        <span className="text-xs font-bold uppercase tracking-widest opacity-80">Ngân sách hiện tại</span>
                        <button
                            onClick={() => toggleVisibility('budgetBalance')}
                            className="p-1 hover:bg-white/20 rounded-full transition-all active:scale-95"
                        >
                            {visibility.budgetBalance ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    <div className="space-y-1">
                        <p className="text-5xl font-black tracking-tighter">
                            {visibility.budgetBalance ? formatVND(initialBudget) : '••••••••'}
                        </p>
                        <div className="flex items-center gap-2 text-xs font-medium opacity-70">
                            <ArrowUpRight size={14} className="text-emerald-400" />
                            <span>+2.4% so với tháng trước</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-[10px] font-bold border border-white/10">JD</div>
                        <div className="w-8 h-8 rounded-full bg-blue-400/20 backdrop-blur-md flex items-center justify-center text-[10px] font-bold border border-white/10">RF</div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="w-full md:w-auto flex flex-col gap-4">
                    <div className="bg-white/10 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-inner group-hover:border-white/20 transition-all">
                        <div className="flex items-center justify-between gap-8 mb-3">
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Đã chi tiêu</span>
                            <TrendingDown size={14} className="text-rose-400" />
                        </div>
                        <p className="text-xl font-black tracking-tight">
                            {visibility.budgetBalance ? formatVND(totalExpenses) : '••••••••'}
                        </p>
                    </div>

                    <button
                        onClick={onDeposit}
                        className={`w-full py-3 font-bold rounded-xl transition-all active:scale-95 shadow-lg ${isDarkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-white text-blue-600 hover:bg-opacity-90'}`}
                    >
                        Nạp thêm tiền
                    </button>
                </div>
            </div>

            <div className="absolute bottom-4 right-8 opacity-20 text-[10px] font-bold tracking-[0.2em] uppercase pointer-events-none italic">
                Rockefeller Gold Member
            </div>
        </div>
    );
};

export default ExpenseDashboardHeader;

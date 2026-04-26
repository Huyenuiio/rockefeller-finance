import React from 'react';
import { Trash2, ShoppingBag, PieChart, Heart, BookOpen, AlertCircle, MapPin, Calendar } from 'lucide-react';

const ExpenseHistory = ({
    sortedExpenses,
    handleDeleteExpense,
    formatVND,
    isDarkMode,
}) => {
    const getCategoryIcon = (category) => {
        switch (category?.toLowerCase()) {
            case 'essentials':
            case 'thiết yếu':
                return { icon: <ShoppingBag size={20} />, color: 'bg-orange-500', text: 'text-orange-500' };
            case 'savings':
            case 'tiết kiệm':
                return { icon: <PieChart size={20} />, color: 'bg-blue-500', text: 'text-blue-500' };
            case 'charity':
            case 'cho đi':
                return { icon: <Heart size={20} />, color: 'bg-rose-500', text: 'text-rose-500' };
            case 'selfinvestment':
            case 'đầu tư bản thân':
                return { icon: <BookOpen size={20} />, color: 'bg-emerald-500', text: 'text-emerald-500' };
            case 'emergency':
            case 'khẩn cấp':
                return { icon: <AlertCircle size={20} />, color: 'bg-amber-500', text: 'text-amber-500' };
            default:
                return { icon: <ShoppingBag size={20} />, color: 'bg-gray-500', text: 'text-gray-500' };
        }
    };

    return (
        <div className="flex flex-col">
            {sortedExpenses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 opacity-30">
                    <ShoppingBag size={48} className="mb-4" />
                    <p className="font-bold">Chưa có giao dịch nào</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {sortedExpenses.map((expense, index) => {
                        const { icon, color, text } = getCategoryIcon(expense.category);
                        return (
                            <div key={index} className={`group p-4 flex items-center gap-4 transition-all cursor-default ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                                {/* Category Icon */}
                                <div className={`w-12 h-12 rounded-2xl ${color} bg-opacity-10 ${text} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
                                    {icon}
                                </div>

                                {/* Details */}
                                <div className="flex-1 flex flex-col min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-0.5">
                                        <h3 className="font-bold text-base truncate group-hover:text-blue-500 transition-colors">
                                            {expense.purpose}
                                        </h3>
                                        <span className="font-black text-rose-500 dark:text-rose-400 whitespace-nowrap">
                                            -{formatVND(expense.amount)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 opacity-60">
                                        <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider">
                                            <MapPin size={10} /> {expense.location}
                                        </div>
                                        <div className="w-1 h-1 rounded-full bg-current opacity-30" />
                                        <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider">
                                            <Calendar size={10} /> {expense.date}
                                        </div>
                                    </div>
                                </div>

                                {/* Delete Button */}
                                <button
                                    onClick={() => handleDeleteExpense(index)}
                                    className="p-2.5 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all transform hover:rotate-12"
                                    aria-label="Xóa chi tiêu"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ExpenseHistory;

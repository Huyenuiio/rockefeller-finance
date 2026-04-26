import React, { useEffect, useRef } from 'react';
import { X, Wallet, PlusCircle, AlertCircle } from 'lucide-react';

const DepositModal = ({
    isOpen,
    onClose,
    newBudget,
    setNewBudget,
    handleBudgetSubmit,
    isSubmitting,
    isDarkMode,
    formatVND,
    numberToWords
}) => {
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => {
                inputRef.current.focus();
            }, 100);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
            {/* Backdrop with extreme blur */}
            <div
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-[12px] transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={`relative w-full max-w-lg overflow-hidden rounded-[2.5rem] shadow-2xl transition-all zoom-in-95 duration-300 ${isDarkMode ? 'bg-gray-900 border border-white/10' : 'bg-white border border-blue-50'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Decoration */}
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-10 pointer-events-none" />

                <button
                    onClick={onClose}
                    className={`absolute top-6 right-6 p-2 rounded-full transition-all active:scale-95 z-10 ${isDarkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                        }`}
                >
                    <X size={20} />
                </button>

                <div className="p-8 sm:p-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-500 shadow-inner">
                            <Wallet size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Nạp thêm tiền</h2>
                            <p className="text-sm font-medium opacity-50 uppercase tracking-widest">Cập nhật ngân sách ví</p>
                        </div>
                    </div>

                    <form onSubmit={(e) => {
                        handleBudgetSubmit(e);
                        onClose();
                    }} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest opacity-40 ml-1 block">Số tiền cần nạp (VND)</label>
                            <div className="relative group">
                                <input
                                    ref={inputRef}
                                    type="number"
                                    value={newBudget}
                                    onChange={(e) => setNewBudget(e.target.value)}
                                    className={`w-full bg-transparent border-b-2 py-4 pl-10 text-3xl font-black tracking-tighter transition-all focus:outline-none ${isDarkMode ? 'border-gray-800 focus:border-blue-500' : 'border-gray-200 focus:border-blue-500'
                                        }`}
                                    placeholder="0"
                                    required
                                    min="1"
                                    inputMode="numeric"
                                />
                                <PlusCircle size={22} className="absolute left-0 top-1/2 -translate-y-1/2 text-blue-500" />
                            </div>

                            {/* Verifying Helper Area */}
                            {newBudget && parseInt(newBudget) > 0 && (
                                <div className="mt-4 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-1 animate-in slide-in-from-top-2 duration-300">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Số tiền xác nhận</span>
                                        <span className="text-sm font-black text-blue-600 dark:text-blue-400">{formatVND(newBudget)}</span>
                                    </div>
                                    <p className="text-xs font-bold text-blue-700 dark:text-blue-300">
                                        {numberToWords(parseInt(newBudget))}
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center gap-2 mt-2 px-1">
                                <AlertCircle size={12} className="text-blue-500" />
                                <span className="text-[10px] font-medium opacity-50 italic">Số tiền này sẽ được cộng dồn vào ngân sách hiện tại của bạn.</span>
                            </div>
                        </div>

                        <div className="pt-4 flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className={`flex-1 py-4 font-bold rounded-2xl transition-all active:scale-95 ${isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                    }`}
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-[2] py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? "Đang xử lý..." : "Xác nhận nạp tiền"}
                                {!isSubmitting && <PlusCircle size={18} />}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer Insight */}
                <div className={`px-10 py-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] opacity-30 ${isDarkMode ? 'bg-black/20' : 'bg-blue-50/50'}`}>
                    Rockefeller Finance Security Protocol
                </div>
            </div>
        </div>
    );
};

export default DepositModal;

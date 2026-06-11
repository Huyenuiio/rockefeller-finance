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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
            {/* Backdrop with dark blur */}
            <div
                className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className="relative w-full max-w-lg overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-2xl transition-all zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Gold top accent line */}
                <div className="absolute top-0 left-0 w-full h-[4px] bg-[var(--accent-gold)]" />

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-1.5 text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition z-10"
                >
                    <X size={18} />
                </button>

                <div className="p-8 sm:p-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-2.5 border border-[var(--border-color)] text-[var(--accent-gold)]">
                            <Wallet size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-display font-bold text-[var(--accent-gold)] uppercase tracking-wider">
                                NẠP THÊM NGÂN SÁCH
                            </h2>
                            <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-[var(--text-muted)]">
                                Cập nhật ngân quỹ dự trữ
                            </p>
                        </div>
                    </div>

                    <form onSubmit={(e) => {
                        handleBudgetSubmit(e);
                        onClose();
                    }} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-[var(--text-muted)] block">
                                SỐ TIỀN CẦN NẠP (VND)
                            </label>
                            <div className="relative">
                                <input
                                    ref={inputRef}
                                    type="number"
                                    value={newBudget}
                                    onChange={(e) => setNewBudget(e.target.value)}
                                    className="rockefeller-input pl-10 text-2xl font-mono font-bold py-3"
                                    placeholder="0"
                                    required
                                    min="1"
                                    inputMode="numeric"
                                />
                                <PlusCircle size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--accent-gold)]" />
                            </div>

                            {/* Verifying Helper Area */}
                            {newBudget && parseInt(newBudget) > 0 && (
                                <div className="mt-3 p-3.5 border border-[var(--border-color)] bg-[rgba(var(--accent-gold-rgb),0.02)] space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[var(--text-muted)]">Số tiền xác nhận</span>
                                        <span className="text-xs font-mono font-bold text-[var(--text-primary)]">{formatVND(newBudget)}</span>
                                    </div>
                                    <p className="text-[10px] font-sans text-[var(--accent-gold)] uppercase tracking-widest leading-tight">
                                        {numberToWords(parseInt(newBudget))}
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center gap-2 mt-2 px-1">
                                <AlertCircle size={12} className="text-[var(--accent-gold)] shrink-0" />
                                <span className="text-[9px] font-sans uppercase tracking-widest text-[var(--text-muted)]">
                                    Số tiền này sẽ được cộng dồn trực tiếp vào ngân quỹ.
                                </span>
                            </div>
                        </div>

                        <div className="pt-3 flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 btn-gold-outline py-3.5 text-xs font-bold uppercase tracking-widest"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-[2] btn-gold-primary py-3.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? "Đang xử lý..." : "Xác nhận nạp tiền"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer Insight */}
                <div className="px-10 py-3 text-center text-[9px] font-display font-bold uppercase tracking-[0.2em] opacity-30 border-t border-[var(--border-color)] bg-black text-[var(--text-muted)]">
                    ROCKEFELLER TREASURY SECURITY PROTOCOL
                </div>
            </div>
        </div>
    );
};

export default DepositModal;

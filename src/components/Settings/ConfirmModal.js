import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ showConfirm, isDarkMode, isSubmitting, closeConfirm, handleAction }) => {
    if (!showConfirm.open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 px-4"
            aria-modal="true"
            role="dialog"
        >
            {/* Single Border Clean Modal */}
            <div
                className="w-full max-w-sm border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 relative shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col items-center"
                onClick={e => e.stopPropagation()}
            >
                <div className={`w-12 h-12 flex items-center justify-center border mb-4 rounded-none ${
                    showConfirm.type === 'deleteAccount' 
                        ? 'border-red-500/30 bg-red-500/5 text-red-500' 
                        : 'border-amber-500/30 bg-amber-500/5 text-amber-500'
                }`}>
                    <AlertTriangle size={24} />
                </div>

                <h4 className="text-sm font-display font-bold uppercase tracking-wider text-[var(--accent-gold)] text-center mb-3">
                    {showConfirm.type === 'deleteAccount'
                        ? 'XÁC NHẬN XÓA TÀI KHOẢN'
                        : 'XÁC NHẬN ĐẶT LẠI NGÂN QUỸ'}
                </h4>
                
                <p className="mb-6 text-center text-xs text-[var(--text-muted)] leading-relaxed">
                    {showConfirm.type === 'deleteAccount'
                        ? 'Hành động này sẽ xóa vĩnh viễn tài khoản của bạn khỏi hệ thống. Thao tác không thể hoàn tác!'
                        : 'Toàn bộ số dư ngân quỹ sẽ được đưa về giá trị khởi điểm 0 VND. Thao tác không thể hoàn tác!'}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <button
                        onClick={() => handleAction(showConfirm.type)}
                        className={`w-full sm:flex-1 py-2.5 text-xs font-display font-bold uppercase tracking-wider transition-all duration-200 border
                            ${showConfirm.type === 'deleteAccount'
                                ? 'bg-red-600 hover:bg-red-500 border-red-700 text-white dark:bg-red-950/40 dark:hover:bg-red-900/60 dark:border-red-500/30 dark:text-red-400 dark:hover:text-red-300'
                                : 'bg-amber-500 hover:bg-amber-400 border-amber-600 text-black dark:bg-amber-950/40 dark:hover:bg-amber-900/60 dark:border-amber-500/30 dark:text-amber-400 dark:hover:text-amber-300'
                            }
                            ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                                XỬ LÝ...
                            </span>
                        ) : (
                            showConfirm.type === 'deleteAccount' ? 'XÓA TÀI KHOẢN' : 'ĐẶT LẠI'
                        )}
                    </button>
                    
                    <button
                        onClick={closeConfirm}
                        className="w-full sm:flex-1 btn-gold-outline py-2.5 text-xs font-display font-bold uppercase tracking-wider transition-all duration-200 sm:order-first"
                        disabled={isSubmitting}
                    >
                        HỦY BỎ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;

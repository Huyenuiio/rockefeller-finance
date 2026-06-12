import React from 'react';

const ConfirmModal = ({ showConfirm, isDarkMode, isSubmitting, closeConfirm, handleAction }) => {
    if (!showConfirm.open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm animate-in fade-in duration-200"
            aria-modal="true"
            role="dialog"
        >
            <div
                className="w-[95vw] max-w-sm border border-[var(--border-color)] bg-[var(--bg-secondary)] p-8 relative shadow-2xl animate-in zoom-in-95 duration-200"
            >
                {/* Accent Top Line */}
                <div className="absolute top-0 left-0 w-full h-[4px] bg-[var(--accent-gold)]" />

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
                <div className="flex gap-3">
                    <button
                        onClick={closeConfirm}
                        className="flex-1 btn-gold-outline py-2.5 text-xs font-display font-bold uppercase tracking-wider"
                        disabled={isSubmitting}
                    >
                        HỦY BỎ
                    </button>
                    <button
                        onClick={() => handleAction(showConfirm.type)}
                        className={`flex-1 py-2.5 text-xs font-display font-bold uppercase tracking-wider transition-all
                            ${showConfirm.type === 'deleteAccount'
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-amber-600 text-white hover:bg-amber-700'
                            }
                            ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                XỬ LÝ...
                            </span>
                        ) : (
                            showConfirm.type === 'deleteAccount' ? 'XÓA TÀI KHOẢN' : 'ĐẶT LẠI'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;

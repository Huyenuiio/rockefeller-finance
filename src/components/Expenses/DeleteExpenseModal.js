import React from 'react';
import { Trash2 } from 'lucide-react';

const DeleteExpenseModal = ({
    isOpen,
    onClose,
    expense,
    onConfirm,
    isSubmitting,
    formatVND
}) => {
    React.useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || !expense) return null;

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="w-full max-w-sm bg-[var(--bg-secondary)] border border-red-500/40 p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-12 h-12 flex items-center justify-center border border-red-500/40 bg-red-500/10 text-red-500 mb-4">
                    <Trash2 size={24} />
                </div>

                <h3 className="text-sm font-display font-bold uppercase tracking-wider text-[var(--accent-gold)] text-center mb-2">
                    XÁC NHẬN XÓA GIAO DỊCH
                </h3>

                <p className="text-xs text-[var(--text-muted)] text-center mb-4">
                    Bạn có chắc chắn muốn xóa giao dịch này?
                </p>

                <div className="w-full p-3.5 border border-[var(--border-color)] bg-[rgba(var(--accent-gold-rgb),0.02)] mb-5 space-y-1.5 text-xs font-sans">
                    <div className="flex justify-between">
                        <span className="text-[var(--text-muted)] uppercase text-[10px] tracking-wider font-bold">Mục đích:</span>
                        <span className="font-bold text-[var(--text-primary)]">{expense.purpose}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[var(--text-muted)] uppercase text-[10px] tracking-wider font-bold">Số tiền:</span>
                        <span className="font-mono font-bold text-rose-500">-{formatVND(expense.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[var(--text-muted)] uppercase text-[10px] tracking-wider font-bold">Danh mục:</span>
                        <span className="capitalize text-[var(--text-primary)]">{expense.category}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[var(--text-muted)] uppercase text-[10px] tracking-wider font-bold">Địa điểm:</span>
                        <span className="text-[var(--text-primary)]">{expense.location || '-'}</span>
                    </div>
                </div>

                <div className="p-2 border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-sans w-full text-center mb-5">
                    💡 Số tiền <strong>{formatVND(expense.amount)}</strong> sẽ được tự động hoàn trả lại vào ngân sách.
                </div>

                <div className="flex gap-3 w-full">
                    <button
                        onClick={onClose}
                        className="flex-1 btn-gold-outline py-2.5 text-xs font-bold uppercase tracking-wider"
                        disabled={isSubmitting}
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={() => onConfirm(expense)}
                        disabled={isSubmitting}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 text-xs font-display font-bold uppercase tracking-wider transition"
                    >
                        {isSubmitting ? 'Đang xóa...' : 'Xác nhận xóa'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteExpenseModal;

import React from 'react';
import { Trash2, UserX } from 'lucide-react';

const AccountActions = ({ handleAction, isSubmitting, showConfirm, openConfirm }) => {
    return (
        <section className="mb-2">
            <h3 className="text-xs font-display font-bold tracking-widest text-[var(--text-muted)] mb-4 uppercase">
                QUẢN TRỊ TÀI KHOẢN & NGÂN QUỸ
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Reset Budget Button */}
                <button
                    onClick={() => openConfirm('resetBudget')}
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 border border-amber-600/30 hover:border-amber-500 bg-amber-500/5 hover:bg-amber-500/10 text-amber-500 py-3.5 px-4 font-display font-bold text-xs uppercase tracking-widest transition"
                    aria-label="Xóa toàn bộ số tiền"
                >
                    <Trash2 size={16} />
                    {isSubmitting && showConfirm.type === 'resetBudget' ? (
                        <span className="flex items-center gap-2">
                            <div className="animate-spin h-4 w-4 border-2 border-amber-500 border-t-transparent rounded-full" />
                            ĐANG XỬ LÝ...
                        </span>
                    ) : (
                        'ĐẶT LẠI NGÂN QUỸ'
                    )}
                </button>

                {/* Delete Account Button */}
                <button
                    onClick={() => openConfirm('deleteAccount')}
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 border border-red-600/30 hover:border-red-500 bg-red-500/5 hover:bg-red-500/10 text-red-500 py-3.5 px-4 font-display font-bold text-xs uppercase tracking-widest transition"
                    aria-label="Xóa tài khoản"
                >
                    <UserX size={16} />
                    {isSubmitting && showConfirm.type === 'deleteAccount' ? (
                        <span className="flex items-center gap-2">
                            <div className="animate-spin h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full" />
                            ĐANG XỬ LÝ...
                        </span>
                    ) : (
                        'XÓA TÀI KHOẢN HỆ THỐNG'
                    )}
                </button>
            </div>
        </section>
    );
};

export default AccountActions;

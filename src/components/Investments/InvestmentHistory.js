import React, { useState } from 'react';
import { Trash2, TrendingUp, AlertTriangle } from 'lucide-react';
import feedback from '../../utils/feedback';

const InvestmentHistory = ({
    investments = [],
    onDeleteInvestment,
    formatVND = (v) => v,
}) => {
    const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);

    const getTypeName = (type) => {
        switch (type) {
            case 'gold': return 'Vàng';
            case 'bitcoin': return 'Bitcoin';
            case 'selfInvestment': return 'Đầu tư bản thân';
            default: return 'Khác';
        }
    };

    const getFundName = (sourceFund) => {
        switch (sourceFund) {
            case 'emergency': return 'Quỹ Dự phòng';
            case 'auto': return 'Kết hợp';
            default: return 'Quỹ Bản thân';
        }
    };

    if (!investments || investments.length === 0) {
        return (
            <section className="mb-8">
                <div className="p-6 border border-[var(--border-color)] bg-[var(--bg-secondary)] text-center">
                    <TrendingUp size={28} className="mx-auto mb-2 text-[var(--accent-gold)] opacity-50" />
                    <p className="text-xs font-display uppercase tracking-wider text-[var(--text-muted)]">
                        Chưa có danh mục ủy thác đầu tư nào.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="mb-8">
            <div className="p-6 border border-[var(--border-color)] bg-[var(--bg-secondary)]">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-display font-bold tracking-widest text-[var(--accent-gold)] uppercase flex items-center gap-2">
                        <TrendingUp size={16} />
                        DANH MỤC ỦY THÁC ĐÃ THỰC HIỆN ({investments.length})
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border-color)] text-[10px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)]">
                                <th className="pb-2.5">Thời gian</th>
                                <th className="pb-2.5">Loại tài sản</th>
                                <th className="pb-2.5">Mô tả chi tiết</th>
                                <th className="pb-2.5">Nguồn vốn</th>
                                <th className="pb-2.5 text-right">Số tiền</th>
                                <th className="pb-2.5 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)] text-xs">
                            {investments.map((inv, idx) => (
                                <tr key={inv._id || inv.id || idx} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="py-3 font-mono text-[var(--text-muted)] whitespace-nowrap">
                                        {inv.date || 'Hôm nay'}
                                    </td>
                                    <td className="py-3 font-bold">
                                        <span className="px-2 py-0.5 border border-[var(--border-color)] bg-black text-[var(--accent-gold)] text-[10px] uppercase font-display tracking-wider">
                                            {getTypeName(inv.type)}
                                        </span>
                                    </td>
                                    <td className="py-3 max-w-xs truncate text-[var(--text-primary)]">
                                        {inv.description || 'Giao dịch đầu tư'}
                                    </td>
                                    <td className="py-3 whitespace-nowrap text-[11px] text-[var(--text-muted)]">
                                        {getFundName(inv.sourceFund)}
                                    </td>
                                    <td className="py-3 text-right font-mono font-bold text-[var(--accent-gold)] whitespace-nowrap">
                                        {formatVND(inv.amount || 0)}
                                    </td>
                                    <td className="py-3 text-center">
                                        <button
                                            type="button"
                                            className="min-w-[32px] min-h-[32px] p-1.5 border border-red-500/20 text-red-500 hover:bg-red-500/10 transition active:scale-95 inline-flex items-center justify-center"
                                            title="Hủy ủy thác & hoàn lại tiền"
                                            onClick={() => {
                                                feedback.warning();
                                                setConfirmDeleteIndex(idx);
                                            }}
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Confirmation Dialog (Poka-Yoke Defensive Design) */}
            {confirmDeleteIndex !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-md p-6 bg-[var(--bg-secondary)] border border-red-500/40 relative shadow-2xl">
                        <div className="flex items-center gap-3 mb-4 text-red-500">
                            <div className="p-2 border border-red-500/30 bg-red-500/10">
                                <AlertTriangle size={20} />
                            </div>
                            <h3 className="font-display font-bold text-sm tracking-widest uppercase">
                                Xác nhận hủy ủy thác đầu tư
                            </h3>
                        </div>

                        <p className="text-xs leading-relaxed text-[var(--text-muted)] mb-4">
                            Bạn có chắc chắn muốn hủy giao dịch đầu tư này? Số tiền{' '}
                            <strong className="text-[var(--accent-gold)] font-mono">
                                {formatVND(investments[confirmDeleteIndex]?.amount || 0)}
                            </strong>{' '}
                            sẽ được hoàn trả lại về quỹ{' '}
                            <strong>{getFundName(investments[confirmDeleteIndex]?.sourceFund)}</strong> và hạn mức ngân sách của bạn.
                        </p>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                className="px-4 py-2 border border-[var(--border-color)] text-xs font-display uppercase tracking-wider text-[var(--text-muted)] hover:text-white"
                                onClick={() => {
                                    feedback.tap();
                                    setConfirmDeleteIndex(null);
                                }}
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 border border-red-500 bg-red-500/20 text-red-400 text-xs font-display uppercase font-bold tracking-wider hover:bg-red-500/30"
                                onClick={() => {
                                    feedback.success();
                                    onDeleteInvestment(confirmDeleteIndex);
                                    setConfirmDeleteIndex(null);
                                }}
                            >
                                Xác nhận hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default InvestmentHistory;

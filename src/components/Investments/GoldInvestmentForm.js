import React from 'react';

const GoldInvestmentForm = ({ goldDetail, setGoldDetail, goldTypes, goldBrands, creating }) => {
    return (
        <div className="space-y-4 border-t border-[var(--border-color)] pt-4 mt-4">
            <div>
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                    LOẠI VÀNG
                </label>
                <select
                    className="rockefeller-input text-xs py-2 bg-[var(--bg-secondary)]"
                    value={goldDetail.goldType}
                    onChange={(e) =>
                        setGoldDetail((prev) => ({
                            ...prev,
                            goldType: e.target.value,
                        }))
                    }
                    disabled={creating}
                >
                    <option value="">-- Chọn loại vàng --</option>
                    {goldTypes.map((g) => (
                        <option key={g.value} value={g.value}>
                            {g.label}
                        </option>
                    ))}
                </select>
                {goldDetail.goldType && (
                    <div className="text-[10px] font-display uppercase tracking-wider text-[var(--accent-gold)] mt-1.5">
                        {
                            goldTypes.find((g) => g.value === goldDetail.goldType)
                                ?.desc
                        }
                    </div>
                )}
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                        TRỌNG LƯỢNG
                    </label>
                    <input
                        type="number"
                        min={0}
                        step={0.01}
                        className="rockefeller-input font-mono text-xs py-2"
                        placeholder="Nhập trọng lượng"
                        value={goldDetail.weight}
                        onChange={(e) =>
                            setGoldDetail((prev) => ({
                                ...prev,
                                weight: e.target.value,
                            }))
                        }
                        disabled={creating}
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                        ĐƠN VỊ CHUẨN
                    </label>
                    <select
                        className="rockefeller-input text-xs py-2 bg-[var(--bg-secondary)]"
                        value={goldDetail.weightUnit}
                        onChange={(e) =>
                            setGoldDetail((prev) => ({
                                ...prev,
                                weightUnit: e.target.value,
                            }))
                        }
                        disabled={creating}
                    >
                        <option value="gram">Gram (g)</option>
                        <option value="luong">Lượng (37.5g)</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                    THƯƠNG HIỆU VÀNG BẢO CHỨNG
                </label>
                <select
                    className="rockefeller-input text-xs py-2 bg-[var(--bg-secondary)]"
                    value={goldDetail.brand}
                    onChange={(e) =>
                        setGoldDetail((prev) => ({
                            ...prev,
                            brand: e.target.value,
                        }))
                    }
                    disabled={creating}
                >
                    <option value="">-- Chọn thương hiệu --</option>
                    {goldBrands.map((b) => (
                        <option key={b} value={b}>
                            {b}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                    CHỨNG NHẬN & XUẤT XỨ
                </label>
                <input
                    type="text"
                    className="rockefeller-input text-xs py-2"
                    placeholder="Ví dụ: SJC, PNJ, ... (nếu có)"
                    value={goldDetail.certificate}
                    onChange={(e) =>
                        setGoldDetail((prev) => ({
                            ...prev,
                            certificate: e.target.value,
                        }))
                    }
                    disabled={creating}
                />
            </div>

            <div>
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                    HÌNH THỨC VẬT LÝ
                </label>
                <input
                    type="text"
                    className="rockefeller-input text-xs py-2"
                    placeholder="Nhẫn vàng, dây chuyền, miếng vàng, ..."
                    value={goldDetail.form}
                    onChange={(e) =>
                        setGoldDetail((prev) => ({
                            ...prev,
                            form: e.target.value,
                        }))
                    }
                    disabled={creating}
                />
            </div>

            <div>
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                    GHI CHÚ DIỄN BIẾN THỊ TRƯỜNG
                </label>
                <textarea
                    className="rockefeller-input text-xs py-2 min-h-[60px]"
                    placeholder="Ghi chú về diễn biến giá vàng gần đây (nếu có)"
                    value={goldDetail.marketNote}
                    onChange={(e) =>
                        setGoldDetail((prev) => ({
                            ...prev,
                            marketNote: e.target.value,
                        }))
                    }
                    disabled={creating}
                />
            </div>

            <div>
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                    CHI PHÍ GIA CÔNG PHỤ TRỢ (VND)
                </label>
                <input
                    type="text"
                    className="rockefeller-input text-xs py-2"
                    placeholder="Nhập chi phí gia công"
                    value={goldDetail.processingFee}
                    onChange={(e) =>
                        setGoldDetail((prev) => ({
                            ...prev,
                            processingFee: e.target.value,
                        }))
                    }
                    disabled={creating}
                />
            </div>
        </div>
    );
};

export default GoldInvestmentForm;

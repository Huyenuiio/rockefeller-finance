import React from 'react';

const BitcoinInvestmentForm = ({ bitcoinDetail, setBitcoinDetail, bitcoinExchanges, creating }) => {
    return (
        <div className="space-y-4 border-t border-[var(--border-color)] pt-4 mt-4">
            <div>
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                    GIÁ BITCOIN TẠI THỜI ĐIỂM ỦY THÁC (USD/VND)
                </label>
                <input
                    type="number"
                    min={0}
                    className="rockefeller-input font-mono text-xs py-2"
                    placeholder="Nhập giá Bitcoin"
                    value={bitcoinDetail.price}
                    onChange={(e) =>
                        setBitcoinDetail((prev) => ({
                            ...prev,
                            price: e.target.value,
                        }))
                    }
                    disabled={creating}
                />
            </div>
            <div>
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                    SÀN GIAO DỊCH LƯU KÝ
                </label>
                <select
                    className="rockefeller-input text-xs py-2 bg-[var(--bg-secondary)]"
                    value={bitcoinDetail.exchange}
                    onChange={(e) =>
                        setBitcoinDetail((prev) => ({
                            ...prev,
                            exchange: e.target.value,
                        }))
                    }
                    disabled={creating}
                >
                    <option value="">-- Chọn sàn giao dịch --</option>
                    {bitcoinExchanges.map((ex) => (
                        <option key={ex} value={ex}>
                            {ex}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                    ĐỊA CHỈ VÍ LẠNH / VÍ LƯU TRỮ
                </label>
                <input
                    type="text"
                    className="rockefeller-input font-mono text-xs py-2"
                    placeholder="Nhập địa chỉ ví Bitcoin"
                    value={bitcoinDetail.wallet}
                    onChange={(e) =>
                        setBitcoinDetail((prev) => ({
                            ...prev,
                            wallet: e.target.value,
                        }))
                    }
                    disabled={creating}
                />
            </div>
        </div>
    );
};

export default BitcoinInvestmentForm;

import React from 'react';

const BitcoinInvestmentForm = ({ bitcoinDetail, setBitcoinDetail, bitcoinExchanges, creating }) => {
    return (
        <div className="mb-3">
            <div className="mb-2">
                <label className="block font-medium mb-1">Giá Bitcoin (tại thời điểm mua - USD/VND)</label>
                <input
                    type="number"
                    min={0}
                    className="input-modern w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
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
            <div className="mb-2">
                <label className="block font-medium mb-1">Sàn giao dịch</label>
                <select
                    className="input-modern w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
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
            <div className="mb-2">
                <label className="block font-medium mb-1">Địa chỉ ví (nếu có)</label>
                <input
                    type="text"
                    className="input-modern w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
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

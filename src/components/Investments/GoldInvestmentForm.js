import React from 'react';

const GoldInvestmentForm = ({ goldDetail, setGoldDetail, goldTypes, goldBrands, creating }) => {
    return (
        <div className="mb-3">
            <div className="mb-2">
                <label className="block font-medium mb-1">Loại vàng</label>
                <select
                    className="input-modern w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
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
                    <div className="text-xs text-gray-500 mt-1">
                        {
                            goldTypes.find((g) => g.value === goldDetail.goldType)
                                ?.desc
                        }
                    </div>
                )}
            </div>
            <div className="mb-2 flex gap-2">
                <div className="flex-1">
                    <label className="block font-medium mb-1">
                        Trọng lượng
                    </label>
                    <input
                        type="number"
                        min={0}
                        step={0.01}
                        className="input-modern w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
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
                    <label className="block font-medium mb-1 invisible">
                        Đơn vị
                    </label>
                    <select
                        className="input-modern px-2 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
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
                        <option value="luong">Lượng (1 lượng = 37,5g)</option>
                    </select>
                </div>
            </div>
            <div className="mb-2">
                <label className="block font-medium mb-1">Thương hiệu vàng</label>
                <select
                    className="input-modern w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
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
            <div className="mb-2">
                <label className="block font-medium mb-1">Chứng nhận & xuất xứ</label>
                <input
                    type="text"
                    className="input-modern w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
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
            <div className="mb-2">
                <label className="block font-medium mb-1">Hình thức vàng</label>
                <input
                    type="text"
                    className="input-modern w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
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
            <div className="mb-2">
                <label className="block font-medium mb-1">Biến động thị trường</label>
                <textarea
                    className="input-modern w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
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
            <div className="mb-2">
                <label className="block font-medium mb-1">Chi phí gia công (nếu có)</label>
                <input
                    type="text"
                    className="input-modern w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
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

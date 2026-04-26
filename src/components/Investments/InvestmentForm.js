import React from 'react';
import GoldInvestmentForm from './GoldInvestmentForm';
import BitcoinInvestmentForm from './BitcoinInvestmentForm';

const InvestmentForm = ({
    handleCreateInvestment,
    inputAmount, setInputAmount,
    selectedType, setSelectedType,
    investmentTypes,
    goldDetail, setGoldDetail, goldTypes, goldBrands,
    bitcoinDetail, setBitcoinDetail, bitcoinExchanges,
    selfInvestDetail, setSelfInvestDetail,
    creating
}) => {
    return (
        <section className="mb-8">
            <div className="glass-card p-4 rounded-2xl shadow-xl">
                <h2 className="text-lg font-bold mb-2">Tạo giao dịch đầu tư mới</h2>
                <form onSubmit={handleCreateInvestment}>
                    <div className="mb-3">
                        <label className="block font-medium mb-1">Số tiền đầu tư</label>
                        <input
                            type="number"
                            min={0}
                            step={1000}
                            className="input-modern w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Nhập số tiền (VND)"
                            value={inputAmount}
                            onChange={(e) => setInputAmount(e.target.value)}
                            disabled={creating}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block font-medium mb-1">Chọn loại đầu tư</label>
                        <div className="flex gap-4 flex-wrap mt-2">
                            {investmentTypes.map((type) => (
                                <button
                                    type="button"
                                    key={type.value}
                                    className={`px-3 py-2 rounded-lg border font-semibold flex items-center gap-2 transition-all ${selectedType === type.value
                                        ? "bg-blue-500 text-white border-blue-500"
                                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700"
                                        }`}
                                    onClick={() => setSelectedType(type.value)}
                                    disabled={creating}
                                >
                                    <span>{type.icon}</span>
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {selectedType === "gold" && (
                        <GoldInvestmentForm
                            goldDetail={goldDetail}
                            setGoldDetail={setGoldDetail}
                            goldTypes={goldTypes}
                            goldBrands={goldBrands}
                            creating={creating}
                        />
                    )}

                    {selectedType === "bitcoin" && (
                        <BitcoinInvestmentForm
                            bitcoinDetail={bitcoinDetail}
                            setBitcoinDetail={setBitcoinDetail}
                            bitcoinExchanges={bitcoinExchanges}
                            creating={creating}
                        />
                    )}

                    {selectedType === "selfInvestment" && (
                        <div className="mb-3">
                            <label className="block font-medium mb-1">Thông tin đầu tư bản thân</label>
                            <textarea
                                className="input-modern w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
                                placeholder="Ví dụ: Khóa học lập trình, sách kỹ năng, ..."
                                value={selfInvestDetail}
                                onChange={(e) => setSelfInvestDetail(e.target.value)}
                                disabled={creating}
                            />
                        </div>
                    )}

                    <div className="mt-4">
                        <button
                            type="submit"
                            className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-lg ${creating
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95"
                                }`}
                            disabled={creating}
                        >
                            {creating ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Đang xử lý...
                                </span>
                            ) : "Xác nhận đầu tư"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default InvestmentForm;

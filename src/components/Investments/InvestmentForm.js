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
            <div className="p-6 border border-[var(--border-color)] bg-[var(--bg-secondary)] relative">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-[var(--accent-gold)]" />
                <h2 className="text-xs font-display font-bold tracking-widest text-[var(--accent-gold)] mb-4 uppercase">
                    ỦY THÁC ĐẦU TƯ MỚI
                </h2>
                <form onSubmit={handleCreateInvestment}>
                    <div className="mb-4">
                        <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                            SỐ TIỀN ỦY THÁC (VND)
                        </label>
                        <input
                            type="number"
                            min={0}
                            step={1000}
                            className="rockefeller-input font-mono text-sm py-2.5"
                            placeholder="Nhập số tiền (VND)"
                            value={inputAmount}
                            onChange={(e) => setInputAmount(e.target.value)}
                            disabled={creating}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                            PHƯƠNG THỨC ĐẦU TƯ
                        </label>
                        <div className="flex gap-3 flex-wrap mt-2">
                            {investmentTypes.map((type) => (
                                <button
                                    type="button"
                                    key={type.value}
                                    className={`px-4 py-2 border text-xs font-display font-bold uppercase tracking-wider transition-all select-none ${selectedType === type.value
                                        ? "bg-[var(--accent-gold)] text-black border-[var(--accent-gold)]"
                                        : "bg-black text-[var(--text-muted)] border-[var(--border-color)] hover:border-[var(--accent-gold)] hover:text-[var(--text-primary)]"
                                        }`}
                                    onClick={() => setSelectedType(type.value)}
                                    disabled={creating}
                                >
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
                        <div className="mb-4">
                            <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                                CHI TIẾT ĐẦU TƯ BẢN THÂN
                            </label>
                            <textarea
                                className="rockefeller-input text-xs py-2.5 min-h-[80px]"
                                placeholder="Ví dụ: Khóa học lập trình, sách kỹ năng, ..."
                                value={selfInvestDetail}
                                onChange={(e) => setSelfInvestDetail(e.target.value)}
                                disabled={creating}
                                required
                            />
                        </div>
                    )}

                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full btn-gold-primary py-3.5 text-xs font-bold uppercase tracking-widest"
                            disabled={creating}
                        >
                            {creating ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent" />
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

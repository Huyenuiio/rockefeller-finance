import React from 'react';
import GoldInvestmentForm from './GoldInvestmentForm';
import BitcoinInvestmentForm from './BitcoinInvestmentForm';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

const InvestmentForm = ({
    handleCreateInvestment,
    inputAmount, setInputAmount,
    selectedType, setSelectedType,
    sourceFund, setSourceFund,
    investmentTypes,
    goldDetail, setGoldDetail, goldTypes, goldBrands,
    bitcoinDetail, setBitcoinDetail, bitcoinExchanges,
    selfInvestDetail, setSelfInvestDetail,
    creating,
    allocations = {},
    formatVND = (v) => v,
    numberToWords = () => '',
    confirmedBitcoin, setConfirmedBitcoin
}) => {
    const parsedAmount = parseFloat(inputAmount) || 0;

    // Calculate maximum available for selected source
    let maxAvailable = 0;
    if (sourceFund === 'selfInvestment') {
        maxAvailable = parseFloat(allocations.selfInvestment || 0);
    } else if (sourceFund === 'emergency') {
        maxAvailable = parseFloat(allocations.emergency || 0);
    } else {
        maxAvailable = parseFloat(allocations.selfInvestment || 0) + parseFloat(allocations.emergency || 0);
    }

    const isOverBudget = parsedAmount > maxAvailable;

    return (
        <section className="mb-8">
            <div className="p-6 border border-[var(--border-color)] bg-[var(--bg-secondary)] relative">
                <h2 className="text-xs font-display font-bold tracking-widest text-[var(--accent-gold)] mb-4 uppercase">
                    ỦY THÁC ĐẦU TƯ MỚI
                </h2>
                <form onSubmit={handleCreateInvestment}>
                    {/* Amount */}
                    <div className="mb-4">
                        <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                            SỐ TIỀN ỦY THÁC (VND)
                        </label>
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className={`rockefeller-input font-mono text-sm py-2.5 ${isOverBudget ? 'border-red-500' : ''}`}
                            placeholder="Nhập số tiền (VND)"
                            value={inputAmount}
                            onChange={(e) => {
                                const cleanVal = e.target.value.replace(/\D/g, '');
                                setInputAmount(cleanVal);
                            }}
                            disabled={creating}
                            required
                        />
                        {parsedAmount > 0 && (
                            <div className="mt-2 p-2 border border-[var(--border-color)] bg-[rgba(var(--accent-gold-rgb),0.02)]">
                                <div className="flex justify-between items-center text-xs font-mono font-bold">
                                    <span className="text-[10px] text-[var(--text-muted)] uppercase">Xác nhận:</span>
                                    <span>{formatVND(parsedAmount)}</span>
                                </div>
                                <p className="text-[10px] font-display text-[var(--accent-gold)] mt-0.5 uppercase tracking-wider">
                                    {numberToWords(parsedAmount)}
                                </p>
                            </div>
                        )}
                        {isOverBudget && (
                            <div className="mt-2 p-2.5 border border-red-500/30 bg-red-500/10 text-red-500 text-xs font-display flex items-center gap-2">
                                <AlertTriangle size={14} className="shrink-0" />
                                <span>Số tiền vượt quá hạn mức khả dụng của nguồn đã chọn (Khả dụng: {formatVND(maxAvailable)})</span>
                            </div>
                        )}
                    </div>

                    {/* Funding Source Selector (Transparent Mental Model) */}
                    <div className="mb-4">
                        <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                            NGUỒN VỐN TRÍCH XUẤT (MINH BẠCH HÓA NGUỒN TIỀN)
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <button
                                type="button"
                                className={`p-3 border text-left transition select-none ${
                                    sourceFund === 'selfInvestment'
                                        ? 'bg-[var(--accent-gold)] text-black border-[var(--accent-gold)] font-bold'
                                        : 'bg-black/20 border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--accent-gold)]'
                                }`}
                                onClick={() => setSourceFund('selfInvestment')}
                                disabled={creating}
                            >
                                <div className="text-[10px] uppercase tracking-wider">Đầu tư bản thân</div>
                                <div className="font-mono text-xs font-bold mt-1">{formatVND(allocations.selfInvestment || 0)}</div>
                            </button>

                            <button
                                type="button"
                                className={`p-3 border text-left transition select-none ${
                                    sourceFund === 'emergency'
                                        ? 'bg-[var(--accent-gold)] text-black border-[var(--accent-gold)] font-bold'
                                        : 'bg-black/20 border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--accent-gold)]'
                                }`}
                                onClick={() => setSourceFund('emergency')}
                                disabled={creating}
                            >
                                <div className="text-[10px] uppercase tracking-wider">Quỹ Dự phòng</div>
                                <div className="font-mono text-xs font-bold mt-1">{formatVND(allocations.emergency || 0)}</div>
                            </button>

                            <button
                                type="button"
                                className={`p-3 border text-left transition select-none ${
                                    sourceFund === 'auto'
                                        ? 'bg-[var(--accent-gold)] text-black border-[var(--accent-gold)] font-bold'
                                        : 'bg-black/20 border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--accent-gold)]'
                                }`}
                                onClick={() => setSourceFund('auto')}
                                disabled={creating}
                            >
                                <div className="text-[10px] uppercase tracking-wider">Tự động kết hợp</div>
                                <div className="font-mono text-xs font-bold mt-1">
                                    {formatVND((parseFloat(allocations.selfInvestment || 0) + parseFloat(allocations.emergency || 0)))}
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Method Selector */}
                    <div className="mb-4">
                        <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                            PHƯƠNG THỨC ĐẦU TƯ
                        </label>
                        <div className="flex gap-3 flex-wrap mt-2">
                            {investmentTypes.map((type) => (
                                <button
                                    type="button"
                                    key={type.value}
                                    className={`px-4 py-2 border text-xs font-display font-bold uppercase tracking-wider transition-all select-none ${
                                        selectedType === type.value
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
                        <>
                            <BitcoinInvestmentForm
                                bitcoinDetail={bitcoinDetail}
                                setBitcoinDetail={setBitcoinDetail}
                                bitcoinExchanges={bitcoinExchanges}
                                creating={creating}
                            />
                            <div className="mt-3 p-3 border border-[var(--border-color)] bg-[rgba(var(--accent-gold-rgb),0.02)] flex items-start gap-2">
                                <ShieldCheck size={16} className="text-[var(--accent-gold)] shrink-0 mt-0.5" />
                                <div className="text-[10px] font-sans leading-relaxed text-[var(--text-muted)]">
                                    <span className="font-bold text-[var(--accent-gold)]">Chiến lược Rockefeller:</span> Tài sản số có biến động cao. Đảm bảo tỷ trọng danh mục rủi ro cao ở mức an toàn.
                                </div>
                            </div>
                        </>
                    )}

                    {selectedType === "selfInvestment" && (
                        <div className="mb-4">
                            <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                                CHI TIẾT ĐẦU TƯ BẢN THÂN
                            </label>
                            <textarea
                                className="rockefeller-input text-xs py-2.5 min-h-[80px]"
                                placeholder="Ví dụ: Khóa học lập trình, sách kỹ năng, hội thảo tài chính..."
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
                            disabled={creating || isOverBudget || !selectedType}
                        >
                            {creating ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full" />
                                    Đang xử lý...
                                </span>
                            ) : isOverBudget ? (
                                "VƯỢT QUÁ HẠN MỨC NGUỒN VỐN"
                            ) : !selectedType ? (
                                "VUI LÒNG CHỌN PHƯƠNG THỨC ĐẦU TƯ"
                            ) : (
                                "Xác nhận đầu tư"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};
export default InvestmentForm;

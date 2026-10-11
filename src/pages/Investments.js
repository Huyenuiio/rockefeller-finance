import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import {
  investmentTypes, goldTypes, goldBrands, bitcoinExchanges,
  formatVND, numberToWords
} from "../constants/investments";
import { API_URL } from "../config";
import InvestmentAllocations from "../components/Investments/InvestmentAllocations";
import InvestmentForm from "../components/Investments/InvestmentForm";
import InvestmentHistory from "../components/Investments/InvestmentHistory";
import { ShieldAlert } from "lucide-react";

const Investments = () => {
  const [allocations, setAllocations] = useState({
    selfInvestment: 0,
    emergency: 0,
  });
  const [investments, setInvestments] = useState([]);
  const [error, setError] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const snackbarTimeout = useRef(null);

  // Đầu tư mới
  const [inputAmount, setInputAmount] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sourceFund, setSourceFund] = useState("selfInvestment");
  const [bitcoinPrompt, setBitcoinPrompt] = useState(null);

  const [goldDetail, setGoldDetail] = useState({
    goldType: "",
    weight: "",
    weightUnit: "gram",
    brand: "",
    certificate: "",
    form: "",
    marketNote: "",
    processingFee: "",
  });
  const [bitcoinDetail, setBitcoinDetail] = useState({
    price: "",
    exchange: "",
    wallet: "",
    volume: "",
    supply: "",
    volatility: "",
    fee: "",
    legal: "",
    security: "",
  });
  const [selfInvestDetail, setSelfInvestDetail] = useState("");
  const [creating, setCreating] = useState(false);

  // Lấy token từ localStorage
  const token = localStorage.getItem("token");

  const fetchData = useCallback(async () => {
    setError("");
    try {
      const [allocRes, invRes] = await Promise.all([
        axios.get(`${API_URL}/api/allocations`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/api/investments`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setAllocations({
        selfInvestment: allocRes.data.selfInvestment || 0,
        emergency: allocRes.data.emergency || 0,
      });
      setInvestments(Array.isArray(invRes.data) ? invRes.data : []);
    } catch (err) {
      setError(
        err.response?.data?.error || "Lỗi khi lấy dữ liệu phân bổ ngân sách"
      );
      setSnackbarMsg(
        err.response?.data?.error || "Lỗi khi lấy dữ liệu phân bổ ngân sách"
      );
      setShowSnackbar(true);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Snackbar logic
  useEffect(() => {
    if (showSnackbar) {
      if (snackbarTimeout.current) clearTimeout(snackbarTimeout.current);
      snackbarTimeout.current = setTimeout(() => setShowSnackbar(false), 3500);
    }
    return () => {
      if (snackbarTimeout.current) clearTimeout(snackbarTimeout.current);
    };
  }, [showSnackbar]);

  // Tổng số tiền có thể đầu tư
  const totalAmount =
    (parseFloat(allocations.selfInvestment) || 0) +
    (parseFloat(allocations.emergency) || 0);

  // Helper: get current date in dd/mm/yyyy
  function getCurrentDateString() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Xử lý tạo giao dịch đầu tư
  const executeInvestment = async (overrideBitcoin = false) => {
    setCreating(true);

    let description = "";
    let detail = {};

    if (selectedType === "gold") {
      description = `Đầu tư vàng: ${goldDetail.goldType ? goldDetail.goldType + ", " : ""}${goldDetail.weight ? goldDetail.weight + " " + (goldDetail.weightUnit === "gram" ? "g" : "lượng") : ""}${goldDetail.brand ? ", " + goldDetail.brand : ""}${goldDetail.form ? ", " + goldDetail.form : ""}`;
      detail = { ...goldDetail };
    } else if (selectedType === "bitcoin") {
      description = `Đầu tư Bitcoin: ${bitcoinDetail.exchange ? "Sàn " + bitcoinDetail.exchange : ""}${bitcoinDetail.wallet ? ", Ví: " + bitcoinDetail.wallet : ""}`;
      detail = { ...bitcoinDetail };
    } else if (selectedType === "selfInvestment") {
      description = selfInvestDetail ? selfInvestDetail : "Đầu tư bản thân";
      detail = { content: selfInvestDetail };
    }

    try {
      const payload = {
        amount: parseFloat(inputAmount),
        price:
          selectedType === "bitcoin"
            ? parseFloat(bitcoinDetail.price) || 0
            : parseFloat(inputAmount),
        type: String(selectedType),
        sourceFund,
        description: String(description),
        detail: JSON.stringify(detail),
        date: getCurrentDateString(),
        confirmed: overrideBitcoin,
      };

      const res = await axios.post(
        `${API_URL}/api/investments`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Cập nhật state từ phản hồi atomic của backend
      if (res.data.allocations) {
        setAllocations({
          selfInvestment: res.data.allocations.selfInvestment || 0,
          emergency: res.data.allocations.emergency || 0,
        });
      }
      if (res.data.investments) {
        setInvestments(res.data.investments);
      }

      setSnackbarMsg("Ủy thác đầu tư thành công!");
      setShowSnackbar(true);

      // Reset form
      setInputAmount("");
      setSelectedType("");
      setGoldDetail({
        goldType: "",
        weight: "",
        weightUnit: "gram",
        brand: "",
        certificate: "",
        form: "",
        marketNote: "",
        processingFee: "",
      });
      setBitcoinDetail({
        price: "",
        exchange: "",
        wallet: "",
        volume: "",
        supply: "",
        volatility: "",
        fee: "",
        legal: "",
        security: "",
      });
      setSelfInvestDetail("");
      setBitcoinPrompt(null);
    } catch (err) {
      if (err.response?.data?.canOverride) {
        setBitcoinPrompt(err.response.data.error);
      } else {
        setSnackbarMsg(
          err.response?.data?.error || "Lỗi khi tạo giao dịch đầu tư"
        );
        setShowSnackbar(true);
      }
    } finally {
      setCreating(false);
    }
  };

  const handleCreateInvestment = async (e) => {
    e.preventDefault();
    const parsed = parseFloat(inputAmount);
    if (!inputAmount || isNaN(parsed) || parsed <= 0) {
      setSnackbarMsg("Vui lòng nhập số tiền hợp lệ.");
      setShowSnackbar(true);
      return;
    }
    if (!selectedType) {
      setSnackbarMsg("Vui lòng chọn loại đầu tư.");
      setShowSnackbar(true);
      return;
    }

    let maxAvailable = 0;
    if (sourceFund === "selfInvestment") {
      maxAvailable = parseFloat(allocations.selfInvestment || 0);
    } else if (sourceFund === "emergency") {
      maxAvailable = parseFloat(allocations.emergency || 0);
    } else {
      maxAvailable = totalAmount;
    }

    if (parsed > maxAvailable) {
      setSnackbarMsg(`Số tiền vượt quá hạn mức khả dụng (${formatVND(maxAvailable)}).`);
      setShowSnackbar(true);
      return;
    }

    await executeInvestment(false);
  };

  // Xóa / Hủy đầu tư và hoàn tiền
  const handleDeleteInvestment = async (index) => {
    try {
      const res = await axios.delete(`${API_URL}/api/investments/${index}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.allocations) {
        setAllocations({
          selfInvestment: res.data.allocations.selfInvestment || 0,
          emergency: res.data.allocations.emergency || 0,
        });
      }
      if (res.data.investments) {
        setInvestments(res.data.investments);
      } else if (Array.isArray(res.data)) {
        setInvestments(res.data);
      }

      setSnackbarMsg("Đã hủy ủy thác đầu tư và hoàn trả tiền vào quỹ!");
      setShowSnackbar(true);
    } catch (err) {
      setSnackbarMsg(
        err.response?.data?.error || "Lỗi khi hủy giao dịch đầu tư"
      );
      setShowSnackbar(true);
    }
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300 bg-[var(--bg-primary)] text-[var(--text-primary)]"
      style={{
        minHeight: "100vh",
        WebkitOverflowScrolling: "touch",
        overscrollBehavior: "none",
      }}
    >
      {/* Snackbar */}
      <div
        className={`fixed z-50 left-1/2 -translate-x-1/2 bottom-6 px-5 py-3 border border-[var(--border-color)] bg-black text-white text-xs font-display tracking-wider uppercase transition-all duration-300
          ${showSnackbar
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
          }
        `}
        role="status"
        aria-live="polite"
        style={{
          maxWidth: "95vw",
          width: "max-content",
          minWidth: 180,
        }}
      >
        {snackbarMsg}
      </div>

      {/* Topbar */}
      <header className="sticky top-0 z-40 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] bg-opacity-95 backdrop-blur-md">
        <div className="flex items-center justify-between pl-16 pr-4 py-4 md:px-4 max-w-7xl mx-auto">
          <h1 className="text-lg md:text-xl font-display font-bold tracking-wider text-[var(--accent-gold)] flex items-center gap-3">
            <div className="w-8 h-8 border border-[var(--accent-gold)] flex items-center justify-center bg-black">
              <span className="font-display font-black text-[var(--accent-gold)] text-xl leading-none">R</span>
            </div>
            ỦY THÁC ĐẦU TƯ
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8" style={{ width: "100%" }}>
        {/* Error */}
        {error && (
          <div className="mb-4">
            <div className="flex items-center gap-2 border border-red-500/30 bg-red-500/5 text-red-500 px-4 py-3 text-xs font-display uppercase tracking-wider">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        <InvestmentAllocations
          allocations={allocations}
          formatVND={formatVND}
          numberToWords={numberToWords}
        />

        {/* Total allocations */}
        {totalAmount > 0 && (
          <section className="mb-6">
            <div className="p-6 border border-[var(--border-color)] bg-[var(--bg-secondary)] flex flex-col items-center select-none">
              <h2 className="text-[10px] font-display font-bold tracking-wider uppercase text-[var(--text-muted)] mb-1">
                TỔNG SỐ TIỀN PHÂN BỔ ĐẦU TƯ KHẢ DỤNG
              </h2>
              <p className="text-3xl font-mono font-bold text-[var(--text-primary)] tracking-tight">
                {formatVND(totalAmount)}
              </p>
              <p className="text-[10px] uppercase tracking-wider font-display text-[var(--accent-gold)] mt-1">
                {numberToWords(totalAmount)}
              </p>
            </div>
          </section>
        )}

        <InvestmentForm
          handleCreateInvestment={handleCreateInvestment}
          inputAmount={inputAmount} setInputAmount={setInputAmount}
          selectedType={selectedType} setSelectedType={setSelectedType}
          sourceFund={sourceFund} setSourceFund={setSourceFund}
          investmentTypes={investmentTypes}
          goldDetail={goldDetail} setGoldDetail={setGoldDetail} goldTypes={goldTypes} goldBrands={goldBrands}
          bitcoinDetail={bitcoinDetail} setBitcoinDetail={setBitcoinDetail} bitcoinExchanges={bitcoinExchanges}
          selfInvestDetail={selfInvestDetail} setSelfInvestDetail={setSelfInvestDetail}
          creating={creating}
          allocations={allocations}
          formatVND={formatVND}
          numberToWords={numberToWords}
        />

        {/* Investment History Table */}
        <InvestmentHistory
          investments={investments}
          onDeleteInvestment={handleDeleteInvestment}
          formatVND={formatVND}
        />

        {/* Bitcoin High-Risk Confirmation Modal (Norman Ch. 5 Slip/Mistake Defense) */}
        {bitcoinPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md p-6 bg-[var(--bg-secondary)] border border-[var(--accent-gold)] relative shadow-2xl">
              <div className="flex items-center gap-3 mb-4 text-[var(--accent-gold)]">
                <div className="p-2 border border-[var(--accent-gold)]/30 bg-[rgba(var(--accent-gold-rgb),0.1)]">
                  <ShieldAlert size={22} />
                </div>
                <h3 className="font-display font-bold text-sm tracking-widest uppercase">
                  Cảnh báo tỷ trọng tài sản rủi ro
                </h3>
              </div>

              <p className="text-xs leading-relaxed text-[var(--text-muted)] mb-3">
                {bitcoinPrompt}
              </p>
              <div className="p-3 border border-[var(--border-color)] bg-black/30 text-[11px] text-[var(--text-muted)] mb-6 font-mono">
                Số tiền: <strong className="text-[var(--accent-gold)]">{formatVND(parseFloat(inputAmount) || 0)}</strong>
                <br />
                Theo nguyên tắc Rockefeller, không nên phân bổ quá 10% tổng tài sản vào tài sản có biên độ biến động cao như Bitcoin.
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-[var(--border-color)] text-xs font-display uppercase tracking-wider text-[var(--text-muted)] hover:text-white"
                  onClick={() => setBitcoinPrompt(null)}
                >
                  Điều chỉnh lại
                </button>
                <button
                  type="button"
                  className="btn-gold-primary px-4 py-2 text-xs font-display uppercase font-bold tracking-wider"
                  onClick={() => executeInvestment(true)}
                >
                  Tôi hiểu rủi ro, Tiếp tục
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Investments;
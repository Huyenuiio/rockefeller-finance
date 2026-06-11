import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import {
  investmentTypes, goldTypes, goldBrands, bitcoinExchanges,
  formatVND, numberToWords
} from "../constants/investments";
import InvestmentAllocations from "../components/Investments/InvestmentAllocations";
import InvestmentForm from "../components/Investments/InvestmentForm";
import { FinanceContext } from "../contexts/FinanceContext";

const Investments = () => {
  const [allocations, setAllocations] = useState({
    selfInvestment: 0,
    emergency: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isDarkMode } = useContext(FinanceContext);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const snackbarTimeout = useRef(null);

  // Đầu tư mới
  const [inputAmount, setInputAmount] = useState("");
  const [selectedType, setSelectedType] = useState("");
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

  useEffect(() => {
    const fetchAllocations = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/allocations`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAllocations({
          selfInvestment: res.data.selfInvestment || 0,
          emergency: res.data.emergency || 0,
        });
      } catch (err) {
        setError(
          err.response?.data?.error || "Lỗi khi lấy dữ liệu phân bổ ngân sách"
        );
        setSnackbarMsg(
          err.response?.data?.error || "Lỗi khi lấy dữ liệu phân bổ ngân sách"
        );
        setShowSnackbar(true);
      } finally {
        setLoading(false);
      }
    };
    fetchAllocations();
    // eslint-disable-next-line
  }, []);

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

  // Tổng số tiền chỉ là cộng 2 trường này
  const totalAmount =
    parseFloat(allocations.selfInvestment) +
    parseFloat(allocations.emergency);


  // Helper: get current date in dd/mm/yyyy
  function getCurrentDateString() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Xử lý tạo giao dịch đầu tư
  const handleCreateInvestment = async (e) => {
    e.preventDefault();
    if (!inputAmount || isNaN(inputAmount) || parseFloat(inputAmount) <= 0) {
      setSnackbarMsg("Vui lòng nhập số tiền hợp lệ.");
      setShowSnackbar(true);
      return;
    }
    if (!selectedType) {
      setSnackbarMsg("Vui lòng chọn loại đầu tư.");
      setShowSnackbar(true);
      return;
    }
    if (parseFloat(inputAmount) > totalAmount) {
      setSnackbarMsg("Số tiền đầu tư vượt quá tổng số tiền phân bổ.");
      setShowSnackbar(true);
      return;
    }
    setCreating(true);

    // Chuẩn bị dữ liệu giao dịch
    let description = "";
    let category = "";
    let detail = {};

    if (selectedType === "gold") {
      category = "Vàng";
      description = `Đầu tư vàng: ${goldDetail.goldType ? goldDetail.goldType + ", " : ""}${goldDetail.weight ? goldDetail.weight + " " + (goldDetail.weightUnit === "gram" ? "g" : "lượng") : ""}${goldDetail.brand ? ", " + goldDetail.brand : ""}${goldDetail.form ? ", " + goldDetail.form : ""}`;
      detail = { ...goldDetail };
    } else if (selectedType === "bitcoin") {
      category = "Bitcoin";
      description = `Đầu tư Bitcoin: ${bitcoinDetail.exchange ? "Sàn " + bitcoinDetail.exchange : ""}${bitcoinDetail.wallet ? ", Ví: " + bitcoinDetail.wallet : ""}`;
      detail = { ...bitcoinDetail };
    } else if (selectedType === "selfInvestment") {
      category = "Đầu tư bản thân";
      description = selfInvestDetail ? selfInvestDetail : "Đầu tư bản thân";
      detail = { content: selfInvestDetail };
    }

    // Trừ tiền từ allocations: ưu tiên trừ selfInvestment trước, còn thiếu thì trừ emergency
    let remain = parseFloat(inputAmount);
    let newSelf = parseFloat(allocations.selfInvestment);
    let newEmergency = parseFloat(allocations.emergency);
    if (newSelf >= remain) {
      newSelf -= remain;
    } else {
      remain -= newSelf;
      newSelf = 0;
      newEmergency -= remain;
    }

    try {
      const payload = {
        amount: parseFloat(inputAmount),
        price:
          selectedType === "bitcoin"
            ? parseFloat(bitcoinDetail.price) || 0
            : parseFloat(inputAmount),
        type: String(selectedType),
        description: String(description),
        detail: JSON.stringify(detail),
        date: getCurrentDateString(),
      };

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/investments`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Nếu có warning từ backend
      if (res.data && res.data.warning) {
        setSnackbarMsg(res.data.warning);
        setShowSnackbar(true);
      } else {
        setSnackbarMsg("Tạo giao dịch đầu tư thành công!");
        setShowSnackbar(true);
      }
      // Cập nhật lại allocations
      await axios.put(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/allocations`,
        {
          selfInvestment: newSelf,
          emergency: newEmergency,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAllocations({
        selfInvestment: newSelf,
        emergency: newEmergency,
      });
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
    } catch (err) {
      setSnackbarMsg(
        err.response?.data?.error || "Lỗi khi tạo giao dịch đầu tư"
      );
      setShowSnackbar(true);
    } finally {
      setCreating(false);
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
        <div className="flex items-center justify-between px-4 py-4 max-w-7xl mx-auto">
          <h1 className="text-lg md:text-xl font-display font-bold tracking-wider text-[var(--accent-gold)] flex items-center gap-3">
            <div className="w-8 h-8 border border-[var(--accent-gold)] flex items-center justify-center bg-black">
              <span className="font-display font-bold text-[var(--accent-gold)] text-sm">R</span>
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
                TỔNG SỐ TIỀN PHÂN BỔ ĐẦU TƯ
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
          investmentTypes={investmentTypes}
          goldDetail={goldDetail} setGoldDetail={setGoldDetail} goldTypes={goldTypes} goldBrands={goldBrands}
          bitcoinDetail={bitcoinDetail} setBitcoinDetail={setBitcoinDetail} bitcoinExchanges={bitcoinExchanges}
          selfInvestDetail={selfInvestDetail} setSelfInvestDetail={setSelfInvestDetail}
          creating={creating}
        />
      </main>
    </div>
  );
};

export default Investments;
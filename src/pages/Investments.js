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
      className={`min-h-screen transition-colors duration-300 overflow-x-hidden ${isDarkMode
        ? "bg-slate-950 text-white"
        : "bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-900"
        }`}
      style={{
        minHeight: "100vh",
        WebkitOverflowScrolling: "touch",
        overscrollBehavior: "none",
      }}
    >
      {/* Snackbar */}
      <div
        className={`fixed z-50 left-1/2 -translate-x-1/2 bottom-6 px-6 py-3 rounded-xl shadow-lg font-medium text-base transition-all duration-500
          ${showSnackbar
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
          }
          ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}
        `}
        role="status"
        aria-live="polite"
        style={{
          maxWidth: "95vw",
          width: "max-content",
          minWidth: 180,
          boxSizing: "border-box",
        }}
      >
        {snackbarMsg}
      </div>

      {/* Topbar */}
      <header className="sticky top-0 z-40 bg-opacity-80 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between px-3 py-2 md:py-4 max-w-7xl mx-auto">
          <h1
            className="font-extrabold tracking-tight flex items-center gap-2 app-title"
            style={{
              fontSize: "1.35rem",
              letterSpacing: "-0.01em",
              textRendering: "optimizeLegibility",
              WebkitFontSmoothing: "antialiased",
              fontWeight: 900,
              lineHeight: 1.1,
            }}
          >
            <svg width="28" height="28" viewBox="0 0 32 32" aria-label="allocations" fill="none">
              <circle cx="16" cy="16" r="14" fill="#3b82f6" fillOpacity="0.12" />
              <circle cx="16" cy="16" r="14" stroke="#3b82f6" strokeWidth="2" />
              <path d="M10 20v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
              <rect x="13" y="14" width="6" height="6" rx="1" fill="#3b82f6" fillOpacity="0.18" />
            </svg>
            <span className="title-text">Phân bổ ngân sách</span>
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-1 sm:px-3 py-6" style={{ width: "100%" }}>
        {/* Error */}
        {error && (
          <div className="mb-4">
            <div className="flex items-center gap-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 px-4 py-2 rounded-lg shadow-sm animate-shake">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
            <div className="glass-card p-4 rounded-2xl shadow-xl flex flex-col items-center">
              <h2 className="text-lg font-bold mb-1">Tổng số tiền phân bổ</h2>
              <p className="text-2xl font-extrabold text-gray-700 dark:text-gray-200 mb-1">
                {formatVND(totalAmount)}
              </p>
              <p className="text-base italic text-gray-500 dark:text-gray-400">
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

      {/* Modern glassmorphism and utility classes */}
      <style>{`
        .glass-card {
          background: rgba(255,255,255,1);
          backdrop-filter: blur(0px) saturate(1.1);
          border: 1.5px solid rgba(200,200,255,0.13);
        }
        .dark .glass-card {
          background: rgba(15, 22, 42, 0.9);
          border: 1.5px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);
        }
        .animate-shake {
          animation: shake 0.3s;
        }
        @keyframes shake {
          0% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-2px); }
          80% { transform: translateX(2px); }
          100% { transform: translateX(0); }
        }
        html, body {
          max-width: 100vw;
          overflow-x: hidden;
        }
        @media (max-width: 900px) {
          main, .glass-card { max-width: 100vw !important; }
        }
        @media (max-width: 640px) {
          .glass-card { padding: 1rem !important; }
          .text-2xl, .text-3xl { font-size: 1.45rem !important; }
          .text-lg, .text-xl { font-size: 1.18rem !important; }
          .rounded-2xl { border-radius: 1.1rem !important; }
          .rounded-xl { border-radius: 0.8rem !important; }
          .p-4 { padding: 1rem !important; }
          .p-6 { padding: 1.2rem !important; }
          .mb-8 { margin-bottom: 1.3rem !important; }
          .mb-6 { margin-bottom: 1.1rem !important; }
          .max-w-7xl { max-width: 100vw !important; }
          .overflow-x-auto { -webkit-overflow-scrolling: touch; }
          .glass-card, .input-modern, .btn-modern {
            box-shadow: 0 2px 8px 0 rgba(59,130,246,0.10) !important;
          }
          .app-title {
            font-size: 1.25rem !important;
            font-weight: 900 !important;
            letter-spacing: -0.01em !important;
            text-shadow: 0 1px 0 #fff, 0 0px 0 #000;
            color: #22223b !important;
            -webkit-font-smoothing: antialiased !important;
            text-rendering: geometricPrecision !important;
            display: flex;
            align-items: center;
          }
          .dark .app-title {
            color: #fff !important;
            text-shadow: 0 1px 0 #23263a, 0 0px 0 #fff;
          }
          .app-title .title-text {
            font-size: 1.18rem !important;
            font-weight: 900 !important;
            letter-spacing: -0.01em !important;
            line-height: 1.1 !important;
          }
        }
        @media (max-width: 400px) {
          .glass-card { padding: 0.7rem !important; }
          .app-title { font-size: 1.08rem !important; }
          .app-title .title-text { font-size: 1.01rem !important; }
        }
        .input-modern {
          background: #f9fafb;
          color: #22223b;
        }
        .dark .input-modern {
          background: #23263a;
          color: #fff;
        }
      `}</style>
    </div>
  );
};

export default Investments;
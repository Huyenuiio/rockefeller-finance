import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

// Các category đầu tư đa cấp
const investmentTypes = [
  {
    label: "Vàng",
    value: "gold",
    icon: "🥇",
  },
  {
    label: "Bitcoin",
    value: "bitcoin",
    icon: "₿",
  },
  {
    label: "Đầu tư bản thân",
    value: "selfInvestment",
    icon: "📚",
  },
];

const goldTypes = [
  {
    label: "Vàng 24K (99,99%)",
    value: "24K",
    desc: "Vàng nguyên chất, tỷ lệ vàng trong hợp kim là 99,99%.",
  },
  {
    label: "Vàng 18K (75%)",
    value: "18K",
    desc: "Chứa 75% vàng và 25% kim loại khác.",
  },
  {
    label: "Vàng 14K (58,3%)",
    value: "14K",
    desc: "Chứa 58,3% vàng và 41,7% kim loại khác.",
  },
  {
    label: "Vàng 10K (41,7%)",
    value: "10K",
    desc: "Chứa 41,7% vàng và 58,3% kim loại khác.",
  },
];

const goldBrands = [
  "SJC",
  "Vàng rồng Thăng Long",
  "Vàng 9999",
  "PNJ",
  "Khác",
];

const bitcoinExchanges = [
  "Binance",
  "Coinbase",
  "Kraken",
  "FTX (đã gặp vấn đề pháp lý)",
  "Khác",
];

function formatVND(value) {
  const num = parseFloat(value) || 0;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(num);
}

function numberToWords(num) {
  if (!num || isNaN(num)) return "";
  if (num < 1000) return `${num} đồng`;
  if (num < 1000000) return `${Math.round(num / 1000)} nghìn đồng`;
  if (num < 1000000000) return `${(num / 1000000).toFixed(2)} triệu đồng`;
  return `${(num / 1000000000).toFixed(2)} tỷ đồng`;
}

const Investments = () => {
  const [allocations, setAllocations] = useState({
    selfInvestment: 0,
    emergency: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );
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
          "https://backend-rockefeller-finance.onrender.com/api/allocations",
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

  // Đổi theme
  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

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
    let deductSelf = 0, deductEmergency = 0;
    if (newSelf >= remain) {
      deductSelf = remain;
      newSelf -= remain;
    } else {
      deductSelf = newSelf;
      remain -= newSelf;
      newSelf = 0;
      deductEmergency = remain;
      newEmergency -= remain;
    }

    try {
      // Gọi API tạo giao dịch đầu tư
      // Sửa lỗi: ép kiểu các trường về string nếu backend yêu cầu string, đặc biệt là detail
      // Ngoài ra, thêm trường date (nếu backend yêu cầu)
      // Nếu backend yêu cầu detail là string, hãy stringify nó
      // Nếu backend yêu cầu description là string, đảm bảo là string
      // Nếu backend yêu cầu price là string, ép về string
      // Nếu backend yêu cầu amount là string, ép về string
      // Nếu backend yêu cầu type là string, ép về string

      // Đoán: detail phải là string (JSON), các trường khác là string/number bình thường
      // Nếu backend vẫn lỗi, thử gửi detail là JSON.stringify(detail)
      // Nếu backend vẫn lỗi, thử gửi toàn bộ object là JSON.stringify(obj) (nhưng axios sẽ gửi JSON, không phải string)
      // Nếu backend yêu cầu investmentHistory là string, có thể backend đang push object vào mảng string

      // Cách tốt nhất: ép detail thành string
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
        "https://backend-rockefeller-finance.onrender.com/api/investments",
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
        "https://backend-rockefeller-finance.onrender.com/api/allocations",
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
      // Nếu backend trả về lỗi CastError liên quan đến detail/object, thử lại với detail là string
      if (
        err.response &&
        err.response.data &&
        typeof err.response.data.error === "string" &&
        err.response.data.error.includes("Cast to string failed")
      ) {
        try {
          // Thử gửi detail là JSON.stringify(detail) nếu chưa làm
          const payload = {
            amount: String(parseFloat(inputAmount)),
            price: String(
              selectedType === "bitcoin"
                ? parseFloat(bitcoinDetail.price) || 0
                : parseFloat(inputAmount)
            ),
            type: String(selectedType),
            description: String(description),
            detail: JSON.stringify(detail),
            date: getCurrentDateString(),
          };
          const res2 = await axios.post(
            "https://backend-rockefeller-finance.onrender.com/api/investments",
            payload,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setSnackbarMsg("Tạo giao dịch đầu tư thành công!");
          setShowSnackbar(true);
          // Cập nhật lại allocations
          await axios.put(
            "https://backend-rockefeller-finance.onrender.com/api/allocations",
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
          setCreating(false);
          return;
        } catch (err2) {
          setSnackbarMsg(
            err2.response?.data?.error ||
              "Lỗi khi tạo giao dịch đầu tư (detail stringified)"
          );
          setShowSnackbar(true);
          setCreating(false);
          return;
        }
      }
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
      className={`min-h-screen transition-colors duration-300 overflow-x-hidden ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
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
          ${
            showSnackbar
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
      <header
        className="sticky top-0 z-40 bg-opacity-95 shadow-sm"
        style={{
          WebkitBackdropFilter:
            typeof window !== "undefined" && window.innerWidth <= 640
              ? undefined
              : "blur(10px)",
          backdropFilter:
            typeof window !== "undefined" && window.innerWidth <= 640
              ? undefined
              : "blur(10px)",
        }}
      >
        <div className="flex items-center justify-between px-3 py-2 md:py-4 max-w-3xl mx-auto">
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
              <circle cx="16" cy="16" r="14" fill="#3b82f6" fillOpacity="0.12"/>
              <circle cx="16" cy="16" r="14" stroke="#3b82f6" strokeWidth="2"/>
              <path d="M10 20v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
              <rect x="13" y="14" width="6" height="6" rx="1" fill="#3b82f6" fillOpacity="0.18"/>
            </svg>
            <span className="title-text">Phân bổ ngân sách</span>
          </h1>
          <button
            onClick={toggleDarkMode}
            aria-label="Chuyển đổi chế độ sáng/tối"
            className={`rounded-full p-2 shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400
              ${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-blue-100"}
            `}
          >
            {isDarkMode ? (
              <svg className="w-6 h-6 text-yellow-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
                <path d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-1 sm:px-3 py-6" style={{ width: "100%" }}>
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

        {/* Budget allocations */}
        <section className="mb-6">
          <div className="glass-card p-4 rounded-2xl shadow-xl">
            <h2 className="text-lg font-bold mb-2">Phân bổ ngân sách</h2>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div
                className="flex flex-col items-start justify-center p-3 rounded-xl shadow bg-white dark:bg-gray-800"
                style={{
                  borderLeft: `6px solid #f59e42`,
                  minHeight: 90,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ fontSize: "1.5rem" }}>📚</span>
                  <span
                    style={{
                      color: "#f59e42",
                      fontWeight: 700,
                      fontSize: "1.08rem",
                    }}
                  >
                    Đầu tư bản thân
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-gray-700 dark:text-gray-200 mb-1">
                  {formatVND(allocations.selfInvestment)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                  {numberToWords(allocations.selfInvestment)}
                </div>
              </div>
              <div
                className="flex flex-col items-start justify-center p-3 rounded-xl shadow bg-white dark:bg-gray-800"
                style={{
                  borderLeft: `6px solid #a855f7`,
                  minHeight: 90,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ fontSize: "1.5rem" }}>🛡️</span>
                  <span
                    style={{
                      color: "#a855f7",
                      fontWeight: 700,
                      fontSize: "1.08rem",
                    }}
                  >
                    Dự phòng linh hoạt
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-gray-700 dark:text-gray-200 mb-1">
                  {formatVND(allocations.emergency)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                  {numberToWords(allocations.emergency)}
                </div>
              </div>
            </section>
          </div>
        </section>

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

        {/* Đầu tư mới */}
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
                <div className="flex gap-3 flex-wrap">
                  {investmentTypes.map((type) => (
                    <button
                      type="button"
                      key={type.value}
                      className={`px-3 py-2 rounded-lg border font-semibold flex items-center gap-2 transition-all ${
                        selectedType === type.value
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

              {/* Đầu tư vàng */}
              {selectedType === "gold" && (
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
                    <label className="block font-medium mb-1">Giá vàng</label>
                    <div className="text-xs text-gray-500">
                      Giá vàng thay đổi theo thời gian và được niêm yết hàng ngày trên thị trường quốc tế và trong nước.
                      <br />
                      Các thương hiệu phổ biến: {goldBrands.join(", ")}.
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
                    <div className="text-xs text-gray-500 mt-1">
                      Vàng có chứng nhận từ các cơ quan uy tín giúp đảm bảo chất lượng và tính chính hãng.
                    </div>
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
              )}

              {/* Đầu tư Bitcoin */}
              {selectedType === "bitcoin" && (
                <div className="mb-3">
                  <div className="mb-2">
                    <label className="block font-medium mb-1">Giá Bitcoin</label>
                    <input
                      type="text"
                      className="input-modern w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
                      placeholder="Nhập giá Bitcoin hiện tại (USD/VND)"
                      value={bitcoinDetail.price}
                      onChange={(e) =>
                        setBitcoinDetail((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                      disabled={creating}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Giá Bitcoin thay đổi liên tục trên các sàn giao dịch.
                    </div>
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
                      <option value="">-- Chọn sàn --</option>
                      {bitcoinExchanges.map((ex) => (
                        <option key={ex} value={ex}>
                          {ex}
                        </option>
                      ))}
                    </select>
                    <div className="text-xs text-gray-500 mt-1">
                      Mỗi sàn có mức phí giao dịch khác nhau và một số sàn yêu cầu xác minh danh tính.
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="block font-medium mb-1">Ví Bitcoin</label>
                    <input
                      type="text"
                      className="input-modern w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
                      placeholder="Ví nóng (online) hoặc ví lạnh (Ledger, Trezor, ...)"
                      value={bitcoinDetail.wallet}
                      onChange={(e) =>
                        setBitcoinDetail((prev) => ({
                          ...prev,
                          wallet: e.target.value,
                        }))
                      }
                      disabled={creating}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Ví nóng: dễ giao dịch nhưng rủi ro cao. Ví lạnh: an toàn hơn nhưng không thuận tiện cho giao dịch nhanh.
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="block font-medium mb-1">Khối lượng giao dịch</label>
                    <input
                      type="text"
                      className="input-modern w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
                      placeholder="Số lượng Bitcoin giao dịch"
                      value={bitcoinDetail.volume}
                      onChange={(e) =>
                        setBitcoinDetail((prev) => ({
                          ...prev,
                          volume: e.target.value,
                        }))
                      }
                      disabled={creating}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block font-medium mb-1">Tỷ lệ cung-cầu</label>
                    <input
                      type="text"
                      className="input-modern w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
                      placeholder="Ghi chú về cung-cầu (nếu có)"
                      value={bitcoinDetail.supply}
                      onChange={(e) =>
                        setBitcoinDetail((prev) => ({
                          ...prev,
                          supply: e.target.value,
                        }))
                      }
                      disabled={creating}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block font-medium mb-1">Sự biến động giá</label>
                    <input
                      type="text"
                      className="input-modern w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
                      placeholder="Ghi chú về biến động giá (nếu có)"
                      value={bitcoinDetail.volatility}
                      onChange={(e) =>
                        setBitcoinDetail((prev) => ({
                          ...prev,
                          volatility: e.target.value,
                        }))
                      }
                      disabled={creating}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block font-medium mb-1">Phí giao dịch</label>
                    <input
                      type="text"
                      className="input-modern w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
                      placeholder="Phí chuyển Bitcoin (network fee, sàn, ...)"
                      value={bitcoinDetail.fee}
                      onChange={(e) =>
                        setBitcoinDetail((prev) => ({
                          ...prev,
                          fee: e.target.value,
                        }))
                      }
                      disabled={creating}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block font-medium mb-1">Quy định pháp lý</label>
                    <input
                      type="text"
                      className="input-modern w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
                      placeholder="Ghi chú về pháp lý (nếu có)"
                      value={bitcoinDetail.legal}
                      onChange={(e) =>
                        setBitcoinDetail((prev) => ({
                          ...prev,
                          legal: e.target.value,
                        }))
                      }
                      disabled={creating}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block font-medium mb-1">An toàn & bảo mật</label>
                    <input
                      type="text"
                      className="input-modern w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
                      placeholder="Ghi chú về bảo mật (nếu có)"
                      value={bitcoinDetail.security}
                      onChange={(e) =>
                        setBitcoinDetail((prev) => ({
                          ...prev,
                          security: e.target.value,
                        }))
                      }
                      disabled={creating}
                    />
                  </div>
                </div>
              )}

              {/* Đầu tư bản thân */}
              {selectedType === "selfInvestment" && (
                <div className="mb-3">
                  <label className="block font-medium mb-1">
                    Nội dung đầu tư bản thân
                  </label>
                  <input
                    type="text"
                    className="input-modern w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
                    placeholder="Ví dụ: Mua sách, học online, ... "
                    value={selfInvestDetail}
                    onChange={(e) => setSelfInvestDetail(e.target.value)}
                    disabled={creating}
                  />
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className={`btn-modern px-5 py-2 rounded-lg font-bold transition-all ${
                    creating
                      ? "bg-gray-400 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                  disabled={creating}
                >
                  {creating ? "Đang tạo..." : "Tạo giao dịch"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* Modern glassmorphism and utility classes */}
      <style>{`
        .glass-card {
          background: rgba(255,255,255,1);
          backdrop-filter: blur(0px) saturate(1.1);
          border: 1.5px solid rgba(200,200,255,0.13);
        }
        .dark .glass-card {
          background: rgba(30,32,40,0.98);
          border: 1.5px solid rgba(80,80,120,0.18);
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
          .max-w-3xl { max-width: 100vw !important; }
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
        .btn-modern {
          font-weight: 700;
          border: none;
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default Investments;
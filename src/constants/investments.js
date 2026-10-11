export const investmentTypes = [
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

export const goldTypes = [
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

export const goldBrands = [
    "SJC",
    "Vàng rồng Thăng Long",
    "Vàng 9999",
    "PNJ",
    "Khác",
];

export const bitcoinExchanges = [
    "Binance",
    "Coinbase",
    "Kraken",
    "OKX",
    "Bybit",
    "Khác",
];

export { formatVND, numberToWords } from '../utils/formatters';


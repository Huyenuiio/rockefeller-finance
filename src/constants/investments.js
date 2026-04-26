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
    "FTX (đã gặp vấn đề pháp lý)",
    "Khác",
];

export const formatVND = (value) => {
    const num = parseFloat(value) || 0;
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(num);
};

export const numberToWords = (number) => {
    if (!number || isNaN(number) || number === 0) return "";

    const units = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    const scales = ['', 'nghìn', 'triệu', 'tỷ'];

    // Xử lý số âm
    const isNegative = number < 0;
    number = Math.abs(number);

    // Chuyển số thành chuỗi và chia thành các nhóm 3 chữ số
    const numStr = Math.floor(number).toString();
    const groups = [];
    for (let i = numStr.length; i > 0; i -= 3) {
        groups.unshift(numStr.slice(Math.max(i - 3, 0), i));
    }

    let result = '';
    for (let i = 0; i < groups.length; i++) {
        const group = parseInt(groups[i], 10);
        if (group === 0) continue;

        let groupWords = '';

        // Xử lý hàng trăm
        const hundreds = Math.floor(group / 100);
        if (hundreds > 0) {
            groupWords += `${units[hundreds]} trăm `;
        }

        // Xử lý hàng chục và đơn vị
        const tensAndUnits = group % 100;
        if (tensAndUnits > 0) {
            if (tensAndUnits < 10) {
                groupWords += (hundreds > 0 ? "lẻ " : "") + units[tensAndUnits];
            } else if (tensAndUnits < 20) {
                groupWords += `mười ${tensAndUnits === 10 ? '' : units[tensAndUnits % 10]}`;
            } else {
                const tens = Math.floor(tensAndUnits / 10);
                const unitsDigit = tensAndUnits % 10;
                groupWords += `${units[tens]} mươi ${unitsDigit === 0 ? '' : units[unitsDigit]}`;
            }
        }

        // Thêm đơn vị (nghìn, triệu, tỷ)
        const scaleIndex = groups.length - 1 - i;
        if (groupWords) {
            result += `${groupWords.trim()} ${scales[scaleIndex]} `;
        }
    }

    result = result.trim();
    if (isNegative) result = `âm ${result}`;
    return `${result.charAt(0).toUpperCase() + result.slice(1)} đồng.`;
};

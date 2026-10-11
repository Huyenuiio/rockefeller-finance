import numberToWordsImpl from './numberToWords';

/**
 * Format numeric value as Vietnamese Dong currency string
 * @param {number|string} value - The amount to format
 * @returns {string} - Formatted currency string (e.g., "1.000.000 ₫")
 */
export const formatVND = (value) => {
    const num = parseFloat(value) || 0;
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    }).format(num);
};

export const numberToWords = numberToWordsImpl;

const formatters = {
    formatVND,
    numberToWords,
};

export default formatters;


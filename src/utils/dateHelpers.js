/**
 * Safely parses transaction date strings in various formats:
 * - ISO string: "2026-06-12T07:32:18.123Z"
 * - ISO Date: "2026-06-12"
 * - Vietnamese string: "12/06/2026 14:14:01" or "12/06/2026"
 * 
 * Returns a valid Date object. Fallbacks to new Date() if invalid.
 */
export const parseTransactionDate = (dateStr) => {
    if (!dateStr) return new Date();
    
    // If it's already an ISO format
    if (dateStr.includes('-') || dateStr.includes('T')) {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) return d;
    }
    
    // If it is in format DD/MM/YYYY HH:mm:ss or DD/MM/YYYY
    if (dateStr.includes('/')) {
        const parts = dateStr.trim().split(/[\s,]+/); // split date and time
        const dateParts = parts[0].split('/');
        if (dateParts.length === 3) {
            const day = parseInt(dateParts[0], 10);
            const month = parseInt(dateParts[1], 10) - 1;
            const year = parseInt(dateParts[2], 10);
            let hour = 0, minute = 0, second = 0;
            if (parts[1]) {
                const timeParts = parts[1].split(':');
                hour = parseInt(timeParts[0], 10) || 0;
                minute = parseInt(timeParts[1], 10) || 0;
                second = parseInt(timeParts[2], 10) || 0;
            }
            const d = new Date(year, month, day, hour, minute, second);
            if (!isNaN(d.getTime())) return d;
        }
    }
    
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date() : d;
};

/**
 * Safely parses month-year strings (Vietnamese or English) into a Date object for sorting.
 * Supports:
 * - "tháng 6 năm 2026"
 * - "Tháng 06, 2026"
 * - "June 2026"
 */
export const parseVietnameseMonthYear = (str) => {
    if (!str) return new Date();
    
    // Matches "tháng X năm YYYY" or "Tháng X, YYYY" or "tháng X, YYYY"
    const match = str.match(/(?:tháng|Tháng)\s+(\d+)\s*(?:năm|,)?\s*(\d+)/);
    if (match) {
        const month = parseInt(match[1], 10) - 1;
        const year = parseInt(match[2], 10);
        return new Date(year, month, 1);
    }
    
    // Fallback to English split "June 2026"
    const parts = str.trim().split(/\s+/);
    if (parts.length === 2) {
        const monthIndex = new Date(Date.parse(parts[0] + " 1, 2000")).getMonth();
        const year = parseInt(parts[1], 10);
        if (!isNaN(monthIndex) && !isNaN(year)) {
            return new Date(year, monthIndex, 1);
        }
    }
    
    const d = new Date(str);
    return isNaN(d.getTime()) ? new Date() : d;
};

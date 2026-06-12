import { parseTransactionDate } from './dateHelpers';

/**
 * Converts an array of transaction objects to a CSV string.
 * Uses UTF-8 BOM (\uFEFF) so Excel opens Vietnamese characters correctly.
 */
export const exportToCSV = (transactions, categories) => {
    // CSV Header
    const headers = ['Ngày', 'Danh mục', 'Số tiền (VND)', 'Chi tiết', 'Địa điểm'];
    
    const rows = transactions.map(tx => {
        // Find category name
        const normalizedCategory = {
            'Tiêu dùng thiết yếu': 'essentials',
            'Tiết kiệm bắt buộc': 'savings',
            'Đầu tư bản thân': 'selfInvestment',
            'Từ thiện': 'charity',
            'Dự phòng linh hoạt': 'emergency',
        }[tx.category] || tx.category;
        const cat = categories.find(c => c.value === normalizedCategory);
        const categoryName = cat ? cat.label.split(' (')[0] : 'Khác';
        
        // Format date
        const txDate = parseTransactionDate(tx.timestamp || tx.date);
        const formattedDate = txDate.toLocaleString('vi-VN', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
        
        // Escape quotes
        const amount = tx.amount || 0;
        const purpose = (tx.details || tx.purpose || '').replace(/"/g, '""');
        const location = (tx.location || '').replace(/"/g, '""');
        
        return [
            `"${formattedDate}"`,
            `"${categoryName}"`,
            amount,
            `"${purpose}"`,
            `"${location}"`
        ].join(',');
    });
    
    // Combine with UTF-8 BOM
    return '\uFEFF' + [headers.join(','), ...rows].join('\n');
};

/**
 * Parses a CSV string and returns an array of structured transaction objects.
 */
export const parseCSV = (csvText, categories) => {
    const lines = csvText.split(/\r?\n/);
    if (lines.length <= 1) return [];
    
    // Mapping of Vietnamese/English category name to value
    const categoryNameToValue = {};
    categories.forEach(c => {
        const shortName = c.label.split(' (')[0].toLowerCase();
        categoryNameToValue[shortName] = c.value;
        categoryNameToValue[c.value.toLowerCase()] = c.value;
    });
    
    const transactions = [];
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Simple CSV cell parser that handles quotes
        const cells = [];
        let currentCell = '';
        let inQuotes = false;
        
        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                cells.push(currentCell.trim());
                currentCell = '';
            } else {
                currentCell += char;
            }
        }
        cells.push(currentCell.trim());
        
        if (cells.length < 3) continue;
        
        const rawDate = cells[0];
        const rawCategory = cells[1];
        const rawAmount = parseFloat(cells[2].replace(/[^\d.-]/g, ''));
        const rawPurpose = cells[3] || '';
        const rawLocation = cells[4] || '';
        
        if (isNaN(rawAmount) || rawAmount <= 0) continue;
        
        // Determine category value
        let categoryValue = 'essentials'; // fallback
        const catKey = rawCategory.toLowerCase();
        if (categoryNameToValue[catKey]) {
            categoryValue = categoryNameToValue[catKey];
        } else {
            // Find closest match
            const match = Object.keys(categoryNameToValue).find(k => catKey.includes(k) || k.includes(catKey));
            if (match) {
                categoryValue = categoryNameToValue[match];
            }
        }
        
        // Format date back to a standard string
        let formattedDate = rawDate;
        if (rawDate) {
            const parsedD = parseTransactionDate(rawDate);
            if (!isNaN(parsedD.getTime())) {
                formattedDate = parsedD.toLocaleDateString('vi-VN') + ' ' + parsedD.toLocaleTimeString('vi-VN');
            }
        }
        
        transactions.push({
            amount: rawAmount,
            category: categoryValue,
            purpose: rawPurpose,
            location: rawLocation,
            date: formattedDate
        });
    }
    
    return transactions;
};

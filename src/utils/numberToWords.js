const units = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
const scales = ['', 'nghìn', 'triệu', 'tỷ'];

function numberToWords(number) {
  if (number === 0) return 'không đồng';

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
        groupWords += units[tensAndUnits];
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
  return `${result} đồng`;
}

export default numberToWords;

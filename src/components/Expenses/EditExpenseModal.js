import React, { useState, useEffect } from 'react';
import { X, Edit3, Coins, Tag, FileText, MapPin, Calendar, AlertTriangle } from 'lucide-react';

const EditExpenseModal = ({
    isOpen,
    onClose,
    expense,
    onSave,
    categories,
    allocations,
    formatVND,
    numberToWords
}) => {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [purpose, setPurpose] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        if (expense) {
            setAmount(String(expense.amount || ''));
            setCategory(expense.category || '');
            setPurpose(expense.purpose || '');
            setLocation(expense.location || '');
            setDate(expense.date ? (expense.date.includes('T') ? expense.date.split('T')[0] : expense.date) : '');
            setError('');
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [expense, isOpen, onClose]);

    if (!isOpen || !expense) return null;

    // Available balance for the selected category considering the refund of the old amount
    const oldAmount = parseFloat(expense.amount) || 0;
    const oldCat = expense.category;
    const currentAlloc = allocations[category] || 0;
    const effectiveAlloc = category === oldCat ? currentAlloc + oldAmount : currentAlloc;
    const parsedAmount = parseInt(amount, 10) || 0;
    const isOverBudget = parsedAmount > effectiveAlloc;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (parsedAmount <= 0) {
            setError('Vui lòng nhập số tiền hợp lệ');
            return;
        }
        if (!purpose.trim() || !location.trim()) {
            setError('Vui lòng điền đầy đủ mục đích và địa điểm');
            return;
        }
        if (isOverBudget) {
            setError(`Số tiền vượt quá hạn mức quỹ (Khả dụng: ${formatVND(effectiveAlloc)})`);
            return;
        }

        setIsSubmitting(true);
        setError('');
        try {
            await onSave(expense._id, {
                amount: parsedAmount,
                category,
                purpose: purpose.trim(),
                location: location.trim(),
                date: date || new Date().toISOString()
            });
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Lỗi khi cập nhật giao dịch');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-1.5 text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition"
                    aria-label="Đóng"
                >
                    <X size={18} />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 border border-[var(--accent-gold)] bg-black text-[var(--accent-gold)]">
                        <Edit3 size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-display font-bold uppercase tracking-widest text-[var(--accent-gold)]">
                            CHỈNH SỬA GIAO DỊCH
                        </h3>
                        <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                            Cập nhật thông tin chi tiêu an toàn
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 border border-red-500/30 bg-red-500/10 text-red-500 text-xs font-display flex items-center gap-2">
                        <AlertTriangle size={14} className="shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="flex items-center gap-2 text-[10px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1" htmlFor="edit-amount">
                            <Coins size={12} /> Số tiền (VND)
                        </label>
                        <input
                            id="edit-amount"
                            type="text"
                            inputMode="numeric"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
                            className={`rockefeller-input font-mono text-lg font-bold py-2.5 ${isOverBudget ? 'border-red-500' : ''}`}
                            required
                        />
                        {amount && parsedAmount > 0 && (
                            <p className="text-[10px] font-display text-[var(--accent-gold)] mt-1 uppercase tracking-wider">
                                {numberToWords(parsedAmount)}
                            </p>
                        )}
                        {isOverBudget && (
                            <p className="text-xs text-red-500 mt-1 font-sans">
                                Vượt quá hạn mức (Khả dụng: {formatVND(effectiveAlloc)})
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-[10px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1" htmlFor="edit-category">
                            <Tag size={12} /> Hạn mức quỹ
                        </label>
                        <select
                            id="edit-category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="rockefeller-input text-xs font-medium bg-[var(--bg-secondary)] py-2.5"
                            required
                        >
                            {categories.map((cat) => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label.replace(/\s\(\d+%\)/, '')} (Khả dụng: {formatVND(cat.value === oldCat ? currentAlloc + oldAmount : (allocations[cat.value] || 0))})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-[10px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1" htmlFor="edit-purpose">
                            <FileText size={12} /> Chi tiết sử dụng vốn
                        </label>
                        <input
                            id="edit-purpose"
                            type="text"
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            className="rockefeller-input text-xs"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="flex items-center gap-2 text-[10px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1" htmlFor="edit-location">
                                <MapPin size={12} /> Địa điểm
                            </label>
                            <input
                                id="edit-location"
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="rockefeller-input text-xs"
                                required
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-[10px] font-display font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1" htmlFor="edit-date">
                                <Calendar size={12} /> Ngày
                            </label>
                            <input
                                id="edit-date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="rockefeller-input text-xs font-mono"
                            />
                        </div>
                    </div>

                    <div className="pt-3 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 btn-gold-outline py-2.5 text-xs font-bold uppercase tracking-wider"
                            disabled={isSubmitting}
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || isOverBudget}
                            className="flex-1 btn-gold-primary py-2.5 text-xs font-bold uppercase tracking-wider"
                        >
                            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditExpenseModal;

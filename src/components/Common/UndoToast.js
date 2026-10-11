import React from 'react';
import feedback from '../../utils/feedback';

/**
 * Reusable Undo Notification Toast adhering to Don Norman's Forgiveness Principle
 */
const UndoToast = ({
    isOpen = false,
    message = '',
    lastDeletedItem = null,
    onUndo = () => {},
    undoLabel = 'HOÀN TÁC',
}) => {
    return (
        <aside
            className={`fixed z-50 left-1/2 -translate-x-1/2 bottom-6 px-5 py-3 border border-[var(--border-color)] bg-black text-white text-xs font-display tracking-wider uppercase transition-all duration-300 flex items-center justify-between gap-4 shadow-2xl ${
                isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
            role="status"
            aria-live="polite"
            style={{ maxWidth: '95vw', width: 'max-content', minWidth: 220 }}
        >
            <span>{message}</span>
            {lastDeletedItem && (
                <button
                    type="button"
                    onClick={() => {
                        feedback.success();
                        onUndo();
                    }}
                    className="px-2.5 py-1 bg-[var(--accent-gold)] text-black font-bold font-display uppercase tracking-wider text-[11px] hover:bg-[var(--accent-gold-hover)] hover:scale-105 transition-all shadow-md focus:outline-none select-none"
                >
                    {undoLabel}
                </button>
            )}
        </aside>
    );
};

export default UndoToast;

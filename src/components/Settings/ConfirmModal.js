import React from 'react';

const ConfirmModal = ({ showConfirm, isDarkMode, isSubmitting, closeConfirm, handleAction }) => {
    if (!showConfirm.open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
            aria-modal="true"
            role="dialog"
        >
            <div
                className={`w-[95vw] max-w-sm rounded-2xl p-6 shadow-2xl glass-card-modern border
          ${isDarkMode ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200'}
          animate-pop-in
        `}
            >
                <h4 className="text-xl font-bold mb-2 text-center">
                    {showConfirm.type === 'deleteAccount'
                        ? 'Xác nhận xóa tài khoản'
                        : 'Xác nhận xóa toàn bộ số tiền'}
                </h4>
                <p className="mb-6 text-center text-base">
                    {showConfirm.type === 'deleteAccount'
                        ? 'Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác!'
                        : 'Bạn có chắc chắn muốn xóa toàn bộ số tiền? Dữ liệu ngân sách sẽ về 0!'}
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={closeConfirm}
                        className="flex-1 px-4 py-2 rounded-xl font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        disabled={isSubmitting}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={() => handleAction(showConfirm.type)}
                        className={`flex-1 px-4 py-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2
              ${showConfirm.type === 'deleteAccount'
                                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 focus:ring-red-400'
                                : 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white hover:from-orange-500 hover:to-yellow-500 focus:ring-orange-400'
                            }
              ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}
            `}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Đang xử lý...
                            </span>
                        ) : (
                            showConfirm.type === 'deleteAccount' ? 'Xóa tài khoản' : 'Xóa toàn bộ số tiền'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;

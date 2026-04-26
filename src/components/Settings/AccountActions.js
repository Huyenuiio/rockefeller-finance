import React from 'react';

const AccountActions = ({ handleAction, isSubmitting, showConfirm, openConfirm }) => {
    return (
        <section className="mb-2">
            <h3 className="text-xl font-bold mb-3 tracking-tight">Quản lý tài khoản</h3>
            <ul className="space-y-4">
                <li>
                    <button
                        onClick={() => openConfirm('resetBudget')}
                        disabled={isSubmitting}
                        className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-semibold text-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400
              ${isSubmitting
                                ? 'bg-gradient-to-r from-gray-400 to-gray-300 text-gray-200 cursor-not-allowed'
                                : 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white hover:from-orange-500 hover:to-yellow-500 active:scale-98'
                            }
            `}
                        aria-label="Xóa toàn bộ số tiền"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-7 0h10" />
                        </svg>
                        {isSubmitting && showConfirm.type === 'resetBudget' ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Đang xử lý...
                            </span>
                        ) : (
                            'Xóa toàn bộ số tiền'
                        )}
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => openConfirm('deleteAccount')}
                        disabled={isSubmitting}
                        className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-semibold text-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400
              ${isSubmitting
                                ? 'bg-gradient-to-r from-gray-400 to-gray-300 text-gray-200 cursor-not-allowed'
                                : 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 active:scale-98'
                            }
            `}
                        aria-label="Xóa tài khoản"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                        {isSubmitting && showConfirm.type === 'deleteAccount' ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Đang xử lý...
                            </span>
                        ) : (
                            'Xóa tài khoản'
                        )}
                    </button>
                </li>
            </ul>
        </section>
    );
};

export default AccountActions;

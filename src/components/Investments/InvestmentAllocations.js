import React from 'react';

const InvestmentAllocations = ({ allocations, formatVND, numberToWords }) => {
    return (
        <section className="mb-6">
            <div className="glass-card p-4 rounded-2xl shadow-xl">
                <h2 className="text-lg font-bold mb-2">Phân bổ ngân sách</h2>
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div
                        className="flex flex-col items-start justify-center p-3 rounded-xl shadow bg-white dark:bg-gray-800"
                        style={{
                            borderLeft: `6px solid #f59e42`,
                            minHeight: 90,
                        }}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span style={{ fontSize: "1.5rem" }}>📚</span>
                            <span
                                style={{
                                    color: "#f59e42",
                                    fontWeight: 700,
                                    fontSize: "1.08rem",
                                }}
                            >
                                Đầu tư bản thân
                            </span>
                        </div>
                        <div className="text-2xl font-extrabold text-gray-700 dark:text-gray-200 mb-1">
                            {formatVND(allocations.selfInvestment)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                            {numberToWords(allocations.selfInvestment)}
                        </div>
                    </div>
                    <div
                        className="flex flex-col items-start justify-center p-3 rounded-xl shadow bg-white dark:bg-gray-800"
                        style={{
                            borderLeft: `6px solid #a855f7`,
                            minHeight: 90,
                        }}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span style={{ fontSize: "1.5rem" }}>🛡️</span>
                            <span
                                style={{
                                    color: "#a855f7",
                                    fontWeight: 700,
                                    fontSize: "1.08rem",
                                }}
                            >
                                Dự phòng linh hoạt
                            </span>
                        </div>
                        <div className="text-2xl font-extrabold text-gray-700 dark:text-gray-200 mb-1">
                            {formatVND(allocations.emergency)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                            {numberToWords(allocations.emergency)}
                        </div>
                    </div>
                </section>
            </div>
        </section>
    );
};

export default InvestmentAllocations;

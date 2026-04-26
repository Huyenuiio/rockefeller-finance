import React from 'react';

export const CategoryIcons = {
    essentials: (
        <svg width="32" height="32" viewBox="0 0 32 32" aria-label="Tiêu dùng thiết yếu" fill="none">
            <rect x="4" y="8" width="24" height="16" rx="4" fill="#10B981" fillOpacity="0.12" />
            <rect x="4" y="8" width="24" height="16" rx="4" stroke="#10B981" strokeWidth="2" />
            <path d="M10 16h12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
            <circle cx="10" cy="20" r="1.5" fill="#10B981" />
            <circle cx="22" cy="20" r="1.5" fill="#10B981" />
        </svg>
    ),
    savings: (
        <svg width="32" height="32" viewBox="0 0 32 32" aria-label="Tiết kiệm bắt buộc" fill="none">
            <ellipse cx="16" cy="20" rx="8" ry="4" fill="#3B82F6" fillOpacity="0.12" />
            <ellipse cx="16" cy="20" rx="8" ry="4" stroke="#3B82F6" strokeWidth="2" />
            <rect x="10" y="8" width="12" height="8" rx="3" fill="#3B82F6" fillOpacity="0.12" />
            <rect x="10" y="8" width="12" height="8" rx="3" stroke="#3B82F6" strokeWidth="2" />
            <path d="M16 8v-2" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
        </svg>
    ),
    selfInvestment: (
        <svg width="32" height="32" viewBox="0 0 32 32" aria-label="Đầu tư bản thân" fill="none">
            <rect x="8" y="10" width="16" height="12" rx="3" fill="#F59E0B" fillOpacity="0.12" />
            <rect x="8" y="10" width="16" height="12" rx="3" stroke="#F59E0B" strokeWidth="2" />
            <path d="M12 14h8M12 18h5" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            <circle cx="16" cy="22" r="1.5" fill="#F59E0B" />
        </svg>
    ),
    charity: (
        <svg width="32" height="32" viewBox="0 0 32 32" aria-label="Từ thiện" fill="none">
            <path d="M16 25s-7-4.5-7-10a5 5 0 0 1 10 0 5 5 0 0 1 10 0c0 5.5-7 10-7 10z" fill="#8B5CF6" fillOpacity="0.12" />
            <path d="M16 25s-7-4.5-7-10a5 5 0 0 1 10 0 5 5 0 0 1 10 0c0 5.5-7 10-7 10z" stroke="#8B5CF6" strokeWidth="2" strokeLinejoin="round" />
        </svg>
    ),
    emergency: (
        <svg width="32" height="32" viewBox="0 0 32 32" aria-label="Dự phòng linh hoạt" fill="none">
            <circle cx="16" cy="16" r="12" fill="#F97316" fillOpacity="0.12" />
            <circle cx="16" cy="16" r="12" stroke="#F97316" strokeWidth="2" />
            <path d="M16 11v6M16 21h.01" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
        </svg>
    ),
};

export const categories = [
    { value: 'essentials', label: 'Tiêu dùng thiết yếu (50%)', color: '#10B981', icon: CategoryIcons.essentials },
    { value: 'savings', label: 'Tiết kiệm bắt buộc (20%)', color: '#3B82F6', icon: CategoryIcons.savings },
    { value: 'selfInvestment', label: 'Đầu tư bản thân (15%)', color: '#F59E0B', icon: CategoryIcons.selfInvestment },
    { value: 'charity', label: 'Từ thiện (5%)', color: '#8B5CF6', icon: CategoryIcons.charity },
    { value: 'emergency', label: 'Dự phòng linh hoạt (10%)', color: '#F97316', icon: CategoryIcons.emergency },
];

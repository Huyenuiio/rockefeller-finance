import React from 'react';
import { ShoppingBag, PiggyBank, GraduationCap, Heart, ShieldAlert } from 'lucide-react';

export const CategoryIcons = {
    essentials: <ShoppingBag size={22} className="text-[#10B981]" />,
    savings: <PiggyBank size={22} className="text-[#3B82F6]" />,
    selfInvestment: <GraduationCap size={22} className="text-[#F59E0B]" />,
    charity: <Heart size={22} className="text-[#8B5CF6]" />,
    emergency: <ShieldAlert size={22} className="text-[#F97316]" />,
};

export const categories = [
    { value: 'essentials', label: 'Tiêu dùng thiết yếu (50%)', color: '#10B981', icon: CategoryIcons.essentials },
    { value: 'savings', label: 'Tiết kiệm bắt buộc (20%)', color: '#3B82F6', icon: CategoryIcons.savings },
    { value: 'selfInvestment', label: 'Đầu tư bản thân (15%)', color: '#F59E0B', icon: CategoryIcons.selfInvestment },
    { value: 'charity', label: 'Từ thiện (5%)', color: '#8B5CF6', icon: CategoryIcons.charity },
    { value: 'emergency', label: 'Dự phòng linh hoạt (10%)', color: '#F97316', icon: CategoryIcons.emergency },
];

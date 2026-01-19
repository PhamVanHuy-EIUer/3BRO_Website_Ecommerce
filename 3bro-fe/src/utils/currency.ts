export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

// Hoặc nếu muốn format đơn giản hơn
export const formatVND = (amount: number): string => {
    return `${amount.toLocaleString('vi-VN')} VND`;
};


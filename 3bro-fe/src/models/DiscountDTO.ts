export type DiscountDTO = {
    id?: string;
    code: string;
    description: string;
    discountValue: number;
    isPercent: boolean;
    minOrderAmount: number;
    startDate: string;
    expiredDate: string;
    quantity: number;
};
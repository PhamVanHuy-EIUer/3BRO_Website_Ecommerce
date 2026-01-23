export type Discount = {
    id?: string;
    code: string;
    description: string | null;
    discountPercent: number;
    discountAmount: number;
    minOrderAmount: number;
    startDate: string;
    endDate: string;
    quantity: number;
    isActive: boolean;
    createdDate: string;
}
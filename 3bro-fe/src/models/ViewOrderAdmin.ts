export type Order = {
    orderId: number;
    customerName: string;
    productNames: string;
    amount: number;
    totalPrice: number;
    discountPrice: number;
    refundPrice: number;
    netPrice: number;
    status: string;
};
export type Order = {
    orderId: string,
    customerName: string,
    productNames: string,
    amount: number,
    refundPrice: number,
    netRevenue: number,
    status: string,
    paymentId: string,
    paymentStatus: number
};
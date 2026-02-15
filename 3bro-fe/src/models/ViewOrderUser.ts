export type ViewOrderUser = {
    orderId: string,
    createdDate: string,
    status: string,
    items: [
        {
            orderItemId: string,
            productId: string,
            productName: string,
            imageUrl: string,
            price: number,
            quantity: number
            totalPrice: number
        }
    ],
    subTotal: number,
    discountAmount: number,
    shippingFee: number,
    totalAmount: number
}
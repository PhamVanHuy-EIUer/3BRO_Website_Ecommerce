export type CreateOrderDTO = {
    shippingAddress: string,
    paymentMethod: string,
    discountId?: string,
    items: [{
        productId: string,
        quantity: number
    }]
};


export type GetDiscountDTO = {
    productList: [{
        productId: string,
        productName: string,
        price: number,
        quantity: number,
        categoryName: string,
        imageUrl: string
    }],
    currentTotalPrice: number,
    shippingFee: number,
    discountPrice: number,
    discountCode: string,
    finalTotalPrice: number,
    userFullName?: string,
    userPhoneNumber?: string,
    userAddress?: string
}
import { Discount } from "./Discount";

export type PaymentProduct = {
    productList: [{
        productId: string,
        productName: string,
        price: number,
        quantity: number,
        categoryName: string,
        imageUrl?: string,
        subTotalPrice: number
    }],
    vouchers: Discount[],
    currentTotalPrice: number,
    shippingFee: number,
    discountPrice: number,
    discountCode: string,
    finalTotalPrice: number
    userFullName?: string,
    userPhoneNumber?: string,
    userAddress?: string
};
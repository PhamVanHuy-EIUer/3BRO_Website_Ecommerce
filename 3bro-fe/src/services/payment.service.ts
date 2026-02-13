import axiosClient from "@/lib/axios"
import { ViewPrice } from "@/models/ViewPrice";

export const paymentService = {

    calculateProductPayment: (price: ViewPrice[]) => axiosClient.post(`/Products/product-autodisccount-directly`, price, { headers: { "Content-Type": "application/json" } }).then(res => res.data),
    calculateProductPaymentWithDiscount: (
        discountCode: string,
        price: ViewPrice[]
    ) => {
        const url =
            discountCode !== ""
                ? `/Products/product-disccount-directly?discountCode=${discountCode}`
                : `/Products/product-disccount-directly`;

        return axiosClient
            .post(url, price, {
                headers: { "Content-Type": "application/json" }
            })
            .then(res => res.data);

    },
    topProductRevenue: (pageSize: number) => axiosClient.get(`/Payments/top-product-revenue?pageSize=${pageSize}`).then(res => res.data),
    totalRevenue: () => axiosClient.get(`/Payments/total-revenue`).then(res => res.data),
    monthlyRevenue: () => axiosClient.get(`/Payments/total-sale`).then(res => res.data),
    createPayment: (orderId: string) => axiosClient.post(`Payments?orderId=${orderId}`).then(res => res.data),
    paymentByMomo: (orderId: string) => axiosClient.post(`/Payments/momo`, { orderId }, { headers: { "Content-Type": "application/json" } }).then(res => res.data),
};
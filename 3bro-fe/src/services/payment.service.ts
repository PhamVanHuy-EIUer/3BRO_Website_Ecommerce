import axiosClient from "@/lib/axios"

export const paymentService = {
    calculateMoneyForProduct: (productId: string, quantity: number) => axiosClient.post(`/Products/product-discount-directly?productId=${productId}&quantity=${quantity}`).then(res => res.data),
    calculateMoneyForListCartItem: (cartItemId: string[]) =>
        axiosClient
            .post("/Products/item-list", null, {
                params: { cartItemId },
            })
            .then(res => res.data),
    calculateForCartItemWithDiscount: (discountCode: string, cartItemIds: string[]) => axiosClient.post(`/Products/product-discount-cartitem`, { discountCode, cartItemIds }, { headers: { "Content-Type": "application/json" } }).then(res => res.data),
    calculateForCartItem: (cartItemIds: string[]) => {
        const query = cartItemIds
            .map(id => `cartItemId=${id}`)
            .join("&");

        return axiosClient
            .post(`/Products/item-list?${query}`)
            .then(res => res.data);
    },
    calculateForProduct: (productId: string, quantity: number) => axiosClient.get(`/Products/product-discount-directly?productId=${productId}&quantity=${quantity}`).then(res => res.data),
    topProductRevenue: (pageSize: number) => axiosClient.get(`/Payments/top-product-revenue?pageSize=${pageSize}`).then(res => res.data),
    totalRevenue: () => axiosClient.get(`/Payments/total-revenue`).then(res => res.data),
};
import axiosClient from "@/lib/axios";
import { CreateOrderDTO } from "@/models/CreateOrderDTO";

export const orderService = {
    getOrderByAdmin: () => axiosClient.get("/Orders/admin").then(res => res.data),
    getOrderByUser: () => axiosClient.get("/Orders/user").then(res => res.data),
    getOrderDetail: (id: string) => axiosClient.get(`/Orders/order-detail/${id}`).then(res => res.data),
    updateStatusOrder: (id: string, status: number) => axiosClient.put(`/Orders/update-status/${id}?status=${status}`).then(res => res.data),
    createOrderByUser: (order: CreateOrderDTO) => {
        const payload: any = {
            shippingAddress: order.shippingAddress,
            paymentMethod: order.paymentMethod,
            items: order.items
        };

        if (order.discountId && order.discountId.trim() !== "") {
            payload.discountId = order.discountId;
        }

        return axiosClient
            .post("/Orders/add-order", payload, {
                headers: { "Content-Type": "application/json" }
            })
            .then(res => res.data);
    },
    cancelOrder: (id: string) => axiosClient.delete(`/Orders/remove-order/${id}`).then(res => res.data),
}
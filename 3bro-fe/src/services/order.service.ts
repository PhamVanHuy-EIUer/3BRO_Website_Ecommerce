import axiosClient from "@/lib/axios";
import { CreateOrderDTO } from "@/models/CreateOrderDTO";

export const orderService = {
    getOrderByAdmin: () => axiosClient.get("/Orders/admin").then(res => res.data),
    getOrderByUser: () => axiosClient.get("/Orders/user").then(res => res.data),
    getOrderDetail: (id: string) => axiosClient.get(`/Orders/order-detail/${id}`).then(res => res.data),
    updateStatusOrder: (id: string, status: number) => axiosClient.put(`/Orders/update-status/${id}?status=${status}`).then(res => res.data),
    createOrderByUser: (order: CreateOrderDTO) => axiosClient.post("/Orders/add-order", order, { headers: { "Content-Type": "application/json" } }).then(res => res.data),
}
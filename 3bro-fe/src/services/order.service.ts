import axiosClient from "@/lib/axios";

export const orderService = {
    getOrderByAdmin: () => axiosClient.get("/Orders/admin").then(res => res.data),
}
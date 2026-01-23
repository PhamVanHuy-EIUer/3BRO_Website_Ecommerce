import axiosClient from "@/lib/axios";
import { DiscountDTO } from "@/models/DiscountDTO";

export const discountService = {
    getDiscount: () => axiosClient.get("/Discounts").then(res => res.data),
    addDiscount: (data: DiscountDTO) => axiosClient.post("/Discounts", data, { headers: { "Content-Type": "application/json" } }).then(res => res.data),
    updateDiscount: (id: string, data: DiscountDTO) => axiosClient.put(`/Discounts?id=${id}`, data, { headers: { "Content-Type": "application/json" } }).then(res => res.data),
    deleteDiscount: (id: string) => axiosClient.delete(`/Discounts/${id}`).then(res => res.data),
};
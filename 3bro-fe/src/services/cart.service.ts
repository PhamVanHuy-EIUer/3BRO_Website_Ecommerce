import axiosClient from "@/lib/axios";

export const cartService = {
    getCart: () => axiosClient.get("/CartItems/quantity").then(res => res.data),
    addCart: (id: string, quantity: number) => axiosClient.post(`/CartItems/add?productId=${id}&quantity=${quantity}`).then(res => res.data),
    deleteProductFromCart: (id: string) => axiosClient.delete(`/CartItems?productId=${id}`).then(res => res.data),
}
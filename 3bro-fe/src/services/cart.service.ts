import axiosClient from "@/lib/axios";
import { DeleteProductId } from "@/models/DeleteProductId";
import { ViewPrice } from "@/models/ViewPrice";

export const cartService = {
    getCart: () => axiosClient.get("/CartItems/quantity").then(res => res.data),
    addCart: (id: string, quantity: number) => axiosClient.post(`/CartItems/add?productId=${id}&quantity=${quantity}`).then(res => res.data),
    deleteProductFromCart: (id: string) => axiosClient.delete(`/CartItems?productId=${id}`).then(res => res.data),
    previewPrice: (items: ViewPrice[]) => axiosClient.post(`/CartItems/preview-price`, items).then(res => res.data),
    deleteListProductFromCart: (ids: DeleteProductId[]) => axiosClient.delete(`/CartItems/delete-list-product`, { data: ids }).then(res => res.data),
}
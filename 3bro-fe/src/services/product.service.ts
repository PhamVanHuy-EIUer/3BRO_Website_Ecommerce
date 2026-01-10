import api from "@/lib/axios";

export const productService = {
    getProducts: (currentPage: number, pageSize: number) =>
        api.get("/Products/by-page?", {
            params: { currentPage, pageSize },
        }).then(res => res.data),

    getProductById: (id: string) =>
        api.get(`/Products/${id}`).then(res => res.data),
    getImageProduct: (id: string) => api.get(`/ProductImages/all-imageProduct?${id}`).then(res => res.data),
    topProduct: (currentPage: number, pageSize: number) => api.get(`/Products/order-product?currentPage=${currentPage}&pageSize=${pageSize}`).then(res => res.data),
};

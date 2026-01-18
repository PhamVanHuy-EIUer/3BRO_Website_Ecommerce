import axiosClient from "@/lib/axios";

export const productService = {
    getProducts: (currentPage: number, pageSize: number) =>
        axiosClient.get("/Products/by-page?", {
            params: { currentPage, pageSize },
        }).then(res => res.data),

    getProductById: (id: string) =>
        axiosClient.get(`/Products/${id}`).then(res => res.data),
    getProductsByCategory: (category: string, currentPage: number, pageSize: number) =>
        axiosClient.get(`/Products/category-pages?categoryId=${category}&currentPage=${currentPage}&pageSize=${pageSize}`).then(res => res.data),
    getImageProduct: (id: string) => axiosClient.get(`/ProductImages/all-imageProduct?${id}`).then(res => res.data),
    topProduct: (currentPage: number, pageSize: number) => axiosClient.get(`/Products/order-product?currentPage=${currentPage}&pageSize=${pageSize}`).then(res => res.data),
    searchProduct: (keyword: string) => axiosClient.get(`/Products/search-product?keyword=${keyword}`).then(res => res.data),
    getAllProductsAdmin: (currentPage: number, pageSize: number) => axiosClient.get(`/Products/all-products-by-page?currentPage=${currentPage}&pageSize=${pageSize}`).then(res => res.data),
    deleteProduct: (id: string) => axiosClient.delete(`/Products/${id}`).then(res => res.data),
};

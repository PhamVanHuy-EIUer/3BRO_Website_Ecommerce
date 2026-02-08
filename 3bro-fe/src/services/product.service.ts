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
    getImageProduct: (id: string) => axiosClient.get(`/ProductImages/all-imageProduct?productId=${id}`).then(res => res.data),
    topProduct: (currentPage: number, pageSize: number) => axiosClient.get(`/Products/order-product?currentPage=${currentPage}&pageSize=${pageSize}`).then(res => res.data),
    searchProduct: (keyword: string, currentPage: number, pageSize: number) => axiosClient.get(`/Products/search-product?keyword=${keyword}&currentPage=${currentPage}&pageSize=${pageSize}`).then(res => res.data),
    getAllProductsAdmin: (currentPage: number, pageSize: number) => axiosClient.get(`/Products/all-products-by-page?currentPage=${currentPage}&pageSize=${pageSize}`).then(res => res.data),
    deleteProduct: (id: string) => axiosClient.delete(`/Products/${id}`).then(res => res.data),
    updateProduct: (id: string, formData: FormData) =>
        axiosClient.put(`/Products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(res => res.data),
    addProduct: (formData: FormData) =>
        axiosClient.post(`/Products`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(res => res.data),
    addImagesForProduct: (productId: string, newImages: File[]) => {
        const formData = new FormData();

        newImages.forEach(file => {
            formData.append("newImages", file);
        });

        return axiosClient.post(
            `/ProductImages/AddNewImageForProduct/${productId}`,
            formData, { headers: { "Content-Type": "multipart/form-data" } }
        ).then(res => res.data);
    },
    deleteImageProduct: (imageId: string) => axiosClient.delete(`/ProductImages/${imageId}`).then(res => res.data),

    // discountCartItems: (discountCode: string, cartItemsIds: string[]) => axiosClient.post(`/Products/product-discount-cartitem`, { discountCode, cartItemsIds }, { headers: { "Content-Type": "application/json" } }).then(res => res.data),
    discountCartItems: (discountCode: string, cartItemIds: string[]) => {
        return axiosClient
            .post("/Products/product-discount-cartitem", {
                discountCode,
                cartItemIds
            }, {
                headers: { "Content-Type": "application/json" }
            })
            .then(res => res.data);
    },
    topProductRevenue: (pageSize: number) => axiosClient.get(`/Products/top-product-revenue?pageSize=${pageSize}`).then(res => res.data),
    productInRangePrice: (minPrice: number, maxPrice: number) => axiosClient.get(`/Products/product-in-range-price?minPrice=${minPrice}&maxPrice=${maxPrice}`).then(res => res.data),
    productOrderAscend: (currentPage: number, pageSize: number) => axiosClient.get(`/Products/product-order-ascend?currentPage=${currentPage}&pageSize=${pageSize}`).then(res => res.data),
};


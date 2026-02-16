import axiosClient from "@/lib/axios";

export const reviewService = {
    getReviewByProductId: (id: string, currentPage: number, pageSize: number) => axiosClient.get(`/Reviews/product-by-page${id}?currentPage=${currentPage}&pageSize=${pageSize}`).then(res => res.data),
    postReview: (productId: string, rating: number, comment: string) => axiosClient.post(`/Reviews`, { productId, rating, comment }, { headers: { "Content-Type": "application/json" } }).then(res => res.data),
    deleteReview: (id: string) => axiosClient.delete(`/Reviews?reviewId=${id}`).then(res => res.data),
    getRating: (id: string) => axiosClient.get(`/Reviews/rating${id}`).then(res => res.data),
    getReviewByUser: (currentPage: number, pageSize: number) => axiosClient.get(`/Reviews/by-user?currentPage=${currentPage}&pageSize=${pageSize}`).then(res => res.data),
    updateReview: (reviewId: string, productId: string, rating: number, comment: string) => axiosClient.put(`/Reviews?reviewId=${reviewId}`, { productId, rating, comment }, { headers: { "Content-Type": "application/json" } }).then(res => res.data),
    getReviewByAdmin: (currentPage: number, pageSize: number) => axiosClient.get(`/Reviews/by-page?currentPage=${currentPage}&pageSize=${pageSize}`).then(res => res.data),
}
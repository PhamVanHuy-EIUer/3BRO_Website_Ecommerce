import axiosClient from "@/lib/axios";

export const reviewService = {
    getReviewByProductId: (id: string, currentPage: number, pageSize: number) => axiosClient.get(`/Reviews/product-by-page${id}?currentPage=${currentPage}&pageSize=${pageSize}`).then(res => res.data),
    postReview: (productId: string, rating: number, comment: string) => axiosClient.post(`/Reviews`, { productId, rating, comment }, { headers: { "Content-Type": "application/json" } }).then(res => res.data),
    deleteReview: (id: string) => axiosClient.delete(`/Reviews?reviewId=${id}`).then(res => res.data),
}
import axiosClient from "@/lib/axios";

export const categoryService = {
    getCategories: () => axiosClient.get("/Categories").then(res => res.data),
};
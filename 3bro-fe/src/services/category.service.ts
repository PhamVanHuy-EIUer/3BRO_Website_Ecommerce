import api from "@/lib/axios";

export const categoryService = {
    getCategories: () => api.get("/Categories").then(res => res.data),
};
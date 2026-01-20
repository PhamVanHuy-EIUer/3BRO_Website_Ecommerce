import axiosClient from "@/lib/axios";
import { Register } from "@/models/Register";

export const userService = {
    getMe: () => axiosClient.get("/Users/user-byclaim"),
    register: (Register: Partial<Register>) => axiosClient.post("/Users/register", Register),
    sendActiveCode: (id: string) => axiosClient.post(`/Users/send-activecode?id=${id}`),
    activeUser: (id: string, activeCode: string) => axiosClient.post(`/Users/active-user?id=${id}&activeCode=${activeCode}`),
    getAllUsersByPage: (currentPage: number, pageSize: number) => axiosClient.get(`/Users/by-page?currentPage=${currentPage}&pageSize=${pageSize}`).then(res => res.data),
    deleteUser: (id: string) => axiosClient.delete(`/Users/${id}`).then(res => res.data),
};
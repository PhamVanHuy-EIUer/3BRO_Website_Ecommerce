import axiosClient from "@/lib/axios";
import { Register } from "@/models/Register";

export const userService = {
    getMe: () => axiosClient.get("/Users/user-byclaim"),
    register: (Register: Partial<Register>) => axiosClient.post("/Users/register", Register),
    sendActiveCode: (id: string) => axiosClient.post(`/Users/send-activecode?id=${id}`),
    activeUser: (id: string, activeCode: string) => axiosClient.get(`/Users/active-user?id=${id}&activeCode=${activeCode}`),

};
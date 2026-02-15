import axiosClient from "@/lib/axios";

export const chatService = {
    getResponseFromChat: (message: string) => axiosClient.post(`/Chat`, { message }, { headers: { "Content-Type": "application/json" } }).then(res => res.data),
}
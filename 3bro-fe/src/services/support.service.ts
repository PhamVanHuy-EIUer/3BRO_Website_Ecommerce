import axiosClient from "@/lib/axios";
import { SupportRequest } from "@/models/SupportRequest";
import { SupportResponse } from "@/models/SupportResponse";

export const supportService = {
    postSupport: (request: SupportRequest) => axiosClient.post("/Supports", request, { headers: { "Content-Type": "application/json" } }).then(res => res.data),
    receiveRequestInAdmin: () => axiosClient.get("/Supports").then(res => res.data),
    sendResponseByAdmin: (response: SupportResponse) => axiosClient.post("/Supports/response", response, { headers: { "Content-Type": "application/json" } }).then(res => res.data),
    deleteRequest: (id: string) => axiosClient.delete(`/Supports/${id}`).then(res => res.data),
    getMessageRequest: (id: string) => axiosClient.get(`/Supports/${id}`).then(res => res.data),
};
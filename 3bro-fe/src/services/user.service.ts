import axiosClient from "@/lib/axios";
import { Register } from "@/models/Register";
import { ResetPassword } from "@/models/ResetPassword";
import { UpdateProfile } from "@/models/UpdateProfile";

export const userService = {
    getMe: () => axiosClient.get("/Users/user-byclaim").then(res => res.data),
    register: (Register: Partial<Register>) => axiosClient.post("/Users/register", Register),
    sendActiveCode: (id: string) => axiosClient.post(`/Users/send-activecode?id=${id}`),
    activeUser: (id: string, activeCode: string) => axiosClient.post(`/Users/active-user?id=${id}&activeCode=${activeCode}`),
    getAllUsersByPage: (currentPage: number, pageSize: number) => axiosClient.get(`/Users/by-page?currentPage=${currentPage}&pageSize=${pageSize}`).then(res => res.data),
    deleteUser: (id: string) => axiosClient.delete(`/Users/${id}`).then(res => res.data),
    changePassword: (updatePassword: ResetPassword) => axiosClient.put(`/Users/change-password`, updatePassword, { headers: { "Content-Type": "application/json" } }).then(res => res.data),
    updateProfile: (updateProfile: UpdateProfile) => axiosClient.put(`/Users/by-user`, updateProfile, { headers: { "Content-Type": "application/json" } }).then(res => res.data),
    forgetPassword: (email: string) => axiosClient.post(`/Users/forget-password?email=${email}`),
    updateForForgetPassword: (email: string, password: string, activationCodeCode: string) => axiosClient.post(`/Users/update-pass`, { email, password, activationCodeCode }, { headers: { "Content-Type": "application/json" } }).then(res => res.data),
};
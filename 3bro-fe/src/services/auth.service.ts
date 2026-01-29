import axiosClient from "@/lib/axios";
import axios from "@/lib/axios";
import { ApiResponse } from "@/models/ApiResponse";
import { LoginRequest } from "@/models/LoginRequest";
import { LoginResponse } from "@/models/LoginResponse";

export const AuthService = {
    login: (LoginRequest: LoginRequest) => axiosClient.post<ApiResponse<LoginResponse>>("/Auth/login", LoginRequest).then(res => res.data),
    logout: () => axios.post<ApiResponse<any>>("/Auth/logout").then(res => res.data),
    loginWithGoogle: (idToken: string) => axiosClient.post("/Auth/login-google", { idToken }, { headers: { "Content-Type": "application/json" } }).then(res => res.data),
    createPasswordForGoogle: (newPassword: string, confirmNewPassword: string) => axiosClient.post("/Auth/addnewpass-gg", { newPassword, confirmNewPassword }, { headers: { "Content-Type": "application/json" } }).then(res => res.data),

};

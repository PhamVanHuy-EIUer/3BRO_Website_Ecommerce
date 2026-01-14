import axiosClient from "@/lib/axios";
import axios from "@/lib/axios";
import { ApiResponse } from "@/models/ApiResponse";
import { LoginRequest } from "@/models/LoginRequest";
import { LoginResponse } from "@/models/LoginResponse";

export const AuthService = {
    login: (LoginRequest: LoginRequest) => axiosClient.post<ApiResponse<LoginResponse>>("/Auth/login", LoginRequest),
    logout: () => axios.post<ApiResponse<any>>("/Auth/logout"),
};

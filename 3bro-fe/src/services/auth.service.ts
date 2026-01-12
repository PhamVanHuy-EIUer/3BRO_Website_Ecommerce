import axios from "@/lib/axios";
import { ApiResponse } from "@/models/ApiResponse";
import { LoginResponse } from "@/models/LoginResponse";

export const AuthService = {
    async login(email: string, password: string): Promise<LoginResponse> {
        const res = await axios.post<ApiResponse<LoginResponse>>(
            "/Auth/login",
            { email, password }
        );

        if (!res.data.isSuccess || !res.data.string) {
            throw new Error(res.data.message || "Login failed");
        }

        return {
            token: res.data.string,
        };
    },
};

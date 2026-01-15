import { ApiResponse } from "@/models/ApiResponse";
import { LoginRequest } from "@/models/LoginRequest";
import { User } from "@/models/User";

export async function login(LoginRequest: Partial<LoginRequest>): Promise<ApiResponse<any>> {
    try {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(LoginRequest),
        });

        if (!res.ok) {
            throw new Error(`Fetch failed: ${res.status}`);
        }

        const data: ApiResponse<any> = await res.json();
        return data;


    } catch (error) {
        console.log("Error login: ", error);
        return {
            code: "500",
            message: "Error login",
            isSuccess: false,
            list: [],
        } as ApiResponse<any>;
    }
}

export async function logout(): Promise<ApiResponse<any>> {
    try {
        const res = await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            throw new Error(`Fetch failed: ${res.status}`);
        }

        const data: ApiResponse<any> = await res.json();
        return data;
    } catch (error) {
        console.log("Error logout: ", error);
        return {
            code: "500",
            message: "Error logout",
            isSuccess: false,
            list: [],
        } as ApiResponse<any>;
    }
}
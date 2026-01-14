import { ApiResponse } from "@/models/ApiResponse";
import { Register } from "@/models/Register";
import { User } from "@/models/User";

export async function register(Register: Partial<Register>): Promise<ApiResponse<any>> {
    try {
        const res = await fetch("/api/user/register", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(Register),
        });

        if (!res.ok) {
            throw new Error(`Fetch failed: ${res.status}`);
        }

        const data: ApiResponse<any> = await res.json();
        return data;
    } catch (error) {
        console.log("Error register: ", error);
        return {
            code: "500",
            message: "Error register",
            isSuccess: false,
            list: [],
        } as ApiResponse<any>;
    }
}


export async function getMe(): Promise<ApiResponse<User>> {
    try {
        const response = await fetch("https://localhost:7041/api/Users/user-byclaim", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Fetch failed: ${response.status}`);
        }

        const data: ApiResponse<User> = await response.json();
        return data;
    } catch (e) {
        console.error(e);
        return {
            code: "500",
            message: "Error fetching user",
            isSuccess: false,
            list: [],
        } as ApiResponse<User>;
    }
}

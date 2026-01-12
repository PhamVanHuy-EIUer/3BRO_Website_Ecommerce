// if (process.env.NODE_ENV === "development") {
//     process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// }

import { ApiResponse } from "@/models/ApiResponse";
import { Category } from "@/models/Category";

export async function getCategories(): Promise<ApiResponse<Category>> {
    try {
        const response = await fetch("https://localhost:7041/api/Categories", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Fetch failed: ${response.status}`);
        }

        const data: ApiResponse<Category> = await response.json();

        return data;
    } catch (e) {
        console.error(e);
        return {
            code: "500",
            message: "Error fetching categories",
            isSuccess: false,
            list: [],
        } as ApiResponse<Category>;
    }
}
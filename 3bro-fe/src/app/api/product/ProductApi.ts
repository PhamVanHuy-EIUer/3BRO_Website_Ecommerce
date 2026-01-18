if (process.env.NODE_ENV === "development") {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}
import { ApiResponse } from "@/models/ApiResponse";
import { Product } from "@/models/Product";
import { ProductImage } from "@/models/ProductImage";

// get all product
export const getAvailableProducts = async (): Promise<ApiResponse<Product>> => {
    try {
        const response = await fetch(`https://localhost:7041/api/Products/get-available-products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Fetch failed: ${response.status}`);
        }

        const data: ApiResponse<Product> = await response.json();

        return data;

    } catch (err) {
        console.error("Error get products:", err);

        return {
            code: "500",
            message: "Error fetching products",
            isSuccess: false,
            list: [],
        } as ApiResponse<Product>;
    }
};

// get all products by page
export const getProduct = async (currentPage: number, pageSize: number): Promise<ApiResponse<Product>> => {
    try {
        const response = await fetch(`https://localhost:7041/api/Products/by-page?currentPage=${currentPage}&pageSize=${pageSize}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Fetch failed: ${response.status}`);
        }

        const data: ApiResponse<Product> = await response.json();

        return data;

    } catch (err) {
        console.error("Error get products:", err);

        return {
            code: "500",
            message: "Error fetching products",
            isSuccess: false,
            list: [],
        } as ApiResponse<Product>;
    }
};
// get product by id
export async function getProductById(id: string): Promise<Product | null> {
    try {
        const response = await fetch(
            `https://localhost:7041/api/Products/${id}`,
            {
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                cache: "no-store",
            }
        );

        if (!response.ok) {
            throw new Error(`Fetch failed: ${response.status}`);
        }

        const data: ApiResponse<Product> = await response.json();

        return data.object ?? null;
    } catch (error) {
        console.error("Error get product by id:", error);
        return null;
    }
};
// get top product
export const topProduct = async (currentPage: number, pageSize: number): Promise<ApiResponse<Product>> => {
    try {
        const response = await fetch(`https://localhost:7041/api/Products/order-product?currentPage=${currentPage}&pageSize=${pageSize}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Fetch failed: ${response.status}`);
        }

        const data: ApiResponse<Product> = await response.json();

        return data;

    } catch (err) {
        console.error("Error get products:", err);

        return {
            code: "500",
            message: "Error fetching products",
            isSuccess: false,
            list: [],
        } as ApiResponse<Product>;
    }
};
// get product by category
export const getProductByCategory = async (category: string, currentPage: number, pageSize: number): Promise<ApiResponse<Product>> => {
    try {
        const response = await fetch(`https://localhost:7041/api/Products/category-pages?categoryId=${category}&currentPage=${currentPage}&pageSize=${pageSize}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Fetch failed: ${response.status}`);
        }

        const data: ApiResponse<Product> = await response.json();

        return data;

    } catch (err) {
        console.error("Error get products:", err);
        return {
            code: "500",
            message: "Error fetching products",
            isSuccess: false,
            list: [],
        } as ApiResponse<Product>;
    }
}

// get image product
export const getImageProduct = async (id: string): Promise<ProductImage[] | []> => {
    try {
        const response = await fetch(`https://localhost:7041/api/ProductImages/all-imageProduct?${id}`, {
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Fetch failed: ${response.status}`);
        }

        const data: ApiResponse<ProductImage> = await response.json();
        const images: ProductImage[] | [] = await data.list;

        return images;
    } catch (error) {
        console.log(error)
        return [];
    }
}


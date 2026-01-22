import { ApiResponse } from "@/models/ApiResponse";
import { Cart } from "@/models/Cart";
import { cartService } from "@/services/cart.service";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useCart = () => {
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    const handleAddToCart = async (id: string, quantity: number) => {
        try {
            const res: ApiResponse<Cart> = await cartService.addCart(id, quantity);
            console.log(res);
            if (res.code === "401") {
                router.push("/login");
                return;
            }
            if (res.isSuccess && res.code === "200") {
                setIsSuccess(true);
            }
        } catch (err) {
            console.log(err)
        }
    }

    return { handleAddToCart, isSuccess, setIsSuccess }
};
import { ApiResponse } from "@/models/ApiResponse"
import { Order } from "@/models/ViewOrderAdmin"
import { orderService } from "@/services/order.service"
import { useEffect, useState } from "react"


const useOrders = () => {
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState<Order[]>([])

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response: ApiResponse<Order> = await orderService.getOrderByAdmin()
            setOrders(response.list)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])
    return { orders }
}

export default useOrders
import axiosClient from "@/lib/axios";
import { CreateShipment } from "@/models/CreateShipment";


export const shipmentService = {
    getShipmentsByPage: (currentPage: number, pageSize: number) => axiosClient.get(`/Shipments/by-page?currentPage=${currentPage}&pageSize=${pageSize}`).then(res => res.data),
    createShipment: (shipment: CreateShipment) => axiosClient.post("/Shipments", shipment, { headers: { "Content-Type": "application/json" } }).then(res => res.data),
    updateShipment: (id: string, status: number) => axiosClient.put(`/Shipments/${id}`, status, { headers: { "Content-Type": "application/json" } }).then(res => res.data),
    deleteShipment: (id: string) => axiosClient.delete(`/Shipments/${id}`).then(res => res.data),
    getShipmentByStatus: (status: number) => axiosClient.get(`/Shipments/by-status?status=${status}`).then(res => res.data),
};
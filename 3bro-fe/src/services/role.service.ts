import axiosClient from "@/lib/axios";

export const roleService = {
    getAllRoles: () => axiosClient.get("/Roles").then(res => res.data),
}
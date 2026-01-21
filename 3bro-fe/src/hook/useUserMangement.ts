import { ApiResponse } from "@/models/ApiResponse";
import { Role } from "@/models/Role";
import { User } from "@/models/User";
import { roleService } from "@/services/role.service";
import { userService } from "@/services/user.service";
import { notification, UploadFile } from "antd";
import { s } from "framer-motion/client";
import { useEffect, useEffectEvent, useState } from "react";

export const useUserMangement = (PAGE_SIZE: number) => {
    const [users, setUsers] = useState<User[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [role, setRole] = useState<Role[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [deleteModal, setDeleteModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [api, contextHolder] = notification.useNotification();
    const [addModal, setAddModal] = useState(false);
    const [searchedUser, setSearchedUser] = useState<User[]>([]);

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string>("");
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: 0,
        address: 0,
        isActive: "",
        roleId: "",
    });

    const setEmptyForm = () => {
        setFormData({
            fullName: "",
            email: "",
            phone: 0,
            address: 0,
            isActive: "",
            roleId: "",
        })

    }

    const fetchUsers = async () => {
        try {
            const res: ApiResponse<User> = await userService.getAllUsersByPage(page, PAGE_SIZE);
            if (res.isSuccess) {
                setUsers(res.list);
                setTotal(res.totalElement ?? 0);
                console.log(users)
            }
        } catch (err) {
            console.log(err);
        }
    }

    const fetchRoles = async () => {
        try {
            const res: ApiResponse<Role> = await roleService.getAllRoles();
            if (res.isSuccess) {
                setRole(res.list);
            }
        } catch (err) {
            console.log(err);
        }
    }

    // const handleSearchUser = async () => {
    //     try {
    //         const res: ApiResponse<User> = await userService.getAllUsersByPage(page, PAGE_SIZE);
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }


    const handleConfirmDelete = async () => {
        if (!selectedUser) return;

        try {
            const res: ApiResponse<User> = await userService.deleteUser(selectedUser.id);
            if (!res.isSuccess) throw new Error(res.message);

            api.success({ title: res.message, duration: 2 });
            setUsers(users.filter((u) => u.id !== selectedUser.id));
            setTotal(total - 1);
            setDeleteModal(false);
            setSelectedUser(null);

        } catch (err) {
            api.error({ title: "Failed to delete user", duration: 2 });
        }
    }



    useEffect(() => {
        fetchUsers();
    }, [page]);

    useEffect(() => {
        fetchRoles();
    }, []);

    return { contextHolder, users, page, setPage, total, deleteModal, setDeleteModal, selectedUser, setSelectedUser, handleConfirmDelete }
}

"use client";
import { useUserMangement } from "@/hook/useUserMangement";
import { User } from "@/models/User";
import { Avatar, Space, Table, Tag, Switch, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { motion } from "framer-motion";
import { DeleteUserModal } from "./DeleteUserModal";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import { ApiResponse } from "@/models/ApiResponse";
import { userService } from "@/services/user.service";

const UserTable = () => {
  const PAGE_SIZE = 8;
  const {
    contextHolder,
    users,
    page,
    setPage,
    total,
    deleteModal,
    setDeleteModal,
    selectedUser,
    setSelectedUser,
    handleConfirmDelete,
    handleUpdateUser,
  } = useUserMangement(PAGE_SIZE);

  const [loadingStatus, setLoadingStatus] = useState<Record<string, boolean>>(
    {},
  );

  const column: ColumnsType<User> = [
    {
      title: "FullName",
      dataIndex: "fullName",
      key: "fullName",
      render: (text: string) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}>
            U
          </Avatar>
          <div style={{ fontWeight: 500 }}>{text}</div>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (value: boolean, record: User) => (
        <Tooltip title={value ? "Click to deactivate" : "Click to activate"}>
          <Switch
            checked={value}
            loading={loadingStatus[record.id]}
            onChange={() => handleUpdateUser(record.id)}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
          />
        </Tooltip>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record: User) => (
        <Space size="middle">
          {/* <span
            className="px-3 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition-colors"
            // onClick={() => handleUpdateClick(record)}
          >
            <EditOutlined />
          </span> */}

          <span
            className="px-3 py-2 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600 transition-colors"
            onClick={() => {
              setSelectedUser(record);
              setDeleteModal(true);
            }}
          >
            <DeleteOutlined />
          </span>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div>
        <div className="mx-auto mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-linear-to-r bg-clip-text text-black">
                  User Management
                </h1>
                <p className="text-slate-600 mt-1">Total {total} users</p>
              </div>
            </div>
          </div>
        </div>
        <motion.div
          className="relative h-auto bg-[#ffffff] shadow-lg p-5 rounded-xl flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Table<User>
            dataSource={users}
            columns={column}
            pagination={{
              pageSize: PAGE_SIZE,
              showSizeChanger: false,
              placement: ["bottomEnd"],
              current: page,
              total: total,
              onChange: setPage,
            }}
            rowKey="id"
          />

          {/* Delete User */}
          <DeleteUserModal
            isOpen={deleteModal}
            user={selectedUser}
            onClose={() => setDeleteModal(false)}
            onConfirm={handleConfirmDelete}
          />
        </motion.div>
      </div>
    </>
  );
};

export default UserTable;

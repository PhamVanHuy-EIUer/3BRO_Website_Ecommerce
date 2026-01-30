"use client";
import { useUserMangement } from "@/hook/useUserMangement";
import { User } from "@/models/User";
import { Avatar, Space, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { motion } from "framer-motion";
import { DeleteUserModal } from "./DeleteUserModal";
import { Search } from "lucide-react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

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
  } = useUserMangement(PAGE_SIZE);
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
      render: (value: boolean) => (
        <Tag color={value ? "green" : "red"}>
          {value ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record: User) => (
        <Space size="middle">
          <span
            className="px-3 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition-colors"
            // onClick={() => handleUpdateClick(record)}
          >
            <EditOutlined />
          </span>

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
        <motion.div
          className="relative h-auto bg-[#f5f5f5] p-5 rounded-xl flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-950">
              User List
            </h2>
            <div className="flex justify-center items-center gap-4">
              <div className="relative justify-end">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="bg-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  // onChange={(e) => setSearch(e.target.value)}
                  // value={search}
                />
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
              </div>
              {/* {!addModal && (
                <div className="flex justify-center ">
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition-colors"
                    onClick={() => {
                      handleAddClick();
                    }}
                  >
                    Add Product
                  </button>
                </div>
              )} */}
            </div>
          </div>

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

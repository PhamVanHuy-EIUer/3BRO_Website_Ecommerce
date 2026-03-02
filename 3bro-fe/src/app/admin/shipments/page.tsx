"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Table,
  Tag,
  Space,
  Button,
  Input,
  Select,
  Modal,
  Form,
  Popconfirm,
  notification,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  CarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { shipmentService } from "@/services/shipment.service";
import { ApiResponse } from "@/models/ApiResponse";

const { Search } = Input;
const { Option } = Select;

enum ShipmentStatus {
  Pending = 0,
  Shipping = 1,
  Delivered = 2,
  Failed = 3,
}

interface Shipment {
  id: string;
  orderId: string;
  shipperName: string;
  trackingNumber: string;
  shipDate: string | null;
  deliveryDate: string | null;
  status: string;
}

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  "0": { label: "Pending", color: "warning", icon: <ClockCircleOutlined /> },
  Pending: {
    label: "Pending",
    color: "warning",
    icon: <ClockCircleOutlined />,
  },
  "1": { label: "Shipping", color: "processing", icon: <CarOutlined /> },
  Shipping: { label: "Shipping", color: "processing", icon: <CarOutlined /> },
  "2": { label: "Delivered", color: "success", icon: <CheckCircleOutlined /> },
  Delivered: {
    label: "Delivered",
    color: "success",
    icon: <CheckCircleOutlined />,
  },
  "3": { label: "Failed", color: "error", icon: <CloseCircleOutlined /> },
  Failed: { label: "Failed", color: "error", icon: <CloseCircleOutlined /> },
};

const AdminShipment = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [total, setTotal] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  // Modal states
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editForm] = Form.useForm();

  const fetchAllShipments = async () => {
    try {
      setLoading(true);
      const data: ApiResponse<Shipment> =
        await shipmentService.getShipmentsByPage(1, 1000);
      if (data.isSuccess) {
        setShipments(data.list);
        setTotal(data.totalElement || data.list.length);
      } else {
        api.error({ message: "Error", description: data.message });
      }
    } catch (error) {
      console.error("Error fetching shipments:", error);
      api.error({
        message: "Error",
        description: "Failed to fetch shipments.",
      });
      setShipments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchShipmentsByStatus = async (status: number) => {
    try {
      setLoading(true);
      const data: ApiResponse<Shipment> =
        await shipmentService.getShipmentByStatus(status);
      if (data.isSuccess) {
        setShipments(data.list);
        setTotal(data.totalElement || data.list.length);
      } else {
        api.error({ message: "Error", description: data.message });
        setShipments([]);
      }
    } catch (error) {
      console.error("Error fetching shipments by status:", error);
      api.error({
        message: "Error",
        description: "Failed to fetch shipments by status.",
      });
      setShipments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setSearchTerm(""); // reset search khi đổi filter
    if (value === "all") {
      fetchAllShipments();
    } else {
      const statusMap: Record<string, number> = {
        Pending: 0,
        Shipping: 1,
        Delivered: 2,
        Failed: 3,
      };
      if (statusMap[value] !== undefined) {
        fetchShipmentsByStatus(statusMap[value]);
      }
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchAllShipments();
  }, []);

  if (!mounted) return null;

  const openEditModal = (record: Shipment) => {
    setEditingShipment(record);
    const statusToNumber: Record<string, number> = {
      Pending: 0,
      "0": 0,
      Shipping: 1,
      "1": 1,
      Delivered: 2,
      "2": 2,
      Failed: 3,
      "3": 3,
    };
    editForm.setFieldsValue({
      status: statusToNumber[record.status] ?? 0,
    });
    setIsEditModalVisible(true);
  };

  const handleEditClose = () => {
    setIsEditModalVisible(false);
    setEditingShipment(null);
    editForm.resetFields();
  };

  const handleEditSubmit = async (values: { status: number }) => {
    if (!editingShipment) return;
    try {
      setSubmitting(true);
      // updateShipment(id, status) — đúng theo service
      const res: ApiResponse<any> = await shipmentService.updateShipment(
        editingShipment.id,
        values.status,
      );
      if (res.isSuccess || res.code === "200") {
        api.success({
          message: "Success",
          description: "Shipment status updated!",
        });
        handleEditClose();
        if (statusFilter === "all") fetchAllShipments();
        else handleStatusFilterChange(statusFilter);
      } else {
        api.error({ message: "Error", description: res.message });
      }
    } catch (error) {
      console.error("Error updating shipment:", error);
      api.error({
        message: "Error",
        description: "An error occurred while updating.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await shipmentService.deleteShipment(id);
      if (res.isSuccess || res.code === "200") {
        api.success({
          message: "Success",
          description: "Shipment deleted successfully!",
        });
        if (statusFilter === "all") fetchAllShipments();
        else handleStatusFilterChange(statusFilter);
      } else {
        api.error({ message: "Error", description: res.message });
      }
    } catch (error) {
      console.error("Error deleting shipment:", error);
      api.error({
        message: "Error",
        description: "Failed to delete shipment.",
      });
    }
  };

  const allShipmentsForStats = shipments; // dùng danh sách hiện tại
  const stats = [
    {
      label: "Total Shipments",
      value: total,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Pending",
      value: allShipmentsForStats.filter(
        (s) => s.status === "0" || s.status === "Pending",
      ).length,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      label: "Shipping",
      value: allShipmentsForStats.filter(
        (s) => s.status === "1" || s.status === "Shipping",
      ).length,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Delivered",
      value: allShipmentsForStats.filter(
        (s) => s.status === "2" || s.status === "Delivered",
      ).length,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  // ─── Client-side search filter (chỉ dùng để search trong kết quả đã lọc) ──
  const filteredShipments = shipments.filter((shipment) => {
    if (!searchTerm) return true;
    return (
      shipment.trackingNumber
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      shipment.shipperName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const columns: ColumnsType<Shipment> = [
    {
      title: "Tracking Number",
      dataIndex: "trackingNumber",
      key: "trackingNumber",
      render: (text: string) => (
        <span className="font-bold text-blue-600 font-mono">
          {text || "N/A"}
        </span>
      ),
    },
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      render: (text: string) => (
        <span className="text-gray-600 font-mono text-sm">
          {text ? `#${text.slice(0, 8)}...` : "N/A"}
        </span>
      ),
    },
    {
      title: "Shipper Name",
      dataIndex: "shipperName",
      key: "shipperName",
      render: (text: string) => (
        <span className="font-medium text-gray-800">{text}</span>
      ),
    },
    {
      title: "Ship Date",
      dataIndex: "shipDate",
      key: "shipDate",
      render: (date: string) => (
        <span className="text-gray-600">
          {date ? dayjs(date).format("MMM DD, YYYY") : "-"}
        </span>
      ),
    },
    {
      title: "Delivery Date",
      dataIndex: "deliveryDate",
      key: "deliveryDate",
      render: (date: string) => (
        <span className="text-gray-600">
          {date ? dayjs(date).format("MMM DD, YYYY") : "-"}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const config = statusConfig[status] || {
          label: status,
          color: "default",
          icon: <InboxOutlined />,
        };
        return (
          <Tag
            icon={config.icon}
            color={config.color}
            className="px-3 py-1 font-medium"
          >
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "action",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            className="text-blue-600 hover:bg-blue-50"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          />
          <Popconfirm
            title="Delete the shipment"
            description="Are you sure to delete this shipment?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      {contextHolder}
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="mx-auto mb-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Shipment Management
                </h1>
                <p className="text-slate-500 mt-1">
                  Manage deliveries and tracking
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${stat.bgColor} rounded-xl p-5 border border-white shadow-sm`}
                >
                  <p className="text-sm text-gray-500 font-medium mb-1">
                    {stat.label}
                  </p>
                  <p className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Search
                placeholder="Search by Tracking Number, Shipper, or Order ID..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
                size="large"
                allowClear
              />
              <Select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                size="large"
                className="w-full sm:w-56"
                loading={loading}
              >
                <Option value="all">All Statuses</Option>
                <Option value="Pending">Pending</Option>
                <Option value="Shipping">Shipping</Option>
                <Option value="Delivered">Delivered</Option>
                <Option value="Failed">Failed</Option>
              </Select>
            </div>

            {/* Table */}
            <Table
              columns={columns}
              dataSource={filteredShipments}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} shipments`,
              }}
              scroll={{ x: 1000 }}
              className="border border-gray-100 rounded-lg"
            />
          </motion.div>
        </div>
      </div>

      <Modal
        title={
          <div className="flex items-center gap-2 text-lg">
            <EditOutlined className="text-blue-600" />
            Update Shipment Status
          </div>
        }
        open={isEditModalVisible}
        onCancel={handleEditClose}
        footer={null}
        destroyOnHidden
        centered
      >
        {editingShipment && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium text-gray-700">Shipment ID:</span>{" "}
              <span className="font-mono">{editingShipment.id}</span>
            </p>
            <p>
              <span className="font-medium text-gray-700">
                Tracking Number:
              </span>{" "}
              <span className="font-mono text-blue-600">
                {editingShipment.trackingNumber}
              </span>
            </p>
            <p>
              <span className="font-medium text-gray-700">Order:</span>{" "}
              <span className="font-mono">
                #{editingShipment.orderId?.slice(0, 8)}...
              </span>
            </p>
          </div>
        )}

        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditSubmit}
          className="mt-2"
        >
          <Form.Item
            name="status"
            label="New Status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select placeholder="Select new status" size="large">
              <Option value={0}>
                <span className="flex items-center gap-2">
                  <ClockCircleOutlined className="text-amber-500" /> Pending
                  (Chờ lấy hàng)
                </span>
              </Option>
              <Option value={1}>
                <span className="flex items-center gap-2">
                  <CarOutlined className="text-blue-500" /> Shipping (Đang giao)
                </span>
              </Option>
              <Option value={2}>
                <span className="flex items-center gap-2">
                  <CheckCircleOutlined className="text-green-500" /> Delivered
                  (Đã giao)
                </span>
              </Option>
              <Option value={3}>
                <span className="flex items-center gap-2">
                  <CloseCircleOutlined className="text-red-500" /> Failed (Giao
                  thất bại)
                </span>
              </Option>
            </Select>
          </Form.Item>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              className="bg-blue-600"
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default AdminShipment;

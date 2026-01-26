"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  InputNumber,
  DatePicker,
  Switch,
  Space,
  Popconfirm,
  Tag,
  message,
  Card,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  GiftOutlined,
  PercentageOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { discountService } from "@/services/discount.service";
import { Discount } from "@/models/Discount";
import { ApiResponse } from "@/models/ApiResponse";
import { DiscountDTO } from "@/models/DiscountDTO";

const { RangePicker } = DatePicker;

export default function DiscountManagement() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [searchText, setSearchText] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountValue: 0,
    isPercent: true,
    minOrderAmount: 0,
    quantity: 100,
    dateRange: null as any,
  });

  // Fetch all discounts
  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const data: ApiResponse<Discount> = await discountService.getDiscount();
      // Ensure data is an array
      setDiscounts(data.list || []);
    } catch (error) {
      message.error("Không thể tải danh sách discount");
      console.error("Error fetching discounts:", error);
      setDiscounts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      discountValue: 0,
      isPercent: true,
      minOrderAmount: 0,
      quantity: 100,
      dateRange: null,
    });
  };

  // Handle create/update
  const handleSubmit = async () => {
    // Validation
    if (!formData.code || !formData.dateRange) {
      message.warning("Please enter all fill");
      return;
    }

    try {
      setLoading(true);

      const payload: DiscountDTO = {
        id: editingDiscount?.id,
        code: formData.code.toUpperCase(),
        description: formData.description,
        discountValue: formData.discountValue || 0,
        isPercent: formData.isPercent,
        minOrderAmount: formData.minOrderAmount || 0,
        startDate: formData.dateRange[0].endOf("day").toISOString(),
        expiredDate: formData.dateRange[1].endOf("day").toISOString(),
        quantity: formData.quantity || 0,
      };

      if (editingDiscount && editingDiscount.id) {
        // Update
        try {
          const res: ApiResponse<Discount> =
            await discountService.updateDiscount(editingDiscount.id, payload);
          if (res.code !== "200") {
            message.error(res.message);
            return;
          }
          message.success(res.message);
        } catch (err) {
          console.log(err);
        }
      } else {
        // Create
        try {
          console.log(payload);
          const res: ApiResponse<Discount> =
            await discountService.addDiscount(payload);
          if (res.code !== "201") {
            message.error(res.message);

            return;
          }
          message.success(res.message);
        } catch (err) {
          console.log(err);
        }
      }

      // Refresh list
      await fetchDiscounts();
      setIsModalOpen(false);
      resetForm();
      setEditingDiscount(null);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Error occurred";
      message.error(errorMessage);
      console.error("Error saving discount:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const res: ApiResponse<any> = await discountService.deleteDiscount(id);
      if (res.code === "200") message.success("Xóa discount thành công");
      else message.error(res.message);

      // Refresh list
      await fetchDiscounts();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Không thể xóa discount";
      message.error(errorMessage);
      console.error("Error deleting discount:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (record: Discount) => {
    setEditingDiscount(record);

    // Convert Discount to form data
    const discountValue =
      record.discountPercent > 0
        ? record.discountPercent
        : record.discountAmount;
    const isPercent = record.discountPercent > 0;

    setFormData({
      code: record.code,
      description: record.description || "",
      discountValue: discountValue,
      isPercent: isPercent,
      minOrderAmount: record.minOrderAmount,
      quantity: record.quantity,
      dateRange: [dayjs(record.startDate), dayjs(record.endDate)],
    });
    setIsModalOpen(true);
  };

  const handleStatusDiscount = async (
    discountId: string,
    isActive: boolean,
  ) => {
    // 1. Optimistic update
    setDiscounts((prev) =>
      prev.map((item) =>
        item.id === discountId ? { ...item, isActive } : item,
      ),
    );

    try {
      const res: ApiResponse<any> = await discountService.updateStatus(
        discountId,
        isActive,
      );

      if (res.code !== "200") {
        throw new Error(res.object);
      }

      message.success(res.object);
    } catch {
      // 2. Rollback nếu fail
      setDiscounts((prev) =>
        prev.map((item) =>
          item.id === discountId ? { ...item, isActive: !isActive } : item,
        ),
      );
      message.error("Update status failed");
    }
  };

  // Filter discounts
  const filteredDiscounts = discounts.filter(
    (d) =>
      d.code.toLowerCase().includes(searchText.toLowerCase()) ||
      (d.description &&
        d.description.toLowerCase().includes(searchText.toLowerCase())),
  );

  // Statistics
  const totalDiscounts = discounts.length;
  const activeDiscounts = discounts.filter((d) => d.isActive).length;
  const expiredDiscounts = discounts.filter(
    (d) => new Date(d.endDate) < new Date(),
  ).length;

  // Table columns
  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      width: 120,
      render: (text: string) => (
        <strong style={{ color: "#ee4d2d" }}>{text}</strong>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Discount",
      key: "discount",
      width: 150,
      render: (_: any, record: Discount) => (
        <Space>
          {record.discountPercent > 0 && (
            <Tag color="green" icon={<PercentageOutlined />}>
              {record.discountPercent}%
            </Tag>
          )}
          {record.discountAmount > 0 && (
            <Tag color="blue" icon={<DollarOutlined />}>
              {formatCurrency(record.discountAmount)}
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Minimum Order",
      dataIndex: "minOrderAmount",
      key: "minOrderAmount",
      width: 130,
      render: (value: number) => formatCurrency(value),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      align: "center" as const,
    },
    {
      title: "Time",
      key: "dateRange",
      width: 200,
      render: (_: any, record: Discount) => (
        <div style={{ fontSize: 12 }}>
          <div>{formatDate(record.startDate)}</div>
          <div>{formatDate(record.endDate)}</div>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      width: 120,
      align: "center" as const,
      render: (_: any, record: Discount) => {
        const isExpired = new Date(record.endDate) < new Date();
        return (
          <Space orientation="vertical" size={4}>
            {record.isActive && !isExpired ? (
              <Tag color="green">Active</Tag>
            ) : isExpired ? (
              <Tag color="red">Expried</Tag>
            ) : (
              <Tag color="red">Inactive</Tag>
            )}
            <Switch
              checked={record.isActive}
              disabled={isExpired || loading}
              checkedChildren="Active"
              unCheckedChildren="Inactive"
              onChange={(checked) => {
                handleStatusDiscount(record.id!, checked);
              }}
            />
          </Space>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      align: "center" as const,
      fixed: "right" as const,
      render: (_: any, record: Discount) => (
        <Space>
          <span
            onClick={() => handleEdit(record)}
            className="cursor-pointer px-2.25 py-1.75 bg-[#155BFA] justify-center items-center rounded-md"
          >
            <EditOutlined className="!text-white" />
          </span>

          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: (
                  <>
                    <p>Are you sure to delete this account?</p>
                  </>
                ),
                content: (
                  <div>
                    <p>
                      <span className="font-semibold">Delete discount</span>{" "}
                      {record.code}
                    </p>
                    <p>
                      <span className="font-semibold">Code description:</span>{" "}
                      {record.description}
                    </p>
                    <p>
                      <span className="font-semibold">Discount:</span>{" "}
                      {record.discountAmount
                        ? formatCurrency(record.discountAmount)
                        : `${record.discountPercent}%`}
                    </p>
                    <p>
                      <span className="font-semibold">Minimum Order: </span>{" "}
                      {record.minOrderAmount}
                    </p>
                    <p>
                      <span className="font-semibold">Quantity:</span>{" "}
                      {record.quantity}
                    </p>
                    <p>
                      <span className="font-semibold">Time:</span>{" "}
                      {formatDate(record.startDate)} -{" "}
                      {formatDate(record.endDate)}
                    </p>
                  </div>
                ),
                footer: (_, { OkBtn, CancelBtn }) => (
                  <>
                    <CancelBtn />
                    <OkBtn />
                  </>
                ),
                okText: "Delete",
                cancelText: "Cancel",
                onOk: () => record.id && handleDelete(record.id),
              });
            }}
          />
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchDiscounts();
  }, []);

  return (
    <div
      style={{
        padding: 24,
        background: "#f0f2f5",
        minHeight: "100vh",
        width: "100%",
        borderRadius: 10,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>
          <GiftOutlined style={{ marginRight: 8 }} />
          Discount Management
        </h1>
      </div>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total discount"
              value={totalDiscounts}
              styles={{
                content: { color: "#3f8600" },
              }}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Statistic title="In use" value={activeDiscounts} />
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Statistic
              title="Expired"
              value={expiredDiscounts}
              styles={{
                content: { color: "#cf1322" },
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Action bar */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Input
              placeholder="Tìm kiếm theo mã hoặc mô tả..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size="large"
              style={{ maxWidth: 400 }}
            />
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => {
                setEditingDiscount(null);
                resetForm();
                setIsModalOpen(true);
              }}
              style={{ backgroundColor: "#ee4d2d" }}
            >
              Create Discount
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredDiscounts}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} discount`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        className="!z-15"
        title={editingDiscount ? "Update Discount" : "Create new Discount"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          resetForm();
          setEditingDiscount(null);
        }}
        onOk={handleSubmit}
        okText={editingDiscount ? "Update" : "Create"}
        cancelText="Cancel"
        width={700}
        confirmLoading={loading}
        okButtonProps={{ style: { backgroundColor: "#ee4d2d" } }}
      >
        <div style={{ padding: "20px 0" }}>
          {/* Code */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
            >
              Discount Code<span style={{ color: "red" }}>*</span>
            </label>
            <Input
              placeholder="VD: SALE10, FREESHIP"
              size="large"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value.toUpperCase() })
              }
              style={{ textTransform: "uppercase" }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
            >
              Description
            </label>
            <Input.TextArea
              placeholder="Discount details"
              rows={3}
              size="large"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/* Discount values */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={12}>
              <label
                style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
              >
                Sale %
              </label>
              <Space.Compact style={{ width: "100%" }}>
                <InputNumber
                  min={0}
                  max={formData.isPercent ? 100 : undefined}
                  size="large"
                  style={{ width: "100%" }}
                  value={formData.discountValue}
                  formatter={(value) =>
                    formData.isPercent
                      ? `${value}%`
                      : value
                        ? value.toLocaleString("vi-VN")
                        : ""
                  }
                  parser={(value) =>
                    formData.isPercent
                      ? Number(value?.replace("%", ""))
                      : Number(value?.replace(/,/g, ""))
                  }
                  onChange={(value) =>
                    setFormData({ ...formData, discountValue: value || 0 })
                  }
                />
              </Space.Compact>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
                >
                  Type discount
                </label>
                <Switch
                  checked={formData.isPercent}
                  onChange={(checked) =>
                    setFormData({ ...formData, isPercent: checked })
                  }
                  checkedChildren="%"
                  unCheckedChildren="VNĐ"
                />
              </div>
            </Col>
          </Row>

          {/* Min order and quantity */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={12}>
              <label
                style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
              >
                Minimum order amount
              </label>
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                size="large"
                value={formData.minOrderAmount}
                formatter={(value?: number) =>
                  value ? value.toLocaleString("vi-VN") : ""
                }
                parser={(value?: string) =>
                  value ? Number(value.replace(/,/g, "")) : 0
                }
                onChange={(value: number | null) =>
                  setFormData({ ...formData, minOrderAmount: value ?? 0 })
                }
              />
            </Col>
            <Col span={12}>
              <label
                style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
              >
                Number discounts <span style={{ color: "red" }}>*</span>
              </label>
              <InputNumber
                min={1}
                style={{ width: "100%" }}
                size="large"
                placeholder="100"
                value={formData.quantity}
                onChange={(value) =>
                  setFormData({ ...formData, quantity: value || 100 })
                }
              />
            </Col>
          </Row>

          {/* Date range */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
            >
              Thời gian áp dụng <span style={{ color: "red" }}>*</span>
            </label>
            <RangePicker
              style={{ width: "100%" }}
              size="large"
              format="DD/MM/YYYY"
              placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
              value={formData.dateRange}
              onChange={(dates) =>
                setFormData({ ...formData, dateRange: dates })
              }
            />
          </div>

          {/* Active switch */}
        </div>
      </Modal>
    </div>
  );
}

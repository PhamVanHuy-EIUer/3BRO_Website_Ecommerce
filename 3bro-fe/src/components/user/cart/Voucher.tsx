import React, { useState, useEffect } from "react";
import { Modal, Input, Button, List, Radio, Space, Alert, message } from "antd";
import { GiftOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useCart } from "@/hook/User/useCart";
import { ApiResponse } from "@/models/ApiResponse";
import { Discount } from "@/models/Discount";
import { discountService } from "@/services/discount.service";

export default function Voucher() {
  const [selectedDiscountId, setSelectedDiscountId] = useState<number | null>(
    null,
  );
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const { isOpenVoucher, setIsOpenVoucher } = useCart();
  const [voucherCode, setVoucherCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch discounts khi modal mở
  useEffect(() => {
    if (isOpenVoucher) {
      fetchDiscount();
    }
  }, [isOpenVoucher]);

  const fetchDiscount = async () => {
    try {
      setLoading(true);
      const res: ApiResponse<Discount> = await discountService.getDiscount();
      // Lọc các discount còn active và còn số lượng
      const activeDiscounts = res.list.filter(
        (d) => d.isActive && d.quantity > 0,
      );
      setDiscounts(activeDiscounts);
    } catch (err) {
      console.log(err);
      message.error("Không thể tải danh sách voucher");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    const selectedDiscount = discounts.find((d) => d.id === selectedDiscountId);

    if (!selectedDiscount) return;

    Modal.success({
      title: "Áp dụng thành công!",
      content: `Đã áp dụng voucher: ${selectedDiscount.code}`,
    });

    setIsOpenVoucher(false);
  };

  const handleCancel = () => {
    setSelectedDiscountId(null);
    setVoucherCode("");
    setIsOpenVoucher(false);
  };

  const handleApplyCode = async () => {
    if (!voucherCode.trim()) {
      message.warning("Vui lòng nhập mã voucher");
      return;
    }

    // Tìm voucher theo code
    const foundDiscount = discounts.find(
      (d) => d.code.toLowerCase() === voucherCode.toLowerCase().trim(),
    );

    if (foundDiscount) {
      setSelectedDiscountId(foundDiscount.id);
      message.success(`Đã chọn voucher: ${foundDiscount.code}`);
    } else {
      message.error("Mã voucher không hợp lệ hoặc đã hết hạn");
    }
  };

  // Format tiền VND
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Format ngày
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Kiểm tra voucher còn hạn không
  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  // Tính toán giá trị giảm giá hiển thị
  const getDiscountDisplay = (discount: Discount) => {
    if (discount.discountPercent > 0) {
      return `${discount.discountPercent}%`;
    }
    if (discount.discountAmount > 0) {
      return formatCurrency(discount.discountAmount);
    }
    return "GIẢM GIÁ";
  };

  return (
    <div className="w-full">
      <Button
        type="primary"
        icon={<GiftOutlined />}
        onClick={() => setIsOpenVoucher(true)}
        size="large"
      >
        Chọn Shopee Voucher
      </Button>

      <Modal
        title="Chọn Shopee Voucher"
        open={isOpenVoucher}
        onCancel={handleCancel}
        width={700}
        footer={[
          <Button key="back" size="large" onClick={handleCancel}>
            TRỞ LẠI
          </Button>,
          <Button
            key="submit"
            type="primary"
            size="large"
            disabled={!selectedDiscountId}
            onClick={handleApply}
            style={{
              backgroundColor: selectedDiscountId ? "#ee4d2d" : undefined,
            }}
          >
            ĐỒNG Ý
          </Button>,
        ]}
      >
        {/* Input nhập mã voucher */}
        <Space.Compact style={{ width: "100%", marginBottom: 24 }}>
          <Input
            placeholder="Nhập mã voucher"
            size="large"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            onPressEnter={handleApplyCode}
          />
          <Button size="large" onClick={handleApplyCode}>
            ÁP DỤNG
          </Button>
        </Space.Compact>

        {/* Danh sách voucher */}
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 16 }}>
            Mã Giảm Giá Khả Dụng ({discounts.length})
          </h3>

          <Radio.Group
            value={selectedDiscountId}
            onChange={(e) => setSelectedDiscountId(e.target.value)}
            style={{ width: "100%" }}
          >
            <List
              loading={loading}
              dataSource={discounts}
              locale={{ emptyText: "Không có voucher khả dụng" }}
              renderItem={(item) => {
                const isSelected = selectedDiscountId === item.id;
                const expired = isExpired(item.endDate);

                return (
                  <List.Item
                    style={{
                      border: isSelected
                        ? "2px solid #ee4d2d"
                        : "1px solid #e5e5e5",
                      borderRadius: 8,
                      marginBottom: 12,
                      padding: 16,
                      backgroundColor: isSelected ? "#fff5f2" : "#fff",
                      transition: "all 0.3s",
                      opacity: expired ? 0.5 : 1,
                    }}
                  >
                    <Radio
                      value={item.id}
                      style={{ width: "100%" }}
                      disabled={expired}
                    >
                      <div style={{ display: "flex", gap: 12, width: "100%" }}>
                        {/* Icon voucher */}
                        <div
                          style={{
                            width: 64,
                            height: 64,
                            minWidth: 64,
                            backgroundColor: expired ? "#ccc" : "#ee4d2d",
                            borderRadius: 8,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: 12,
                            textAlign: "center",
                            padding: 4,
                          }}
                        >
                          {getDiscountDisplay(item)}
                        </div>

                        {/* Nội dung voucher */}
                        <div style={{ flex: 1 }}>
                          {/* Title */}
                          <div style={{ marginBottom: 8 }}>
                            <Space>
                              <span style={{ fontWeight: 500, fontSize: 14 }}>
                                {item.code}
                              </span>
                              {expired && (
                                <span
                                  style={{ color: "#ff4d4f", fontSize: 12 }}
                                >
                                  (Hết hạn)
                                </span>
                              )}
                            </Space>
                          </div>

                          {/* Description */}
                          <div
                            style={{
                              fontSize: 13,
                              marginBottom: 8,
                              color: "#333",
                            }}
                          >
                            {item.description}
                          </div>

                          {/* Details */}
                          <div style={{ fontSize: 12, color: "#888" }}>
                            <div style={{ marginBottom: 4 }}>
                              • Đơn tối thiểu:{" "}
                              {formatCurrency(item.minOrderAmount)}
                            </div>
                            <div style={{ marginBottom: 4 }}>
                              • Số lượng còn lại: {item.quantity}
                            </div>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <ClockCircleOutlined style={{ marginRight: 4 }} />
                              HSD: {formatDate(item.startDate)} -{" "}
                              {formatDate(item.endDate)}
                            </div>
                          </div>

                          {/* Alert */}
                          {item.minOrderAmount > 0 && (
                            <Alert
                              message={`Áp dụng cho đơn hàng từ ${formatCurrency(item.minOrderAmount)}`}
                              type="info"
                              showIcon
                              style={{ marginTop: 8, fontSize: 12 }}
                            />
                          )}
                        </div>
                      </div>
                    </Radio>
                  </List.Item>
                );
              }}
            />
          </Radio.Group>
        </div>
      </Modal>
    </div>
  );
}

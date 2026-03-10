import { useState, useEffect } from "react";
import {
  Modal,
  Input,
  Button,
  Radio,
  Space,
  Alert,
  message,
  Empty,
  Spin,
} from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { ApiResponse } from "@/models/ApiResponse";
import { Discount } from "@/models/Discount";
import { discountService } from "@/services/discount.service";

interface VoucherProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (discount: Discount) => void;
  vouchers?: Discount[];
}

export default function Voucher({
  isOpen,
  onClose,
  onApply,
  vouchers: externalVouchers,
}: VoucherProps) {
  const [selectedDiscountId, setSelectedDiscountId] = useState<string>("");
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [voucherCode, setVoucherCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch discounts khi modal mở
  useEffect(() => {
    if (isOpen) {
      if (externalVouchers) {
        // Use vouchers from PaymentProduct API response
        const activeDiscounts = externalVouchers.filter(
          (d) => d.isActive && d.quantity > 0 && !isExpired(d.endDate),
        );
        setDiscounts(activeDiscounts);
      } else {
        fetchDiscount();
      }
    }
  }, [isOpen, externalVouchers]);

  const fetchDiscount = async () => {
    try {
      setLoading(true);
      const res: ApiResponse<Discount> = await discountService.getDiscount();
      // Lọc các discount còn active và còn số lượng
      const activeDiscounts = res.list.filter(
        (d) => d.isActive && d.quantity > 0 && !isExpired(d.endDate),
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

    if (!selectedDiscount) {
      message.warning("Vui lòng chọn voucher");
      return;
    }

    onApply(selectedDiscount);

    handleCancel();
  };

  const handleCancel = () => {
    setSelectedDiscountId("");
    setVoucherCode("");
    onClose();
  };

  const handleApplyCode = async () => {
    if (!voucherCode.trim()) {
      message.warning("Please enter voucher code");
      return;
    }

    // Tìm voucher theo code
    const foundDiscount = discounts.find(
      (d) => d.code.toLowerCase() === voucherCode.toLowerCase().trim(),
    );

    if (foundDiscount) {
      setSelectedDiscountId(foundDiscount.code);
      message.success(`Đã chọn voucher: ${foundDiscount.code}`);
      setVoucherCode("");
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
    return "DISCOUNT";
  };

  return (
    <Modal
      title={
        <div style={{ fontSize: 18, fontWeight: 600 }}>Choose voucher</div>
      }
      open={isOpen}
      onCancel={handleCancel}
      width={700}
      footer={[
        <Button key="back" size="large" onClick={handleCancel}>
          GO BACK
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
          ACCEPT
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
        <Button size="large" type="primary" onClick={handleApplyCode}>
          APPLY
        </Button>
      </Space.Compact>

      {/* Danh sách voucher */}
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 16 }}>
          Discount invalid ({discounts.length})
        </h3>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <Spin size="large" />
          </div>
        ) : discounts.length === 0 ? (
          <Empty
            description="Không có voucher khả dụng"
            style={{ padding: "40px 0" }}
          />
        ) : (
          <Radio.Group
            value={selectedDiscountId}
            onChange={(e) => setSelectedDiscountId(e.target.value)}
            style={{ width: "100%" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {discounts.map((item) => {
                const isSelected = selectedDiscountId === item.id;

                return (
                  <div
                    key={item.id}
                    style={{
                      border: isSelected
                        ? "2px solid #ee4d2d"
                        : "1px solid #e5e5e5",
                      borderRadius: 8,
                      padding: 16,
                      backgroundColor: isSelected ? "#fff5f2" : "#fff",
                      transition: "all 0.3s",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedDiscountId(item.code)}
                  >
                    <Radio value={item.id} style={{ width: "100%" }}>
                      <div style={{ display: "flex", gap: 12, width: "100%" }}>
                        {/* Icon voucher */}
                        <div
                          style={{
                            width: 64,
                            height: 64,
                            minWidth: 64,
                            backgroundColor: "#ee4d2d",
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
                            <span style={{ fontWeight: 500, fontSize: 14 }}>
                              {item.code}
                            </span>
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
                              • Number of vouchers: {item.quantity}
                            </div>
                            {item.maxDiscountAmount && (
                              <div style={{ marginBottom: 4 }}>
                                • Max discount amount:{" "}
                                {formatCurrency(item.maxDiscountAmount)}
                              </div>
                            )}
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <ClockCircleOutlined style={{ marginRight: 4 }} />
                              Expire: {formatDate(item.startDate)} -{" "}
                              {formatDate(item.endDate)}
                            </div>
                          </div>

                          {/* Alert */}
                          {item.minOrderAmount > 0 && (
                            <Alert
                              title={`Áp dụng cho đơn hàng từ ${formatCurrency(item.minOrderAmount)}`}
                              type="info"
                              showIcon
                              style={{ marginTop: 8, fontSize: 12 }}
                            />
                          )}
                        </div>
                      </div>
                    </Radio>
                  </div>
                );
              })}
            </div>
          </Radio.Group>
        )}
      </div>
    </Modal>
  );
}

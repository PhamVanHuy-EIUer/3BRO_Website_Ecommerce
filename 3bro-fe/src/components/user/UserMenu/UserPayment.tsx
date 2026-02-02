"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  Radio,
  Button,
  Modal,
  List,
  Tag,
  Result,
  Space,
  Typography,
  Divider,
  Image,
  Row,
  Col,
  message,
  Spin,
  RadioChangeEvent,
  Flex,
} from "antd";
import {
  HomeOutlined,
  CarOutlined,
  WalletOutlined,
  BankOutlined,
  GiftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CreditCardOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

// Type Definitions
interface Address {
  id: number;
  name: string;
  phone: string;
  address: string;
  city: string;
}

interface Product {
  id: number;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface Voucher {
  code: string;
  type: "percent" | "shipping" | "fixed";
  value: number;
  max?: number;
  description: string;
  condition: string;
}

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  duration: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface Order {
  id: string;
  items: Product[];
  address: Address;
  shipping: string;
  payment: string;
  voucher?: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  createdAt: string;
}

interface OrderResult {
  status: "pending" | "paid" | "failed";
  message: string;
  order: Order;
}

// Fake Data
const fakeAddress: Address = {
  id: 1,
  name: "Nguyễn Văn A",
  phone: "0901234567",
  address: "123 Lê Lợi, Phường Bến Nghé, Quận 1",
  city: "Hồ Chí Minh",
};

const fakeProducts: Product[] = [
  {
    id: 1,
    name: "Áo Thun Nam Basic 3BRO",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    quantity: 2,
    price: 199000,
  },
  {
    id: 2,
    name: "Quần Jean Slim Fit",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
    quantity: 1,
    price: 450000,
  },
];

const vouchers: Voucher[] = [
  {
    code: "3BRO10",
    type: "percent",
    value: 10,
    max: 50000,
    description: "Giảm 10% tối đa 50,000đ",
    condition: "Đơn hàng từ 300,000đ",
  },
  {
    code: "FREESHIP",
    type: "shipping",
    value: 20000,
    description: "Miễn phí vận chuyển",
    condition: "Áp dụng cho mọi đơn hàng",
  },
  {
    code: "NEWUSER",
    type: "fixed",
    value: 30000,
    description: "Giảm 30,000đ",
    condition: "Dành cho khách hàng mới",
  },
];

const shippingMethods: ShippingMethod[] = [
  {
    id: "standard",
    name: "Giao hàng tiêu chuẩn",
    price: 20000,
    duration: "2-3 ngày",
  },
  { id: "express", name: "Giao hàng nhanh", price: 40000, duration: "1 ngày" },
];

const paymentMethods: PaymentMethod[] = [
  {
    id: "cod",
    name: "Thanh toán khi nhận hàng (COD)",
    icon: <WalletOutlined />,
  },
  { id: "vnpay", name: "VNPAY", icon: <CreditCardOutlined /> },
  { id: "ewallet", name: "Ví điện tử", icon: <WalletOutlined /> },
  { id: "bank", name: "Chuyển khoản ngân hàng", icon: <BankOutlined /> },
];

const PaymentUser: React.FC = () => {
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [selectedAddress] = useState<Address>(fakeAddress);
  const [shippingMethod, setShippingMethod] = useState<string>("standard");
  const [paymentMethod, setPaymentMethod] = useState<string>("cod");
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [voucherModalVisible, setVoucherModalVisible] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);

  // Simulate page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Calculate totals
  const subtotal = fakeProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingFee =
    shippingMethods.find((m) => m.id === shippingMethod)?.price || 0;

  const calculateDiscount = (): number => {
    if (!selectedVoucher) return 0;

    if (selectedVoucher.type === "percent") {
      const discount = subtotal * (selectedVoucher.value / 100);
      return Math.min(discount, selectedVoucher.max || discount);
    } else if (selectedVoucher.type === "fixed") {
      return selectedVoucher.value;
    } else if (selectedVoucher.type === "shipping") {
      return Math.min(selectedVoucher.value, shippingFee);
    }
    return 0;
  };

  const discount = calculateDiscount();
  const finalShippingFee =
    selectedVoucher?.type === "shipping"
      ? Math.max(0, shippingFee - discount)
      : shippingFee;
  const totalAmount =
    subtotal +
    finalShippingFee -
    (selectedVoucher?.type !== "shipping" ? discount : 0);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleSelectVoucher = (voucher: Voucher): void => {
    setSelectedVoucher(voucher);
    setVoucherModalVisible(false);
    message.success(`Đã áp dụng mã "${voucher.code}"`);
  };

  const handleRemoveVoucher = (): void => {
    setSelectedVoucher(null);
    message.info("Đã xóa mã giảm giá");
  };

  const handlePayment = (): void => {
    // Validation
    if (!selectedAddress) {
      message.error("Vui lòng chọn địa chỉ giao hàng");
      return;
    }
    if (!shippingMethod) {
      message.error("Vui lòng chọn phương thức vận chuyển");
      return;
    }
    if (!paymentMethod) {
      message.error("Vui lòng chọn phương thức thanh toán");
      return;
    }

    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      const order: Order = {
        id: `3BRO${Date.now()}`,
        items: fakeProducts,
        address: selectedAddress,
        shipping: shippingMethod,
        payment: paymentMethod,
        voucher: selectedVoucher?.code,
        subtotal,
        shippingFee: finalShippingFee,
        discount,
        total: totalAmount,
        createdAt: new Date().toISOString(),
      };

      let result: OrderResult;
      if (paymentMethod === "cod") {
        result = {
          status: "pending",
          message: "Đơn hàng của bạn đã được đặt thành công!",
          order,
        };
      } else {
        // Simulate random payment result for online payments
        const isSuccess = Math.random() > 0.3; // 70% success rate
        result = isSuccess
          ? { status: "paid", message: "Thanh toán thành công!", order }
          : {
              status: "failed",
              message: "Thanh toán thất bại. Vui lòng thử lại.",
              order,
            };
      }

      setOrderResult(result);
      setLoading(false);
    }, 2000);
  };

  const handleCloseResult = (): void => {
    setOrderResult(null);
    // In real app, redirect to order history or home
  };

  // Page Loading Screen
  if (pageLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #fef5e7 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
          size="large"
        />
        <Text style={{ fontSize: 16, color: "#8c8c8c" }}>Loading Page...</Text>
      </div>
    );
  }

  if (orderResult) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #fef5e7 100%)",
          padding: "40px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card
          style={{
            maxWidth: 600,
            width: "100%",
            borderRadius: 16,
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          }}
        >
          <Result
            status={orderResult.status === "failed" ? "error" : "success"}
            title={orderResult.message}
            icon={
              orderResult.status === "failed" ? (
                <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
              ) : (
                <CheckCircleOutlined style={{ color: "#52c41a" }} />
              )
            }
            subTitle={
              <div style={{ textAlign: "left", marginTop: 24 }}>
                <Text strong style={{ fontSize: 16 }}>
                  Mã đơn hàng: {orderResult.order.id}
                </Text>
                <Divider />
                <Space
                  orientation="vertical"
                  size={8}
                  style={{ width: "100%" }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Text>Trạng thái:</Text>
                    <Tag
                      color={
                        orderResult.status === "paid"
                          ? "success"
                          : orderResult.status === "pending"
                            ? "processing"
                            : "error"
                      }
                    >
                      {orderResult.status === "paid"
                        ? "Đã thanh toán"
                        : orderResult.status === "pending"
                          ? "Chờ xác nhận"
                          : "Thanh toán thất bại"}
                    </Tag>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Text>Tổng tiền:</Text>
                    <Text strong style={{ fontSize: 18, color: "#d4380d" }}>
                      {formatCurrency(orderResult.order.total)}
                    </Text>
                  </div>
                </Space>
              </div>
            }
            extra={[
              <Button
                type="primary"
                key="home"
                size="large"
                onClick={handleCloseResult}
                style={{
                  borderRadius: 8,
                  height: 48,
                  background:
                    "linear-gradient(135deg, #d4380d 0%, #ff6b35 100%)",
                  border: "none",
                }}
              >
                Về trang chủ
              </Button>,
            ]}
          />
        </Card>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #fef5e7 100%)",
        padding: "40px 20px",
      }}
    >
      {/* Header */}
      <div style={{ maxWidth: 1200, margin: "0 auto 32px" }}>
        <Title
          level={2}
          style={{
            margin: 0,
            background: "linear-gradient(135deg, #d4380d 0%, #ff6b35 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: 42,
            fontWeight: 700,
          }}
        >
          Thanh toán
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Hoàn tất đơn hàng của bạn
        </Text>
      </div>

      <Row gutter={[24, 24]} style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Left Column - Checkout Information */}
        <Col xs={24} lg={14}>
          <Space orientation="vertical" size={24} style={{ width: "100%" }}>
            {/* Shipping Address */}
            <Card
              title={
                <Space>
                  <HomeOutlined style={{ color: "#d4380d" }} />
                  <Text strong>Địa chỉ giao hàng</Text>
                </Space>
              }
              style={{
                borderRadius: 12,
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                border: "2px solid #fff4e6",
              }}
            >
              {selectedAddress ? (
                <div>
                  <Space orientation="vertical" size={4}>
                    <Text strong style={{ fontSize: 16 }}>
                      {selectedAddress.name}
                    </Text>
                    <Text type="secondary">{selectedAddress.phone}</Text>
                    <Text>
                      {selectedAddress.address}, {selectedAddress.city}
                    </Text>
                  </Space>
                  <Button
                    type="link"
                    style={{ padding: 0, marginTop: 12, color: "#d4380d" }}
                  >
                    Thay đổi
                  </Button>
                </div>
              ) : (
                <Button type="primary">Chọn địa chỉ</Button>
              )}
            </Card>

            {/* Shipping Method */}
            <Card
              title={
                <Space>
                  <CarOutlined style={{ color: "#d4380d" }} />
                  <Text strong>Phương thức vận chuyển</Text>
                </Space>
              }
              style={{
                borderRadius: 12,
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                border: "2px solid #fff4e6",
              }}
            >
              <Radio.Group
                value={shippingMethod}
                onChange={(e: RadioChangeEvent) =>
                  setShippingMethod(e.target.value)
                }
                style={{ width: "100%" }}
              >
                <Space
                  orientation="vertical"
                  size={12}
                  style={{ width: "100%" }}
                >
                  {shippingMethods.map((method) => (
                    <Radio
                      key={method.id}
                      value={method.id}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border:
                          shippingMethod === method.id
                            ? "2px solid #d4380d"
                            : "2px solid #f0f0f0",
                        borderRadius: 8,
                        background:
                          shippingMethod === method.id ? "#fff4e6" : "#fff",
                        transition: "all 0.3s",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <Space orientation="vertical" size={4}>
                          <Text strong>{method.name}</Text>
                          <Text type="secondary" style={{ fontSize: 13 }}>
                            {method.duration}
                          </Text>
                        </Space>
                        <Text strong style={{ color: "#d4380d" }}>
                          {formatCurrency(method.price)}
                        </Text>
                      </div>
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </Card>

            {/* Voucher Section */}
            <Card
              title={
                <Space>
                  <GiftOutlined style={{ color: "#d4380d" }} />
                  <Text strong>Mã giảm giá</Text>
                </Space>
              }
              style={{
                borderRadius: 12,
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                border: "2px solid #fff4e6",
              }}
            >
              {selectedVoucher ? (
                <div
                  style={{
                    padding: "16px",
                    background:
                      "linear-gradient(135deg, #fff4e6 0%, #ffe7ba 100%)",
                    borderRadius: 8,
                    border: "2px dashed #d4380d",
                  }}
                >
                  <Space
                    orientation="vertical"
                    size={8}
                    style={{ width: "100%" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Space>
                        <Tag
                          color="error"
                          style={{
                            fontSize: 14,
                            padding: "4px 12px",
                            fontWeight: 600,
                          }}
                        >
                          {selectedVoucher.code}
                        </Tag>
                        <Text strong>{selectedVoucher.description}</Text>
                      </Space>
                      <Button
                        type="text"
                        danger
                        size="small"
                        onClick={handleRemoveVoucher}
                      >
                        Xóa
                      </Button>
                    </div>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      Điều kiện: {selectedVoucher.condition}
                    </Text>
                  </Space>
                </div>
              ) : (
                <Button
                  type="dashed"
                  block
                  size="large"
                  onClick={() => setVoucherModalVisible(true)}
                  style={{
                    borderRadius: 8,
                    borderColor: "#d4380d",
                    color: "#d4380d",
                    fontWeight: 500,
                  }}
                >
                  Chọn hoặc nhập mã giảm giá
                </Button>
              )}
            </Card>

            {/* Payment Method */}
            <Card
              title={
                <Space>
                  <CreditCardOutlined style={{ color: "#d4380d" }} />
                  <Text strong>Phương thức thanh toán</Text>
                </Space>
              }
              style={{
                borderRadius: 12,
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                border: "2px solid #fff4e6",
              }}
            >
              <Radio.Group
                value={paymentMethod}
                onChange={(e: RadioChangeEvent) =>
                  setPaymentMethod(e.target.value)
                }
                style={{ width: "100%" }}
              >
                <Space
                  orientation="vertical"
                  size={12}
                  style={{ width: "100%" }}
                >
                  {paymentMethods.map((method) => (
                    <Radio
                      key={method.id}
                      value={method.id}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border:
                          paymentMethod === method.id
                            ? "2px solid #d4380d"
                            : "2px solid #f0f0f0",
                        borderRadius: 8,
                        background:
                          paymentMethod === method.id ? "#fff4e6" : "#fff",
                        transition: "all 0.3s",
                      }}
                    >
                      <Space>
                        <span style={{ fontSize: 20, color: "#d4380d" }}>
                          {method.icon}
                        </span>
                        <Text strong>{method.name}</Text>
                      </Space>
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </Card>
          </Space>
        </Col>

        {/* Right Column - Order Summary */}
        <Col xs={24} lg={10}>
          <Card
            title={
              <Text strong style={{ fontSize: 18 }}>
                Đơn hàng của bạn
              </Text>
            }
            style={{
              borderRadius: 12,
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
              position: "sticky",
              top: 20,
              border: "2px solid #fff4e6",
            }}
          >
            {/* Product List */}
            {fakeProducts.map((item: Product) => (
              <div key={item.id}>
                <Flex gap={16} align="center">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    style={{ borderRadius: 8, objectFit: "cover" }}
                  />

                  <Flex vertical style={{ flex: 1 }}>
                    <Text strong>{item.name}</Text>

                    <Space>
                      <Text type="secondary">x{item.quantity}</Text>
                      <Text strong style={{ color: "#d4380d" }}>
                        {formatCurrency(item.price)}
                      </Text>
                    </Space>
                  </Flex>
                </Flex>

                <Divider style={{ margin: "12px 0" }} />
              </div>
            ))}

            <Divider style={{ margin: "16px 0" }} />

            {/* Order Summary */}
            <Space orientation="vertical" size={12} style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text>Tạm tính:</Text>
                <Text>{formatCurrency(subtotal)}</Text>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text>Phí vận chuyển:</Text>
                <Text>{formatCurrency(shippingFee)}</Text>
              </div>
              {discount > 0 && (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Text style={{ color: "#52c41a" }}>Giảm giá:</Text>
                  <Text strong style={{ color: "#52c41a" }}>
                    -{formatCurrency(discount)}
                  </Text>
                </div>
              )}
              {selectedVoucher?.type === "shipping" &&
                shippingFee > discount && (
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Text>Phí vận chuyển sau giảm:</Text>
                    <Text>{formatCurrency(finalShippingFee)}</Text>
                  </div>
                )}

              <Divider style={{ margin: "8px 0" }} />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px",
                  background:
                    "linear-gradient(135deg, #fff4e6 0%, #ffe7ba 100%)",
                  borderRadius: 8,
                }}
              >
                <Text strong style={{ fontSize: 18 }}>
                  Tổng cộng:
                </Text>
                <Text strong style={{ fontSize: 20, color: "#d4380d" }}>
                  {formatCurrency(totalAmount)}
                </Text>
              </div>
            </Space>

            <Button
              type="primary"
              size="large"
              block
              onClick={handlePayment}
              loading={loading}
              disabled={!selectedAddress || !shippingMethod || !paymentMethod}
              style={{
                marginTop: 24,
                height: 56,
                fontSize: 16,
                fontWeight: 600,
                borderRadius: 12,
                background: "linear-gradient(135deg, #d4380d 0%, #ff6b35 100%)",
                border: "none",
                boxShadow: "0 4px 16px rgba(212, 56, 13, 0.3)",
                transition: "all 0.3s",
              }}
            >
              {loading ? <Spin /> : "Đặt hàng"}
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Voucher Modal */}
      <Modal
        title={
          <Space>
            <GiftOutlined
              style={{
                color: "#d4380d",
                fontSize: 20,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            />
            <Text strong style={{ fontSize: 18 }}>
              Chọn mã giảm giá
            </Text>
          </Space>
        }
        open={voucherModalVisible}
        onCancel={() => setVoucherModalVisible(false)}
        footer={null}
        width={600}
        style={{ borderRadius: 16 }}
      >
        <Space orientation="vertical" size={16} style={{ width: "100%" }}>
          {vouchers.map((voucher: Voucher) => {
            const isSelected = selectedVoucher?.code === voucher.code;

            return (
              <Card
                key={voucher.code}
                hoverable
                onClick={() => handleSelectVoucher(voucher)}
                style={{
                  width: "100%",
                  border: isSelected
                    ? "2px solid #d4380d"
                    : "2px solid #f0f0f0",
                  borderRadius: 12,
                  background: isSelected ? "#fff4e6" : "#fff",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
              >
                <Space
                  orientation="vertical"
                  size={8}
                  style={{ width: "100%" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Tag
                      color="error"
                      style={{
                        fontSize: 14,
                        padding: "4px 12px",
                        fontWeight: 600,
                      }}
                    >
                      {voucher.code}
                    </Tag>

                    {isSelected && (
                      <CheckCircleOutlined
                        style={{ color: "#52c41a", fontSize: 20 }}
                      />
                    )}
                  </div>

                  <Text strong style={{ fontSize: 16 }}>
                    {voucher.description}
                  </Text>

                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Điều kiện: {voucher.condition}
                  </Text>
                </Space>
              </Card>
            );
          })}
        </Space>
      </Modal>

      {/* Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif !important;
        }
        
        .ant-card-head-title {
          font-weight: 600;
        }
        
        .ant-radio-wrapper:hover {
          transform: translateY(-2px);
        }
        
        .ant-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(212, 56, 13, 0.4) !important;
        }
        
        .ant-card:hover {
          box-shadow: 0 6px 24px rgba(0,0,0,0.08) !important;
        }
      `}</style>
    </div>
  );
};

export default PaymentUser;

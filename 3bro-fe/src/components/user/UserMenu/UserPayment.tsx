"use client";
import React, { useState, useEffect, useCallback } from "react";
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
  RadioChangeEvent,
  Flex,
  notification,
  QRCode,
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
import { ApiResponse } from "@/models/ApiResponse";
import { PaymentProduct } from "@/models/PaymentProduct";
import { paymentService } from "@/services/payment.service";
import { Discount } from "@/models/Discount";
import Voucher from "@/components/user/cart/Voucher";
import PageLoading from "@/components/Loading";
import LoadingUser from "@/components/LoadingUser";
import { Trash2 } from "lucide-react";
import { ViewPrice } from "@/models/ViewPrice";
import { orderService } from "@/services/order.service";
import { CreateOrderDTO } from "@/models/CreateOrderDTO";
import { Payment } from "@/models/Payment";

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

const paymentMethods: PaymentMethod[] = [
  {
    id: "Cash",
    name: "Cash on Delivery (COD)",
    icon: <WalletOutlined />,
  },
  { id: "Transfer", name: "Momo", icon: <CreditCardOutlined /> },
];

const PaymentUser: React.FC = () => {
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [selectedAddress] = useState<Address>();
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash");
  const [selectedVoucher, setSelectedVoucher] = useState<Discount>();
  const [voucherModalVisible, setVoucherModalVisible] =
    useState<boolean>(false);
  const [PaymentProduct, setPaymentProduct] = useState<PaymentProduct | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    const data = sessionStorage.getItem("checkout_data");

    if (!data) {
      api.error({
        title: "Error",
        description: "Checkout data not found",
        placement: "topRight",
        duration: 2,
      });
      return;
    }

    const parsed = JSON.parse(data);
    setCheckoutData(parsed);

    const viewPriceItems: ViewPrice[] = parsed.items.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    if (parsed.voucherCode) {
      fetchPaymentWithDiscount(parsed.voucherCode, viewPriceItems);
    } else {
      fetchPaymentData(viewPriceItems);
    }
  }, []);

  const getFirstImage = (imageUrl: string | null | undefined) => {
    if (!imageUrl) return "/blank.jpg";
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }
    const baseUrl = "https://localhost:7041";
    const path = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
    return `${baseUrl}${path}`;
  };

  const fetchPaymentData = async (items: ViewPrice[]) => {
    setLoading(true);
    try {
      const res: ApiResponse<PaymentProduct> =
        await paymentService.calculateProductPayment(items);

      if (res.code !== "200" || !res.isSuccess) {
        api.error({
          title: "Error",
          description: res.message,
          placement: "topRight",
          duration: 2,
        });
        return;
      }

      setPaymentProduct(res.object);

      if (res.object && res.object.discountCode && res.object.vouchers) {
        const autoAppliedVoucher = res.object.vouchers.find(
          (voucher) => voucher.code === res.object!.discountCode,
        );
        if (autoAppliedVoucher) {
          setSelectedVoucher(autoAppliedVoucher);
        }
      }
    } catch (err) {
      api.error({
        title: "Error",
        description: "Unable to load payment information",
        placement: "topRight",
        duration: 2,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentWithDiscount = async (
    voucherCode: string,
    items: ViewPrice[],
  ) => {
    setLoading(true);
    try {
      const res = await paymentService.calculateProductPaymentWithDiscount(
        voucherCode,
        items,
      );

      if (res.code !== "200" || !res.isSuccess) {
        api.error({
          title: "Error",
          description: res.message,
          placement: "topRight",
          duration: 2,
        });
        return;
      }

      setPaymentProduct(res.object);
    } catch (err) {
      api.error({
        title: "Error",
        description: "Unable to load payment information",
        placement: "topRight",
        duration: 2,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const subtotal = PaymentProduct?.currentTotalPrice || 0;
  const shippingFee = PaymentProduct?.shippingFee || 0;
  const discount = PaymentProduct?.discountPrice || 0;
  const totalAmount = PaymentProduct?.finalTotalPrice || 0;

  const handleApplyVoucher = async (selectedDiscount: Discount) => {
    if (!checkoutData?.items) return;

    if (subtotal < selectedDiscount.minOrderAmount) {
      api.warning({
        title: "Not Eligible",
        description: `Minimum order amount must be ${formatCurrency(selectedDiscount.minOrderAmount)}`,
        placement: "topRight",
        duration: 3,
      });
      return;
    }

    const viewPriceItems: ViewPrice[] = checkoutData.items.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    await fetchPaymentWithDiscount(selectedDiscount.code, viewPriceItems);

    setSelectedVoucher(selectedDiscount);
    setVoucherModalVisible(false);

    api.success({
      title: "Apply voucher successfully",
      description: `Apply voucher ${selectedDiscount.code}`,
      placement: "topRight",
      duration: 3,
    });
  };

  const handleRemoveVoucher = async () => {
    if (!checkoutData?.items) return;

    setSelectedVoucher(undefined);

    const viewPriceItems: ViewPrice[] = checkoutData.items.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    await fetchPaymentWithDiscount("", viewPriceItems);

    api.success({
      title: "Success",
      description: "Remove voucher successfully",
      placement: "topRight",
      duration: 3,
    });
  };

  // Handle Place Order: create order → create payment → handle by method
  const handlePayment = async () => {
    if (!paymentMethod) {
      api.warning({
        title: "Please select payment method",
        placement: "topRight",
        duration: 2,
      });
      return;
    }

    if (!PaymentProduct || !PaymentProduct.userAddress) {
      api.warning({
        title: "Payment information not loaded",
        placement: "topRight",
        duration: 2,
      });
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create order
      const viewPriceItems: ViewPrice[] = checkoutData.items.map(
        (item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
        }),
      );

      const orderPayload: CreateOrderDTO = {
        items: viewPriceItems as any,
        shippingAddress: PaymentProduct.userAddress,
        paymentMethod: paymentMethod,
        discountId: selectedVoucher?.id || "",
      };

      const orderRes: ApiResponse<any> =
        await orderService.createOrderByUser(orderPayload);

      if (!orderRes.isSuccess || orderRes.code !== "200") {
        api.error({
          title: "Failed to create order",
          description: orderRes.message || "An error occurred",
          placement: "topRight",
          duration: 3,
        });
        return;
      }

      const orderId = orderRes.object?.id || orderRes.object;

      // Step 2: Create payment
      const paymentRes: ApiResponse<Payment> =
        await paymentService.createPayment(orderId);

      if (!paymentRes.isSuccess || paymentRes.code !== "200") {
        api.error({
          title: "Failed to create payment",
          description: paymentRes.message || "An error occurred",
          placement: "topRight",
          duration: 3,
        });
        return;
      }

      // Step 3a: Cash → show success screen
      if (paymentMethod === "Cash") {
        const productList = PaymentProduct.productList || [];
        const fakeProducts: Product[] = productList.map((item) => ({
          id: parseInt(item.productId) || 0,
          name: item.productName,
          image: item.imageUrl || "",
          quantity: item.quantity,
          price: item.price,
        }));

        const addressData: Address = {
          id: 0,
          name: PaymentProduct.userFullName || "",
          phone: PaymentProduct.userPhoneNumber || "",
          address: PaymentProduct.userAddress || "",
          city: "",
        };

        setOrderResult({
          status: "paid",
          message: "Order placed successfully!",
          order: {
            id: orderId,
            items: fakeProducts,
            address: addressData,
            payment: paymentMethod,
            voucher: selectedVoucher?.code,
            subtotal,
            shippingFee,
            discount,
            total: totalAmount,
            createdAt: new Date().toISOString(),
          },
        });
      }

      // Step 3b: Momo → call momo API then redirect
      else if (paymentMethod === "Transfer") {
        const momoRes = await paymentService.paymentByMomo(orderId);

        if (momoRes.payUrl) {
          window.location.href = momoRes.payUrl;
        } else {
          api.error({
            title: "Failed to get Momo payment URL",
            description: momoRes.message || "An error occurred",
            placement: "topRight",
            duration: 3,
          });
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      api.error({
        title: "An error occurred while placing the order",
        placement: "topRight",
        duration: 2,
      });
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <PageLoading />
      </div>
    );
  }

  if (orderResult) {
    return (
      <div style={{ padding: "40px 20px", maxWidth: 800, margin: "0 auto" }}>
        <Result
          status={orderResult.status === "paid" ? "success" : "error"}
          title={orderResult.message}
          subTitle={`Order ID: ${orderResult.order.id}`}
          extra={[
            <Button
              type="primary"
              key="home"
              onClick={() => (window.location.href = "/")}
            >
              Back to Home
            </Button>,
            <Button
              key="orders"
              onClick={() => (window.location.href = "/user/account/purchase")}
            >
              View Orders
            </Button>,
          ]}
        >
          <Card style={{ marginTop: 24 }}>
            <Space orientation="vertical" size={12} style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text>Subtotal:</Text>
                <Text>{formatCurrency(orderResult.order.subtotal)}</Text>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text>Shipping Fee:</Text>
                <Text>{formatCurrency(orderResult.order.shippingFee)}</Text>
              </div>
              {orderResult.order.discount > 0 && orderResult.order.voucher && (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Text style={{ color: "#52c41a" }}>
                    Discount ({orderResult.order.voucher}):
                  </Text>
                  <Text strong style={{ color: "#52c41a" }}>
                    -{formatCurrency(orderResult.order.discount)}
                  </Text>
                </div>
              )}
              <Divider style={{ margin: "8px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text strong style={{ fontSize: 16 }}>
                  Total:
                </Text>
                <Text strong style={{ fontSize: 18, color: "#d4380d" }}>
                  {formatCurrency(orderResult.order.total)}
                </Text>
              </div>
            </Space>
          </Card>
        </Result>
      </div>
    );
  }

  return (
    <>
      {contextHolder}
      <div
        style={{ background: "#f5f5f5", minHeight: "100vh", padding: "24px 0" }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 20px" }}>
          <Title level={2} style={{ marginBottom: 24, color: "#d4380d" }}>
            Checkout
          </Title>

          <Row gutter={[24, 24]}>
            {/* Left Column */}
            <Col xs={24} lg={14}>
              <Space orientation="vertical" size={24} style={{ width: "100%" }}>
                {/* Address */}
                <Card
                  title={
                    <Space>
                      <HomeOutlined style={{ color: "#d4380d" }} />
                      <Text strong>Shipping Address</Text>
                    </Space>
                  }
                  style={{
                    borderRadius: 12,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                    border: "2px solid #fff4e6",
                  }}
                >
                  <Space orientation="vertical" size={8}>
                    <Text strong style={{ fontSize: 16 }}>
                      {PaymentProduct?.userFullName || selectedAddress?.name} |{" "}
                      {PaymentProduct?.userPhoneNumber ||
                        selectedAddress?.phone}
                    </Text>
                    <Text>
                      {PaymentProduct?.userAddress || selectedAddress?.address}
                    </Text>
                    <Text type="secondary">{selectedAddress?.city}</Text>
                  </Space>
                </Card>

                {/* Voucher Section */}
                <Card
                  title={
                    <Space>
                      <GiftOutlined style={{ color: "#d4380d" }} />
                      <Text strong>Voucher</Text>
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
                        padding: 16,
                        border: "2px solid #52c41a",
                        borderRadius: 8,
                        background: "#f6ffed",
                      }}
                    >
                      <Space
                        style={{
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <Space orientation="vertical" size={4}>
                          <Space>
                            <Tag
                              color="success"
                              style={{ fontSize: 14, fontWeight: 600 }}
                            >
                              {selectedVoucher.code}
                            </Tag>
                            <CheckCircleOutlined style={{ color: "#52c41a" }} />
                          </Space>
                          <Text>{selectedVoucher.description}</Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Discount:{" "}
                            {selectedVoucher.discountPercent &&
                            selectedVoucher.discountPercent > 0
                              ? `${selectedVoucher.discountPercent}%`
                              : selectedVoucher.discountAmount
                                ? formatCurrency(selectedVoucher.discountAmount)
                                : ""}
                            {selectedVoucher.maxDiscountAmount &&
                            selectedVoucher.maxDiscountAmount > 0
                              ? ` (Max ${formatCurrency(selectedVoucher.maxDiscountAmount)})`
                              : ""}
                          </Text>
                        </Space>
                        <Button
                          type="text"
                          danger
                          onClick={handleRemoveVoucher}
                          icon={<Trash2 />}
                          loading={loading}
                        />
                      </Space>
                    </div>
                  ) : (
                    <Button
                      type="dashed"
                      block
                      size="large"
                      onClick={() => setVoucherModalVisible(true)}
                      icon={<GiftOutlined />}
                      style={{
                        height: 56,
                        borderRadius: 8,
                        borderColor: "#d4380d",
                        color: "#d4380d",
                      }}
                    >
                      Select Voucher
                    </Button>
                  )}
                </Card>

                {/* Payment Method */}
                <Card
                  title={
                    <Space>
                      <WalletOutlined style={{ color: "#d4380d" }} />
                      <Text strong>Payment Method</Text>
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
                    Your Order
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
                {PaymentProduct?.productList?.map((item) => (
                  <div key={item.productId}>
                    <Flex gap={16} align="center">
                      <Image
                        src={getFirstImage(item.imageUrl)}
                        alt={item.productName}
                        width={80}
                        height={80}
                        style={{ borderRadius: 8, objectFit: "cover" }}
                        fallback="/blank.jpg"
                      />
                      <Flex vertical style={{ flex: 1 }}>
                        <Text strong>{item.productName}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {item.categoryName}
                        </Text>
                        <Space>
                          <Text type="secondary">x{item.quantity}</Text>
                          <Text strong style={{ color: "#d4380d" }}>
                            {formatCurrency(item.price)}
                          </Text>
                        </Space>
                      </Flex>
                      <Text strong style={{ color: "#d4380d" }}>
                        {formatCurrency(item.subTotalPrice)}
                      </Text>
                    </Flex>
                    <Divider style={{ margin: "12px 0" }} />
                  </div>
                ))}

                <Divider style={{ margin: "16px 0" }} />

                {/* Order Summary */}
                <Space
                  orientation="vertical"
                  size={12}
                  style={{ width: "100%" }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Text>Subtotal:</Text>
                    <Text>{formatCurrency(subtotal)}</Text>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Text>Shipping Fee:</Text>
                    <Text>{formatCurrency(shippingFee)}</Text>
                  </div>
                  {discount > 0 && selectedVoucher && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ color: "#52c41a" }}>
                        Discount ({selectedVoucher.code}):
                      </Text>
                      <Text strong style={{ color: "#52c41a" }}>
                        -{formatCurrency(discount)}
                      </Text>
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
                      Total:
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
                  disabled={!PaymentProduct?.userAddress || !paymentMethod}
                  style={{
                    marginTop: 24,
                    height: 56,
                    fontSize: 16,
                    fontWeight: 600,
                    borderRadius: 12,
                    background:
                      "linear-gradient(135deg, #d4380d 0%, #ff6b35 100%)",
                    border: "none",
                    boxShadow: "0 4px 16px rgba(212, 56, 13, 0.3)",
                    transition: "all 0.3s",
                  }}
                >
                  {loading ? <LoadingUser /> : "Place Order"}
                </Button>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Voucher Modal */}
        <Voucher
          isOpen={voucherModalVisible}
          onClose={() => setVoucherModalVisible(false)}
          onApply={handleApplyVoucher}
        />
      </div>
    </>
  );
};

export default PaymentUser;

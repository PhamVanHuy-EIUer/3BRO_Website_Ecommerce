"use client";
import { ApiResponse } from "@/models/ApiResponse";
import { Cart } from "@/models/Cart";
import { Discount } from "@/models/Discount";
import { cartService } from "@/services/cart.service";
import {
  Button,
  Flex,
  Image,
  Modal,
  notification,
  TableColumnsType,
  Tag,
  Spin,
} from "antd";
import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { TableRowSelection } from "antd/es/table/interface";
import { formatCurrency } from "@/utils/currency";
import { ViewPrice } from "@/models/ViewPrice";
import { DeleteProductId } from "@/models/DeleteProductId";
import { useRouter } from "next/navigation";
import Voucher from "@/components/user/cart/Voucher";
import { productService } from "@/services/product.service";
import { useAuth } from "@/context/AuthContext";
import { PaymentProduct } from "@/models/PaymentProduct";
import { paymentService } from "@/services/payment.service";

const CartContent = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [api, contextHolder] = notification.useNotification();
  const [carts, setCarts] = useState<Cart[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [applyingVoucher, setApplyingVoucher] = useState(false);
  const [modal2Open, setModal2Open] = useState(false);
  const [seletedItem, setSelectedItem] = useState<Cart | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isOpenVoucher, setIsOpenVoucher] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<Discount | null>(null);

  const handleChooseAll = () => {
    if (selectedRowKeys.length === carts.length) {
      setSelectedRowKeys([]);
    } else {
      const allKeys = carts.map((cart) => cart.cartItemID);
      setSelectedRowKeys(allKeys);
    }
  };

  const buildViewPricePayload = (): ViewPrice[] => {
    return carts
      .filter((cart) => selectedRowKeys.includes(cart.cartItemID))
      .map((cart) => ({
        productId: cart.productId,
        quantity: cart.quantity,
      }));
  };

  const clickedProductPayload = (): DeleteProductId[] => {
    return carts
      .filter((cart) => selectedRowKeys.includes(cart.cartItemID))
      .map((cart) => ({
        id: cart.productId,
      }));
  };

  const getSelectedCartItemIds = (): string[] => {
    return carts
      .filter((cart) => selectedRowKeys.includes(cart.cartItemID))
      .map((cart) => cart.cartItemID);
  };

  const buildCheckoutPayload = () => {
    return carts
      .filter((cart) => selectedRowKeys.includes(cart.cartItemID))
      .map((cart) => ({
        cartItemId: cart.cartItemID,
        productId: cart.productId,
        quantity: cart.quantity,
      }));
  };

  // State to store full payment product data
  const [paymentData, setPaymentData] = useState<PaymentProduct | null>(null);

  const fetchPreviewPrice = async (voucherCode?: string) => {
    try {
      const payload = buildViewPricePayload();
      if (payload.length === 0) {
        setTotalPrice(0);
        setPaymentData(null);
        return;
      }

      const codeToUse =
        voucherCode !== undefined ? voucherCode : appliedVoucher?.code || "";

      const response: ApiResponse<PaymentProduct> =
        await paymentService.calculateProductPaymentWithDiscount(
          codeToUse,
          payload,
        );
      if (response.code === "200" && response.isSuccess && response.object) {
        setPaymentData(response.object);
        setTotalPrice(response.object.finalTotalPrice);

        // Auto-apply voucher if returned from server
        if (response.object.discountCode && response.object.vouchers) {
          const autoVoucher = response.object.vouchers.find(
            (v) => v.code === response.object!.discountCode,
          );
          if (autoVoucher) {
            setAppliedVoucher(autoVoucher);
            // Create discount data structure compatible with existing simplified view if needed
            // but ideally we should switch to using paymentData directly
          }
        }
      }
    } catch (error) {
      console.error("Error fetching preview price:", error);
    }
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<Cart> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return "/blank.jpg";
    return imageUrl.startsWith("http")
      ? imageUrl
      : `https://localhost:7041${imageUrl}`;
  };

  const handlefetchCart = async () => {
    try {
      const response: ApiResponse<Cart> = await cartService.getCart();
      setCarts(response.list);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const handleDeleteProductFromCart = async (cartItem: Cart) => {
    try {
      const response: ApiResponse<any> =
        await cartService.deleteProductFromCart(cartItem.productId);
      if (response.code === "200" && response.isSuccess) {
        api.success({
          message: "Xóa sản phẩm thành công",
          placement: "topRight",
          duration: 2,
        });
        await handlefetchCart();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteProductInCart = async () => {
    try {
      const res: ApiResponse<any> = await cartService.deleteListProductFromCart(
        clickedProductPayload(),
      );
      if (res.code === "200" && res.isSuccess) {
        api.success({
          title: "Success",
          description: "Delete product successfully",
          placement: "topRight",
          duration: 2,
        });
        await handlefetchCart();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleApplyVoucher = async (discount: Discount) => {
    console.log(discount.code);
    // Kiểm tra đơn tối thiểu
    if (totalPrice < discount.minOrderAmount) {
      api.warning({
        title: "Not Eligible",
        description: `Minimum order amount must be ${formatCurrency(discount.minOrderAmount)}`,
        placement: "topRight",
        duration: 3,
      });
      return;
    }

    try {
      setApplyingVoucher(true);
      const payload = buildViewPricePayload();

      const response: ApiResponse<PaymentProduct> =
        await paymentService.calculateProductPaymentWithDiscount(
          discount.code,
          payload,
        );

      if (response.code === "200" && response.isSuccess && response.object) {
        setPaymentData(response.object);
        setAppliedVoucher(discount);
        setIsOpenVoucher(false);
        setTotalPrice(response.object.finalTotalPrice);

        api.success({
          title: "Apply voucher successfully",
          description: `Apply voucher ${discount.code}`,
          placement: "topRight",
          duration: 3,
        });
      } else {
        api.error({
          title: "Error applying voucher",
          description: response.message || "Can't apply voucher",
          placement: "topRight",
          duration: 3,
        });
      }
    } catch (error: any) {
      console.error("Error applying voucher:", error);
      api.error({
        title: "Error applying voucher",
        description: error?.response?.data?.message || "Can't apply voucher",
        placement: "topRight",
        duration: 3,
      });
    } finally {
      setApplyingVoucher(false);
    }
  };

  const handleRemoveVoucher = async () => {
    setAppliedVoucher(null);
    setPaymentData(null);
    await fetchPreviewPrice("");
  };

  useEffect(() => {
    handlefetchCart();
  }, []);

  useEffect(() => {
    if (hasSelected) {
      fetchPreviewPrice();
    } else {
      setTotalPrice(0);
      setAppliedVoucher(null);
    }
  }, [selectedRowKeys]);

  const columns: TableColumnsType<Cart> = [
    {
      title: "Name",
      dataIndex: "productName",
      key: "productName",
      render: (text: string, record: Cart) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Image
            src={getImageUrl(record.imageUrl)}
            alt={text}
            width={50}
            height={50}
            style={{ borderRadius: "8px", objectFit: "cover" }}
            fallback="/blank.jpg"
          />
          <div style={{ fontWeight: 500 }}>{text}</div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
      render: (text: string) => (
        <div style={{ fontWeight: 500 }} className="capitalize">
          {text}
        </div>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text: number) => (
        <div style={{ fontWeight: 500 }}>{formatCurrency(text)}</div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (record: Cart) => (
        <Button
          type="primary"
          danger
          onClick={() => {
            setModal2Open(true);
            setSelectedItem(record);
          }}
        >
          Remove
        </Button>
      ),
    },
  ];

  return (
    <>
      {contextHolder}

      <Voucher
        isOpen={isOpenVoucher}
        onClose={() => setIsOpenVoucher(false)}
        onApply={handleApplyVoucher}
      />

      <Spin spinning={applyingVoucher} description="Applying voucher...">
        <div className="flex justify-center flex-col py-20 bg-[#f5f5f5]">
          <Modal
            className="p-5"
            centered
            open={modal2Open}
            title={<span></span>}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{
              size: "large",
              style: {
                backgroundColor: "#ff5c5c",
                border: "none",
                borderRadius: "4px",
              },
            }}
            cancelButtonProps={{
              size: "large",
              style: { borderRadius: "4px" },
            }}
            onOk={() => {
              if (!seletedItem) return;
              handleDeleteProductFromCart(seletedItem);
              setSelectedItem(null);
              setModal2Open(false);
            }}
            onCancel={() => setModal2Open(false)}
          >
            <div className="font-semibold text-xl py-10">
              Are you sure you want to remove this product?
            </div>
          </Modal>

          {carts === null || carts.length === 0 ? (
            <div className="w-[80vw] mx-auto h-[50vh] my-auto flex items-center justify-center flex-col">
              <Image src="/Cart/emptycart.png" width={80} height={80} />
              <div className="font-semibold text-xl py-10">
                You have no product in your cart
              </div>
              <div className="flex items-center">
                <Button
                  className="!rounded-md !px-3 !py-5 !bg-[#ff6857] !border-none hover:!text-white"
                  onClick={() => router.push("/product")}
                >
                  SEE PRODUCTS
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="font-inter py-10 w-[80vw] mx-auto border border-gray-300 bg-white mb-10 rounded-md">
                <div className="p-2">
                  <Flex gap="middle" vertical>
                    <Table<Cart>
                      rowSelection={rowSelection}
                      columns={columns}
                      dataSource={carts}
                      pagination={false}
                      rowKey="cartItemID"
                    />
                  </Flex>
                </div>
              </div>

              <div className="border border-gray-300 w-[80vw] m-auto flex justify-between items-center mx-auto bg-white rounded-md flex-col">
                {hasSelected && (
                  <>
                    {/* Voucher Section */}
                    <div className="flex justify-center px-5 py-5 border-b border-gray-300 w-full">
                      <div className="flex-1"></div>
                      <div className="flex-1 flex flex-row justify-end gap-20 items-center">
                        <div className="text-black font-bold text-left pr-6">
                          Discount voucher
                        </div>
                        {appliedVoucher ? (
                          <div className="flex items-center gap-3">
                            <Tag color="red" className="!text-base !py-1 !px-3">
                              {appliedVoucher.code}
                            </Tag>
                            <Button
                              type="link"
                              danger
                              onClick={handleRemoveVoucher}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <div
                            className="!text-[#0885ce] hover:!text-[#6cb6ff] cursor-pointer font-semibold"
                            onClick={() => setIsOpenVoucher(true)}
                          >
                            Choose voucher
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price Summary */}
                    {paymentData && (
                      <div className="flex justify-end px-5 py-4 border-b border-gray-300 w-full">
                        <div className="flex flex-col gap-3 min-w-87.5">
                          <div className="flex justify-between text-base">
                            <span className="text-gray-600">
                              Original Price:
                            </span>
                            <span className="font-semibold">
                              {formatCurrency(paymentData.currentTotalPrice)}
                            </span>
                          </div>

                          {paymentData.shippingFee > 0 && (
                            <div className="flex justify-between text-base">
                              <span className="text-gray-600">
                                Shipping Fee:
                              </span>
                              <span className="font-semibold">
                                {formatCurrency(paymentData.shippingFee)}
                              </span>
                            </div>
                          )}

                          <div className="flex justify-between text-base text-red-500">
                            <span>Discount ({paymentData.discountCode}):</span>
                            <span className="font-semibold">
                              -{formatCurrency(paymentData.discountPrice)}
                            </span>
                          </div>

                          <div className="border-t pt-3 flex justify-between text-lg">
                            <span className="font-bold text-gray-800">
                              Total Payment:
                            </span>
                            <span className="font-bold text-red-600 text-xl">
                              {formatCurrency(paymentData.finalTotalPrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="flex w-full justify-between items-center py-5">
                  <div className="flex flex-row gap-20 ml-2">
                    <button
                      className="px-4 py-2 font-sans font-semibold cursor-pointer hover:text-gray-700"
                      onClick={handleChooseAll}
                    >
                      Choose all ({carts.length})
                    </button>
                    <Button
                      type="text"
                      onClick={
                        hasSelected ? handleDeleteProductInCart : undefined
                      }
                      className={`!px-4 !py-6 !border-none !font-semibold !font-sans !text-md
                        !bg-transparent hover:!bg-transparent active:!bg-transparent
                        ${
                          hasSelected
                            ? "!text-black hover:!text-gray-700 cursor-pointer"
                            : "!text-gray-400 !cursor-not-allowed"
                        }`}
                    >
                      Delete
                    </Button>
                  </div>

                  <div className="mr-4 flex flex-row gap-15">
                    <div className="flex flex-row justify-center items-center">
                      <div className="uppercase text-red-500 font-bold">
                        Total Price:{" "}
                      </div>
                      <div className="mx-2 font-semibold text-black block text-xl">
                        {formatCurrency(
                          paymentData
                            ? paymentData.finalTotalPrice
                            : totalPrice,
                        )}
                      </div>
                    </div>
                    <div>
                      <Button
                        type="primary"
                        disabled={!hasSelected}
                        style={{
                          borderRadius: 0,
                          backgroundColor: hasSelected ? "#ff6857" : undefined,
                        }}
                        className="!rounded-none !px-5 !py-5 !font-semibold !font-sans !text-md !border-none hover:!bg-[#ff6857] hover:!text-white"
                        onClick={() => {
                          if (
                            user?.address === null ||
                            user?.fullName === null
                          ) {
                            router.push("/user");
                            return;
                          }

                          const payload = {
                            items: buildCheckoutPayload(),
                            voucherCode: appliedVoucher?.code || null,
                            totalPrice: paymentData
                              ? paymentData.finalTotalPrice
                              : totalPrice,
                          };

                          sessionStorage.setItem(
                            "checkout_data",
                            JSON.stringify(payload),
                          );

                          router.push("/user/payment");
                        }}
                      >
                        CHECK OUT
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Spin>
    </>
  );
};

export default CartContent;

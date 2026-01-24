"use client";
import { ApiResponse } from "@/models/ApiResponse";
import { Cart } from "@/models/Cart";
import { cartService } from "@/services/cart.service";
import {
  Button,
  Flex,
  Image,
  Modal,
  notification,
  TableColumnsType,
} from "antd";
import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { TableRowSelection } from "antd/es/table/interface";
import { formatCurrency } from "@/utils/currency";
import { b, filter, style } from "framer-motion/client";
import { ViewPrice } from "@/models/ViewPrice";
import { DeleteProductId } from "@/models/DeleteProductId";
import { useRouter } from "next/navigation";
import { useCart } from "@/hook/User/useCart";
import Voucher from "@/components/user/cart/Voucher";

const CartContent = () => {
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();
  const [carts, setCarts] = useState<Cart[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [modal2Open, setModal2Open] = useState(false);
  const [seletedItem, setSelectedItem] = useState<Cart | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const { isOpenVoucher, setIsOpenVoucher } = useCart();

  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const handleChooseAll = () => {
    if (selectedRowKeys.length === carts.length) {
      // Đã chọn hết → bỏ chọn
      setSelectedRowKeys([]);
    } else {
      // Chọn tất cả
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

  const fetchPreviewPrice = async () => {
    try {
      const response: ApiResponse<number> = await cartService.previewPrice(
        buildViewPricePayload(),
      );
      console.log(response);
      if (response.code === "200" && response.isSuccess) {
        setTotalPrice(response.object ?? 0);
      }
    } catch (error) {
      console.error("Error fetching preview price:", error);
    }
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<Cart> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0 ? true : false;

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
          title: "Delete product from cart successfully",
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
          title: "Delete products from cart successfully",
          placement: "topRight",
          duration: 2,
        });
        await handlefetchCart();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handlefetchCart();
  }, []);

  useEffect(() => {
    fetchPreviewPrice();
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
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ fontWeight: 500 }}>{formatCurrency(text)}</div>
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (record: Cart) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
        </div>
      ),
    },
  ];

  return (
    <>
      {contextHolder}

      <div className="flex justify-center flex-col py-20 bg-[#f5f5f5]">
        {isOpenVoucher && <Voucher />}
        <Modal
          className="p-5"
          centered
          open={modal2Open}
          title={<span></span>}
          okText="Delete"
          cancelText="Cancel"
          // okType="danger"
          okButtonProps={{
            size: "large",
            style: {
              backgroundColor: "#ff5c5c",
              border: "none",
              borderRadius: "4px",
            },
          }}
          cancelButtonProps={{ size: "large", style: { borderRadius: "4px" } }}
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
                <div className="flex justify-center px-5 py-5 border-b border-gray-300 w-full">
                  <div className="flex-1"></div>
                  <div className="flex-1 flex flex-row justify-end gap-20">
                    <div className="text-black font-bold text-left pr-6">
                      Discount voucher
                    </div>
                    <div
                      className="!text-[#0885ce] hover:!text-[#6cb6ff] cursor-pointer font-semibold"
                      onClick={() => setIsOpenVoucher(true)}
                    >
                      Choose voucher
                    </div>
                  </div>
                </div>
              )}
              <div className="flex w-full justify-between items-center py-5">
                <div className="flex flex-row gap-20 ml-2">
                  <button
                    className=" px-4 py-2 text-shadow-red-400 font-sans font-semibold cursor-pointer hover:text-gray-700"
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
              !bg-transparent
              hover:!bg-transparent
              active:!bg-transparent
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
                    <div className=" uppercase text-red-500 font-bold">
                      Total Price:{"   "}
                    </div>
                    <div className="mx-2 font-semibold text-black block">
                      {formatCurrency(totalPrice)}
                    </div>
                  </div>
                  <div>
                    <Button
                      type="primary"
                      style={{ borderRadius: 0, backgroundColor: "#ff6857" }}
                      className="!rounded-none !px-5 !py-5 !font-semibold !font-sans !text-md  !border-none hover:!bg-[#ff6857] hover:!text-white"
                    >
                      BUY NOW
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartContent;

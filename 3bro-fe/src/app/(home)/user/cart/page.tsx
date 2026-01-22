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
import { formatVND } from "@/utils/currency";
import { b } from "framer-motion/client";

const CartContent = () => {
  const [api, contextHolder] = notification.useNotification();
  const [carts, setCarts] = useState<Cart[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [modal2Open, setModal2Open] = useState(false);
  const [seletedItem, setSelectedItem] = useState<Cart | null>(null);

  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
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

  useEffect(() => {
    handlefetchCart();
  }, []);
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
          <div style={{ fontWeight: 500 }}>{formatVND(text)}</div>
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
      <div className="flex justify-center flex-col py-20">
        <Modal
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
        <div className="font-inter bg-white py-10 w-[80vw] m-auto">
          <Flex gap="middle" vertical>
            {/* <Flex align="center" gap="middle">
              <Button
                type="primary"
                onClick={start}
                disabled={!hasSelected}
                loading={loading}
              >
                Reload
              </Button> */}
            {/* {hasSelected ? `Selected ${selectedRowKeys.length} items` : null} */}
            {/* </Flex> */}
            <Table<Cart>
              rowSelection={rowSelection}
              columns={columns}
              dataSource={carts}
              pagination={false}
              rowKey="cartItemID"
            />
          </Flex>
        </div>
        <div className="py-10 border w-[80vw] m-auto flex">
          <div></div>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default CartContent;

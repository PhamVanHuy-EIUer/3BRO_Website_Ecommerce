"use client";
import React, { useState, useEffect, JSX } from "react";
import { orderService } from "@/services/order.service";
import type { ViewOrderUser } from "@/models/ViewOrderUser";
import { ApiResponse } from "@/models/ApiResponse";
import PurchaseOrderContent from "@/components/user/UserMenu/PurchaseOrderContent";
import { OrderStatus } from "@/data/data";
import OrderDetailModal from "@/components/user/UserMenu/OrderDetailModal";

const getFirstImage = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) return "/blank.jpg";
  return imageUrl.startsWith("http")
    ? imageUrl
    : `https://localhost:7041${imageUrl}`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusBadge = (status: string) => {
  const statusLower = status.toLowerCase();
  const badges: Record<string, JSX.Element> = {
    completed: (
      <span className="flex items-center gap-1 text-[#00BFA5] text-sm uppercase font-medium">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
        Completed
      </span>
    ),
    cancelled: (
      <span className="text-[#DB4444] text-sm uppercase font-medium">
        Cancelled
      </span>
    ),
    paid: (
      <span className="text-[#FF9800] text-sm uppercase font-medium">Paid</span>
    ),
    confirmed: (
      <span className="text-[#2196F3] text-sm uppercase font-medium">
        Confirmed
      </span>
    ),
    pending: (
      <span className="text-[#FFC107] text-sm uppercase font-medium">
        Pending
      </span>
    ),
  };

  return (
    badges[statusLower] || (
      <span className="text-gray-600 text-sm uppercase font-medium">
        {status}
      </span>
    )
  );
};

export default function PurchasePage() {
  const [activeTab, setActiveTab] = useState<OrderStatus>("All");
  const [orders, setOrders] = useState<ViewOrderUser[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<ViewOrderUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<ViewOrderUser | null>(
    null,
  );

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response: ApiResponse<ViewOrderUser> =
        await orderService.getOrderByUser();
      const ordersArray = Array.isArray(response.list) ? response.list : [];
      setOrders(ordersArray);
      setFilteredOrders(ordersArray);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!Array.isArray(orders)) {
      setFilteredOrders([]);
      return;
    }

    let filtered = [...orders];

    if (activeTab !== "All") {
      filtered = filtered.filter(
        (order) => order.status.toLowerCase() === activeTab.toLowerCase(),
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.items.some((item) =>
            item.productName.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    setFilteredOrders(filtered);
  }, [activeTab, searchQuery, orders]);

  const handleSelectOrder = (order: ViewOrderUser) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  return (
    <>
      <PurchaseOrderContent
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        loading={loading}
        filteredOrders={filteredOrders}
        onSelectOrder={handleSelectOrder}
        onCancelSuccess={fetchOrders}
        getFirstImage={getFirstImage}
        getStatusBadge={getStatusBadge}
        formatDate={formatDate}
      />

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={handleCloseModal}
          getFirstImage={getFirstImage}
          getStatusBadge={getStatusBadge}
          formatDate={formatDate}
        />
      )}
    </>
  );
}

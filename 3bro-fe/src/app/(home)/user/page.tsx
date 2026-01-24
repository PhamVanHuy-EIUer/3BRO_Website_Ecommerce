"use client";
import React, { useState, useEffect, JSX } from "react";
import { orderService } from "@/services/order.service";
import type { ViewOrderUser } from "@/models/ViewOrderUser";
import { ApiResponse } from "@/models/ApiResponse";
import { useAuth } from "@/context/AuthContext";
import ProfileContent from "@/components/user/UserMenu/ProfileContent";
import AddressContent from "@/components/user/UserMenu/AddressContent";
import NotificationsContent from "@/components/user/UserMenu/NotificationContent";
import PurchaseOrderContent from "@/components/user/UserMenu/PurchaseOrderContent";
import VoucherWalletContent from "@/components/user/UserMenu/VoucherWalletContent";
import Sidebar from "@/components/user/UserMenu/SideBar";
import { OrderStatus, COLORS } from "@/data/data";
import OrderDetailModal from "@/components/user/UserMenu/OrderDetailModal";
import ChangePasswordContent from "@/components/user/UserMenu/ChangePasswordContent";

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
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
    shipped: (
      <span className="text-[#FF9800] text-sm uppercase font-medium">
        Shipped
      </span>
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

const UserAccountPage = () => {
  const [activeMenu, setActiveMenu] = useState("Purchase Order");
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<OrderStatus>("All");
  const [orders, setOrders] = useState<ViewOrderUser[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<ViewOrderUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<ViewOrderUser | null>(
    null,
  );

  const { user } = useAuth();

  useEffect(() => {
    if (activeMenu === "Purchase Order") {
      fetchOrders();
    }
  }, [activeMenu]);

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

    // Filter by status tab
    if (activeTab !== "All") {
      filtered = filtered.filter(
        (order) => order.status.toLowerCase() === activeTab.toLowerCase(),
      );
    }

    // Filter by search query
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

  // ========== Event Handlers ==========
  const handleMenuClick = (menuName: string) => {
    setActiveMenu(menuName);
    setActiveSubmenu(null);
  };

  const handleSubmenuClick = (submenuName: string) => {
    setActiveSubmenu(submenuName);
  };

  const handleSelectOrder = (order: ViewOrderUser) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const renderContent = () => {
    // Render submenu content if active
    if (activeSubmenu) {
      switch (activeSubmenu) {
        case "Profile":
          return <ProfileContent />;
        case "Address":
          return <AddressContent />;
        case "Change Password":
          return <ChangePasswordContent />;
        case "Order Updates":
        case "Promotions":
          return <NotificationsContent />;
        default:
          return null;
      }
    }

    // Render main menu content
    switch (activeMenu) {
      case "Purchase Order":
        return (
          <PurchaseOrderContent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            loading={loading}
            filteredOrders={filteredOrders}
            onSelectOrder={handleSelectOrder}
            getFirstImage={getFirstImage}
            getStatusBadge={getStatusBadge}
            formatDate={formatDate}
          />
        );
      case "Notifications":
        return <NotificationsContent />;
      case "Voucher Wallet":
        return <VoucherWalletContent />;
      case "My Account":
        return <ProfileContent />;
      default:
        return null;
    }
  };

  return (
    <div className="font-inter bg-[#F9FAFB] min-h-screen py-10">
      <div className="container mx-auto px-3.5 lg:px-33.75">
        <div className="flex flex-col md:flex-row gap-6">
          {/* LEFT SIDEBAR */}
          <Sidebar
            activeMenu={activeMenu}
            activeSubmenu={activeSubmenu}
            onMenuClick={handleMenuClick}
            onSubmenuClick={handleSubmenuClick}
            redColor={COLORS.redColor}
          />

          {/* RIGHT CONTENT */}
          <div className="flex-1">
            <div className="bg-white rounded shadow-sm border border-gray-200 min-h-[600px]">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      {/* ORDER DETAIL MODAL */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={handleCloseModal}
          getFirstImage={getFirstImage}
          getStatusBadge={getStatusBadge}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

export default UserAccountPage;

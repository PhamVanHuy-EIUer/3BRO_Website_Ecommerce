"use client";
import React, { useState } from "react";
import { ChevronLeftIcon, XIcon, BoxIcon, StarIcon } from "lucide-react";
import type { ViewOrderUser } from "@/models/ViewOrderUser";
import { formatCurrency } from "@/utils/currency";
import { COLORS } from "@/data/data";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { reviewService } from "@/services/review.service";
import { notification } from "antd";

interface OrderDetailModalProps {
  order: ViewOrderUser;
  onClose: () => void;
  getFirstImage: (imageUrl: string | null | undefined) => string;
  getStatusBadge: (status: string) => React.ReactNode;
  formatDate: (dateString: string) => string;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  getFirstImage,
  getStatusBadge,
  formatDate,
}) => {
  const { redColor, bgRed } = COLORS;
  const router = useRouter();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const handleReviewClick = () => {
    setShowReviewModal(true);
    // Mặc định chọn sản phẩm đầu tiên
    if (order.items.length > 0) {
      setSelectedProduct(order.items[0]);
    }
  };

  const handleCloseReview = () => {
    setShowReviewModal(false);
    setSelectedProduct(null);
    setRating(0);
    setHoverRating(0);
    setReviewText("");
  };

  const handleSubmitReview = async () => {
    if (!selectedProduct || !rating || !reviewText) return;

    try {
      setSubmitting(true);
      const res = await reviewService.postReview(
        selectedProduct.productId,
        rating,
        reviewText,
      );

      if (res.isSuccess && res.code === "200") {
        api.success({
          title: "Success",
          description: "Review submitted successfully!",
          placement: "topRight",
        });
        handleCloseReview();
      } else {
        api.error({
          title: "Error",
          description: res.message || "Could not submit review.",
          placement: "topRight",
        });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      api.error({
        message: "Error",
        description: "An unexpected error occurred.",
        placement: "topRight",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {contextHolder}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold">Order Details</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-bold text-lg">{order.orderId}</p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(order.status)}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Order Date</p>
                    <p className="font-medium">
                      {formatDate(order.createdDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Items</p>
                    <p className="font-medium">
                      {order.items.length} product(s)
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-4">Products</h3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.orderItemId}
                      className="flex gap-4 p-4 bg-gray-50 rounded"
                    >
                      <div className="w-20 h-20 bg-white border border-gray-200 flex-shrink-0 rounded overflow-hidden">
                        {item.imageUrl ? (
                          <Image
                            src={getFirstImage(item.imageUrl)}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                            width={200}
                            height={200}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <BoxIcon className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-black font-medium mb-1">
                          {item.productName}
                        </h4>
                        <div className="flex justify-between items-end">
                          <p className="text-gray-500 text-sm">
                            Quantity: x{item.quantity}
                          </p>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">
                              {formatCurrency(item.price)} each
                            </p>
                            <p className={`font-bold ${redColor}`}>
                              {formatCurrency(item.totalPrice)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatCurrency(order.subTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping Fee</span>
                  <span>{formatCurrency(order.shippingFee)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-[#00BFA5]">
                    <span>Discount</span>
                    <span>-{formatCurrency(order.discountAmount)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-300 flex justify-between items-center">
                  <span className="font-bold">Total</span>
                  <span className={`text-xl font-bold ${redColor}`}>
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  className={`flex-1 ${bgRed} text-white px-6 py-3 rounded hover:bg-red-600 transition`}
                  onClick={handleReviewClick}
                >
                  Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Review Modal */}
      {showReviewModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-[60] p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Write a Review</h2>
              <button
                onClick={handleCloseReview}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Product Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Select Product
                </label>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.orderItemId}
                      onClick={() => setSelectedProduct(item)}
                      className={`flex gap-3 p-3 rounded border-2 cursor-pointer transition ${
                        selectedProduct?.orderItemId === item.orderItemId
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="w-16 h-16 bg-white border border-gray-200 flex-shrink-0 rounded overflow-hidden">
                        {item.imageUrl ? (
                          <Image
                            src={getFirstImage(item.imageUrl)}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                            width={100}
                            height={100}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <BoxIcon className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.productName}</h4>
                        <p className="text-sm text-gray-500">
                          Quantity: x{item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Your Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <StarIcon
                        className={`w-8 h-8 ${
                          star <= (hoverRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-gray-600">
                    {rating > 0 && `${rating} star${rating > 1 ? "s" : ""}`}
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Your Review
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="w-full border border-gray-300 rounded p-3 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <button
                  onClick={handleSubmitReview}
                  disabled={
                    !selectedProduct ||
                    rating === 0 ||
                    !reviewText.trim() ||
                    submitting
                  }
                  className={`flex-1 ${submitting ? "bg-gray-400" : bgRed} text-white px-6 py-3 rounded transition ${
                    !selectedProduct ||
                    rating === 0 ||
                    !reviewText.trim() ||
                    submitting
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-red-600"
                  }`}
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
                <button
                  onClick={handleCloseReview}
                  className="flex-1 border border-gray-300 text-gray-600 px-6 py-3 rounded hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default OrderDetailModal;

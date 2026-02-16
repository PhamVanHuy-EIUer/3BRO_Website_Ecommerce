"use client";

import React, { useEffect, useState } from "react";
import { reviewService } from "@/services/review.service";
import { Review } from "@/models/Review";
import { ApiResponse } from "@/models/ApiResponse";
import Stars from "@/components/products/Stars";
import { formatDate } from "@/utils/date";
import {
  Modal,
  Form,
  Input,
  Rate,
  notification,
  Spin,
  Pagination,
  Empty,
} from "antd";
import { EditOutlined } from "@ant-design/icons";

const ReviewUserPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalElement, setTotalElement] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const fetchReviews = async (page: number) => {
    setLoading(true);
    try {
      const res: ApiResponse<Review> = await reviewService.getReviewByUser(
        page,
        pageSize,
      );
      if (res.isSuccess) {
        setReviews(res.list || []);
        setTotalElement(res.totalElement);
      } else {
        api.error({
          title: "Error loadding",
          description: res.message,
          placement: "topRight",
          duration: 2,
        });
      }
    } catch (error) {
      console.error("Fetch reviews error:", error);
      api.error({
        title: "Error connection",
        description: "Can't fetch reviews from server",
        placement: "topRight",
        duration: 2,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(currentPage);
  }, [currentPage]);

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    form.setFieldsValue({
      rating: review.rating,
      comment: review.comment,
    });
    setIsModalOpen(true);
  };

  const handleUpdate = async (values: { rating: number; comment: string }) => {
    if (!editingReview) return;

    try {
      const res = await reviewService.updateReview(
        editingReview.reviewId,
        editingReview.productId || "",
        values.rating,
        values.comment,
      );

      if (res.isSuccess) {
        api.success({
          title: "Update review successfully",
          description: "Your review has been updated.",
          placement: "topRight",
          duration: 2,
        });
        setIsModalOpen(false);
        fetchReviews(currentPage);
      } else {
        api.error({
          title: "Update failed",
          description: res.message,
          placement: "topRight",
          duration: 2,
        });
      }
    } catch (error) {
      console.error("Update review error:", error);
      api.error({
        title: "Error connection",
        description: "Không thể cập nhật đánh giá vui lòng thử lại sau.",
        placement: "topRight",
        duration: 2,
      });
    }
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4 md:p-8 bg-white rounded-2xl shadow-sm min-h-[600px]">
      {contextHolder}
      <h1 className="text-2xl font-bold mb-8 text-gray-800">My Reviews</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.reviewId}
              className="border border-gray-100 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {review.productName}
                    </h3>
                    <Stars stars={review.rating} />
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "{review.comment}"
                  </p>
                  <div className="text-sm text-gray-400">
                    Review Date: {formatDate(review.reviewDate)}
                  </div>
                </div>
                <button
                  onClick={() => handleEdit(review)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors duration-200 font-medium"
                >
                  <EditOutlined />
                  Edit Review
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-center pt-8">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalElement}
              onChange={onPageChange}
              showSizeChanger={false}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <Empty description="You have no reviews." />
        </div>
      )}

      <Modal
        title={`Update review for ${editingReview?.productName}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={{ rating: 5, comment: "" }}
          className="mt-6"
        >
          <Form.Item
            name="rating"
            label="Rating"
            rules={[{ required: true, message: "Please select a rating" }]}
          >
            <Rate />
          </Form.Item>

          <Form.Item
            name="comment"
            label="Your comment"
            rules={[
              { required: true, message: "Please enter your comment" },
              { min: 10, message: "Comment must be at least 10 characters" },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Share your experience about this product..."
            />
          </Form.Item>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
            >
              Save changes
            </button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ReviewUserPage;

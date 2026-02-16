"use client";

import { useState, useEffect, useCallback } from "react";
import { reviewService } from "@/services/review.service";
import { Review } from "@/models/Review";
import { motion } from "framer-motion";
import { MessageSquare, Star } from "lucide-react";
import { notification, Table, Card, Tag, Button, Modal } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { DeleteOutlined } from "@ant-design/icons";
import PageLoading from "@/components/Loading";

export default function ReviewAdmin() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });

  const [api, contextHolder] = notification.useNotification();

  // ================= LOAD DATA =================
  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);

      const page = pagination.current ?? 1;
      const size = pagination.pageSize ?? 10;

      const response = await reviewService.getReviewByAdmin(page, size);

      if (response?.list) {
        setReviews(response.list);
        setTotalElements(response.totalElement ?? 0);
      }
    } catch (error) {
      console.error(error);
      api.error({
        message: "Error",
        description: "Failed to load reviews.",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, api]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  // ================= DELETE =================
  const handleDeleteReview = (review: Review) => {
    Modal.confirm({
      title: "Delete Review",
      content: `Are you sure you want to delete review by ${review.reviewName}?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        try {
          const res = await reviewService.deleteReview(review.reviewId);

          if (res?.isSuccess) {
            api.success({
              message: "Deleted",
              description: "Review deleted successfully.",
              placement: "topRight",
            });

            loadReviews();
          } else {
            api.error({
              message: "Error",
              description: res?.message || "Delete failed.",
              placement: "topRight",
            });
          }
        } catch {
          api.error({
            message: "Error",
            description: "An error occurred while deleting.",
            placement: "topRight",
          });
        }
      },
    });
  };

  // ================= TABLE COLUMNS =================
  const columns: ColumnsType<Review> = [
    {
      title: "Customer",
      dataIndex: "reviewName",
      key: "reviewName",
      width: 150,
      render: (text) => (
        <span className="font-semibold text-slate-900">{text}</span>
      ),
    },
    {
      title: "Product",
      dataIndex: "productName",
      key: "productName",
      width: 200,
      render: (text) => (
        <Tag color="geekblue" className="whitespace-normal">
          {text}
        </Tag>
      ),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      width: 120,
      render: (rating: number) => (
        <div className="flex items-center gap-1 text-yellow-500">
          <Star size={16} fill="currentColor" />
          <span className="font-bold">{rating}/5</span>
        </div>
      ),
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      render: (text) => (
        <div className="text-slate-600 max-w-md italic overflow-hidden text-ellipsis">
          "{text || "No comment provided"}"
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "reviewDate",
      key: "reviewDate",
      width: 160,
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Actions",
      key: "action",
      width: 100,
      fixed: "right",
      render: (_, record) => (
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteReview(record)}
        />
      ),
    },
  ];

  // ================= PAGINATION CHANGE =================
  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination({
      current: newPagination.current ?? 1,
      pageSize: newPagination.pageSize ?? 10,
    });
  };

  return (
    <>
      {contextHolder}

      <div className="min-h-screen bg-slate-50 p-5">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <MessageSquare size={32} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Review Management
              </h1>
              <p className="text-slate-600">
                Total {totalElements} customer reviews
              </p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="rounded-2xl shadow-lg border-none overflow-hidden">
            <Table
              columns={columns}
              dataSource={reviews}
              rowKey="reviewId"
              loading={loading}
              pagination={{
                ...pagination,
                total: totalElements,
                showSizeChanger: true,
                pageSizeOptions: ["5", "10", "20", "50"],
                showTotal: (total) => `Total ${total} reviews`,
              }}
              onChange={handleTableChange}
              scroll={{ x: 1000 }}
            />
          </Card>
        </motion.div>
      </div>
    </>
  );
}

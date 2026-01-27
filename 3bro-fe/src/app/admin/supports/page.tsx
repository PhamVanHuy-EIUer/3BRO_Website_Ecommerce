"use client";

import React, { useState, useEffect } from "react";
import { supportService } from "@/services/support.service";
import { Trash2, Eye, RefreshCw } from "lucide-react";
import { ApiResponse } from "@/models/ApiResponse";
import { SupportResponse } from "@/models/SupportResponse";
import { notification, Modal, Input, Spin } from "antd";

const { TextArea } = Input;

interface SupportRequest {
  id: string;
  name: string;
  email: string;
  subject: string;
  message?: string;
  createdDate: string;
}

const SupportPage = () => {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(
    null,
  );
  const [api, contextHolder] = notification.useNotification();
  const [showModal, setShowModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [formResponse, setFormResponse] = useState<SupportResponse>({
    email: "",
    response: "",
  });

  const handleChangeForm = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormResponse((prev) => ({
      ...prev,
      response: e.target.value,
    }));
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data: ApiResponse<SupportRequest> =
        await supportService.receiveRequestInAdmin();
      setRequests(data.list);
    } catch (error) {
      console.error("Error fetching requests:", error);
      api.error({
        title: "Cannot load requests",
        duration: 2,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this request?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await supportService.deleteRequest(id);
          setRequests(requests.filter((req) => req.id !== id));
          if (selectedRequest?.id === id) {
            setShowModal(false);
            setSelectedRequest(null);
          }
          api.success({
            title: "Delete request successfully",
            duration: 2,
          });
        } catch (error) {
          console.error("Error deleting request:", error);
          api.error({
            title: "Cannot delete request",
            duration: 2,
          });
        }
      },
    });
  };

  const handleViewDetails = async (request: SupportRequest) => {
    setShowModal(true);
    setLoadingDetails(true);

    try {
      const res: ApiResponse<SupportRequest> =
        await supportService.getMessageRequest(request.id);

      if (res.isSuccess && res.object) {
        setSelectedRequest(res.object);
        setFormResponse({
          email: res.object.email,
          response: "",
        });
      } else {
        api.error({
          title: "Cannot load details",
          duration: 2,
        });
        setShowModal(false);
      }
    } catch (err) {
      console.error("Error fetching request details:", err);
      api.error({
        title: "Cannot load details",
        duration: 2,
      });
      setShowModal(false);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSendResponse = async () => {
    if (!formResponse.response.trim()) {
      api.error({
        title: "Please fill response field",
        duration: 2,
      });
      return;
    }

    try {
      setSending(true);
      const res: ApiResponse<any> =
        await supportService.sendResponseByAdmin(formResponse);

      if (res.isSuccess) {
        api.success({
          title: res.message || "Send response successfully",
          duration: 2,
        });
        setShowModal(false);
        setSelectedRequest(null);
        setFormResponse({ email: "", response: "" });
        fetchRequests();
      } else {
        api.error({
          title: res.message || "Cannot send response",
          duration: 2,
        });
      }
    } catch (error) {
      console.error("Error sending response:", error);
      api.error({
        title: "Error sending response",
        duration: 2,
      });
    } finally {
      setSending(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
    setFormResponse({ email: "", response: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {contextHolder}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Support Management
              </h1>
              <p className="text-gray-600 mt-1">
                View and manage support requests
              </p>
            </div>
            <button
              onClick={fetchRequests}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw size={18} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-600 text-sm">Total Request</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {requests.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-600 text-sm">Request in 7 days</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {
                requests.filter((r) => {
                  const requestDate = new Date(r.createdDate);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return requestDate >= weekAgo;
                }).length
              }
            </p>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No Request</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Sender
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Create Date
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {requests.map((request) => (
                    <tr
                      key={request.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {request.name || "Unknown User"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {request.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900 line-clamp-2">
                          {request.subject}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(request.createdDate).toLocaleDateString(
                          "vi-VN",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewDetails(request)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(request.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Ant Design Modal */}
      <Modal
        title={<span className="text-xl font-bold">Request Details</span>}
        open={showModal}
        onCancel={handleCloseModal}
        width={800}
        footer={[
          <button
            key="cancel"
            onClick={handleCloseModal}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors mr-2"
          >
            Close
          </button>,
          <button
            key="submit"
            onClick={handleSendResponse}
            disabled={sending || !formResponse.response.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {sending ? "Sending..." : "Send Response"}
          </button>,
        ]}
      >
        {loadingDetails ? (
          <div className="py-12 text-center">
            <Spin size="large" />
            <p className="mt-4 text-gray-600">Loading details...</p>
          </div>
        ) : selectedRequest ? (
          <div className="space-y-6">
            {/* Request Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Sender
                </label>
                <p className="text-gray-900 font-medium">
                  {selectedRequest.name}
                </p>
                <p className="text-sm text-gray-500">{selectedRequest.email}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Title
                </label>
                <p className="text-gray-900">{selectedRequest.subject}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Message
                </label>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-48 overflow-y-auto">
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {selectedRequest.message || "No content"}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Create Date
                </label>
                <p className="text-gray-900">
                  {new Date(selectedRequest.createdDate).toLocaleString(
                    "vi-VN",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </p>
              </div>
            </div>

            {/* Response Section */}
            <div className="border-t border-gray-200 pt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Feedback
              </label>
              <TextArea
                value={formResponse.response}
                onChange={handleChangeForm}
                placeholder="Enter your response here..."
                rows={6}
                className="w-full"
              />
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default SupportPage;

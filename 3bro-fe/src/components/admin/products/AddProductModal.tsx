import { Category } from "@/models/Category";
import { UploadFile } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { ProductImageUpload } from "./ProductImageUpload";
import { ProductForm } from "./ProductForm";
import { X } from "lucide-react";

interface AddProductModalProps {
  isOpen: boolean;
  formData: {
    productName: string;
    description: string;
    price: number;
    stock: number;
    categoryId: string;
  };
  previewImage: string;
  fileList: UploadFile[];
  categories: Category[];
  categoriesLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onFormChange: (data: any) => void;
  onImageChange: any;
  onBeforeUpload: (file: File) => boolean;
  onImageRemove: () => void;
}

export const AddProductModal = ({
  isOpen,
  formData,
  previewImage,
  fileList,
  categories,
  categoriesLoading,
  onClose,
  onConfirm,
  onFormChange,
  onImageChange,
  onBeforeUpload,
  onImageRemove,
}: AddProductModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.2 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex items-center p-4 w-full"
      >
        <motion.div
          className="shadow-2xl p-5 w-full mx-4 overflow-y-auto"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <h3 className="text-2xl font-semibold text-gray-900">
              Add Product
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Image Upload */}
          <ProductImageUpload
            previewImage={previewImage}
            fileList={fileList}
            productName={formData.productName}
            onImageChange={onImageChange}
            onBeforeUpload={onBeforeUpload}
            onRemove={onImageRemove}
          />

          {/* Form */}
          <ProductForm
            formData={formData}
            categories={categories}
            categoriesLoading={categoriesLoading}
            onChange={onFormChange}
          />

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-4 border-t">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Add Product
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

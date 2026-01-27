import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { UploadFile } from "antd";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { ProductImageUpload } from "./ProductImageUpload";
import { ProductForm } from "./ProductForm";

interface UpdateProductModalProps {
  isOpen: boolean;
  product: Product | null;
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

export const UpdateProductModal = ({
  isOpen,
  product,
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
}: UpdateProductModalProps) => {
  if (!isOpen || !product) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-25 flex items-center justify-center bg-[rgba(0,0,0,0.5)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <h3 className="text-2xl font-semibold text-gray-900">
              Update Product
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
              Update Product
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

import { Image, Upload } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { ImagePlus } from "lucide-react";

interface ProductImageUploadProps {
  previewImage: string;
  fileList: UploadFile[];
  productName: string;
  onImageChange: UploadProps["onChange"];
  onBeforeUpload: (file: File) => boolean;
  onRemove: () => void;
}

export const ProductImageUpload = ({
  previewImage,
  fileList,
  productName,
  onImageChange,
  onBeforeUpload,
  onRemove,
}: ProductImageUploadProps) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Product Image
      </label>
      <div className="flex flex-col items-center gap-4">
        {/* Preview */}
        <Image
          src={previewImage}
          alt={productName}
          width={200}
          height={200}
          style={{ borderRadius: "12px", objectFit: "cover" }}
          preview={true}
          fallback="/blank.jpg"
        />

        {/* Upload Button */}
        <Upload
          listType="picture"
          fileList={fileList}
          onChange={onImageChange}
          beforeUpload={onBeforeUpload}
          maxCount={1}
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onRemove={onRemove}
        >
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ImagePlus size={20} />
            <span>Change Image</span>
          </button>
        </Upload>
        <p className="text-xs text-gray-500">
          Supported formats: PNG, JPG, JPEG, WEBP (Max 5MB)
        </p>
      </div>
    </div>
  );
};

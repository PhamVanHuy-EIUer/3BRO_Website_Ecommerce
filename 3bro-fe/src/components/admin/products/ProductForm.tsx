import { Input, InputNumber, Select, Form } from "antd";
import { Category } from "@/models/Category";

const { TextArea } = Input;

interface ProductFormData {
  productName: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
}

interface ProductFormProps {
  formData: ProductFormData;
  categories: Category[];
  categoriesLoading: boolean;
  onChange: (data: Partial<ProductFormData>) => void;
}

export const ProductForm = ({
  formData,
  categories,
  categoriesLoading,
  onChange,
}: ProductFormProps) => {
  return (
    <div className="space-y-4">
      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Name <span className="text-red-500">*</span>
        </label>
        <Input
          placeholder="Enter product name"
          value={formData.productName}
          onChange={(e) => onChange({ productName: e.target.value })}
          size="large"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <TextArea
          placeholder="Enter product description"
          value={formData.description}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={4}
          size="large"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category <span className="text-red-500">*</span>
        </label>
        <Select
          placeholder="Select category"
          value={formData.categoryId || undefined}
          onChange={(value) => onChange({ categoryId: value })}
          size="large"
          className="w-full"
          showSearch
          loading={categoriesLoading}
          disabled={categoriesLoading}
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={categories.map((cat) => ({
            value: cat.id,
            label: cat.categoryName,
          }))}
          notFoundContent={
            categoriesLoading ? "Loading..." : "No categories found"
          }
        />
      </div>

      {/* Price and Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price ($) <span className="text-red-500">*</span>
          </label>
          <InputNumber
            placeholder="0.00"
            value={formData.price}
            onChange={(value) => onChange({ price: value || 0 })}
            min={0}
            step={0.01}
            precision={2}
            size="large"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock
          </label>
          <InputNumber
            placeholder="0"
            value={formData.stock}
            onChange={(value) => onChange({ stock: value || 0 })}
            min={0}
            size="large"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

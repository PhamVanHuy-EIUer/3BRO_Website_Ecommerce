import { Role } from "@/models/Role";
import { Input, InputNumber, Select, Form } from "antd";

const { TextArea } = Input;

interface ProductFormData {
  fullName: string;
  email: string;
  phone: number;
  address: number;
  roleId: string[];
}

interface ProductFormProps {
  formData: ProductFormData;
  roles: Role[];
  rolesLoading: boolean;
  onChange: (data: Partial<ProductFormData>) => void;
}

export const UserForm = ({
  formData,
  roles,
  rolesLoading,
  onChange,
}: ProductFormProps) => {
  return (
    <div className="space-y-4">
      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          UserName <span className="text-red-500">*</span>
        </label>
        <Input
          placeholder="Enter product name"
          value={formData.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
          size="large"
        />
      </div>

      {/* email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <TextArea
          placeholder="Enter product description"
          value={formData.email}
          onChange={(e) => onChange({ email: e.target.value })}
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
          value={formData.roleId || undefined}
          onChange={(value) => onChange({ roleId: value })}
          size="large"
          className="w-full"
          showSearch
          loading={rolesLoading}
          disabled={rolesLoading}
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={roles.map((cat) => ({
            value: cat.id,
            label: cat.name,
          }))}
          notFoundContent={rolesLoading ? "Loading..." : "No roles found"}
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
            value={formData.phone}
            onChange={(value) => onChange({ phone: value || 0 })}
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
            value={formData.address}
            onChange={(value) => onChange({ address: value || 0 })}
            min={0}
            size="large"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

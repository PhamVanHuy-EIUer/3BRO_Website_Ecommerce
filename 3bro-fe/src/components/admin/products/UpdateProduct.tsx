import React from "react";

// ==========================================
// ICONS (SVG)
// ==========================================

const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const SaveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

// ==========================================
// MAIN COMPONENT
// ==========================================

const UpdateProductContent: React.FC = () => {
  // Style constants
  const inputStyle =
    "w-full bg-[#F3F4F6] border border-transparent rounded px-4 py-3 outline-none focus:border-[#DB4444] focus:bg-white transition-all text-sm";
  const labelStyle = "block text-black font-medium mb-2 text-sm";
  const cardStyle = "bg-white p-6 rounded-lg shadow-sm border border-[#E5E7EB]";

  return (
    <div className="font-inter bg-[#F9FAFB] min-h-screen py-10">
      <div className="container mx-auto px-4 lg:px-[135px]">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-sm text-gray-500 mb-2">
              <span className="cursor-pointer hover:text-black">Dashboard</span>{" "}
              /{" "}
              <span className="cursor-pointer hover:text-black">Products</span>{" "}
              / <span className="text-black font-medium">Update Product</span>
            </div>
            <h1 className="text-2xl font-bold text-black">Update Product</h1>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-2.5 rounded border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition">
              Cancel
            </button>
            <button className="px-6 py-2.5 rounded bg-[#DB4444] text-white font-medium hover:bg-red-600 transition flex items-center gap-2">
              <SaveIcon className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>

        {/* Main Grid Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ================= LEFT COLUMN (General Info & Media) ================= */}
          <div className="lg:col-span-2 space-y-8">
            {/* General Information Card */}
            <div className={cardStyle}>
              <h2 className="text-lg font-bold text-black mb-6">
                General Information
              </h2>
              <div className="space-y-6">
                <div>
                  <label className={labelStyle}>Product Name</label>
                  <input
                    type="text"
                    defaultValue="Havic HV G-92 Gamepad"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelStyle}>Description</label>
                  <textarea
                    rows={6}
                    defaultValue="PlayStation 5 Controller Skin High quality vinyl with air channel adhesive for easy bubble free install & mess free removal Pressure sensitive."
                    className={`${inputStyle} resize-none`}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Set a description to the product for better visibility.
                  </p>
                </div>
              </div>
            </div>

            {/* Media/Images Card */}
            <div className={cardStyle}>
              <h2 className="text-lg font-bold text-black mb-6">
                Product Media
              </h2>

              {/* Image Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {/* Existing Image 1 */}
                <div className="relative group aspect-square bg-gray-100 rounded border border-gray-200 flex items-center justify-center overflow-hidden">
                  {/* Placeholder for image */}
                  <div className="text-xs text-gray-400">img_01.png</div>
                  <button className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition text-red-500">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
                {/* Existing Image 2 */}
                <div className="relative group aspect-square bg-gray-100 rounded border border-gray-200 flex items-center justify-center overflow-hidden">
                  <div className="text-xs text-gray-400">img_02.png</div>
                  <button className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition text-red-500">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Upload Placeholder */}
                <div className="col-span-2 md:col-span-2 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:border-[#DB4444] hover:bg-red-50 transition bg-gray-50 aspect-[2/1] md:aspect-auto">
                  <UploadIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-600">
                    Click to upload image
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    SVG, PNG, JPG or GIF (max. 800x400px)
                  </span>
                </div>
              </div>
            </div>

            {/* Inventory Card */}
            <div className={cardStyle}>
              <h2 className="text-lg font-bold text-black mb-6">Inventory</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}>SKU</label>
                  <input
                    type="text"
                    defaultValue="HV-G92-RED"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelStyle}>
                    Barcode (ISBN, UPC, GTIN, etc.)
                  </label>
                  <input
                    type="text"
                    defaultValue="928374923"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelStyle}>Quantity</label>
                  <input
                    type="number"
                    defaultValue="150"
                    className={inputStyle}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN (Pricing & Organization) ================= */}
          <div className="lg:col-span-1 space-y-8">
            {/* Pricing Card */}
            <div className={cardStyle}>
              <h2 className="text-lg font-bold text-black mb-6">Pricing</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelStyle}>Base Price ($)</label>
                  <input
                    type="number"
                    defaultValue="192.00"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelStyle}>Discount Price ($)</label>
                  <input
                    type="number"
                    defaultValue="160.00"
                    className={inputStyle}
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="tax"
                    className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                  />
                  <label
                    htmlFor="tax"
                    className="text-sm text-gray-600 select-none"
                  >
                    Charge tax on this product
                  </label>
                </div>
              </div>
            </div>

            {/* Organization Card */}
            <div className={cardStyle}>
              <h2 className="text-lg font-bold text-black mb-6">
                Organization
              </h2>
              <div className="space-y-4">
                <div>
                  <label className={labelStyle}>Category</label>
                  <select className={inputStyle}>
                    <option>Gaming</option>
                    <option>Electronics</option>
                    <option>Accessories</option>
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Status</label>
                  <select className={inputStyle}>
                    <option>Published</option>
                    <option>Draft</option>
                    <option>Inactive</option>
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Tags</label>
                  <input
                    type="text"
                    placeholder="Add tags..."
                    className={inputStyle}
                  />
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600 flex items-center gap-1">
                      Game <button>×</button>
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600 flex items-center gap-1">
                      Controller <button>×</button>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Attributes/Variations (Simple version) */}
            <div className={cardStyle}>
              <h2 className="text-lg font-bold text-black mb-6">Variations</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelStyle}>Colors</label>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#DB4444] border-2 border-black cursor-pointer"></div>
                    <div className="w-8 h-8 rounded-full bg-black border border-gray-200 cursor-pointer opacity-50 hover:opacity-100"></div>
                  </div>
                </div>
                <div>
                  <label className={labelStyle}>Sizes</label>
                  <div className="flex gap-2">
                    <button className="w-10 h-10 border border-[#DB4444] bg-[#DB4444] text-white rounded text-sm font-medium">
                      M
                    </button>
                    <button className="w-10 h-10 border border-gray-300 rounded text-sm font-medium text-gray-600 hover:border-black">
                      L
                    </button>
                    <button className="w-10 h-10 border border-gray-300 rounded text-sm font-medium text-gray-600 hover:border-black">
                      XL
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProductContent;

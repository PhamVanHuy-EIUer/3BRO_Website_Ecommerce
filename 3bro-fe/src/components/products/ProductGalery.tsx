"use client";
import { Product } from "@/models/Product";
import { ProductImage } from "@/models/ProductImage";
import { useState } from "react";
import { Heart, Minus, Plus, Truck, RotateCcw } from "lucide-react";
import { Image } from "antd";

export default function ProductGallery({
  product,
  imageProduct,
}: {
  product: Product;
  imageProduct: ProductImage[];
}) {
  const getFirstImage = (imageUrl: string | null | undefined) => {
    if (!imageUrl) return "/blank.jpg";
    return imageUrl.startsWith("http")
      ? imageUrl
      : `https://localhost:7041${imageUrl}`;
  };

  const [active, setActive] = useState(getFirstImage(product.imageUrl));
  const [quantity, setQuantity] = useState(1);

  // Check if product is in stock
  const isInStock = product.stock > 0;
  const stockStatus = isInStock ? "In Stock" : "Out of Stock";
  const stockColor = isInStock ? "text-green-500" : "text-red-500";

  return (
    <div className="min-h-screen ">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <p className="text-sm text-gray-500 uppercase">
          Account / {product.categoryName} /{" "}
          <span className="text-gray-900">{product.productName}</span>
        </p>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left - Images */}
          <div className="flex gap-4">
            {/* Thumbnails */}
            <div className="flex flex-col gap-4">
              {/* Main product image as first thumbnail */}
              <button
                onClick={() => setActive(getFirstImage(product.imageUrl))}
                className={`w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                  active === getFirstImage(product.imageUrl)
                    ? "border-red-500"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Image
                  src={getFirstImage(product.imageUrl)}
                  alt={product.productName}
                  width={100}
                  height={100}
                  className=" object-cover"
                />
              </button>

              {/* Additional product images */}
              {imageProduct &&
                imageProduct.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setActive(getFirstImage(img.imageUrl))}
                    className={`w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      active === getFirstImage(img.imageUrl)
                        ? "border-red-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={getFirstImage(img.imageUrl)}
                      alt={`${product.productName} - ${img.id}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 bg-linear-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
              <img
                src={active}
                alt={product.productName}
                className="w-full h-full object-contain "
              />
            </div>
          </div>

          {/* Right - Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-3">
                {product.productName}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-500">(150 Reviews)</span>
                <span className={`text-sm font-medium ${stockColor}`}>
                  | {stockStatus}
                </span>
              </div>

              {/* Price */}
              <p className="text-3xl font-semibold text-gray-900 mb-4">
                ${product.price.toFixed(2)}
              </p>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed pb-6 border-b">
                {product.description}
              </p>
            </div>

            {/* Colors */}
            {/* <div>
              <p className="text-lg font-medium mb-3">
                Colours:{" "}
                <span className="inline-flex gap-2 ml-2">
                  <button className="w-6 h-6 rounded-full bg-purple-500 border-2 border-gray-300 hover:border-gray-900 transition-all" />
                  <button className="w-6 h-6 rounded-full bg-red-500 border-2 border-gray-900 transition-all" />
                </span>
              </p>
            </div> */}

            {/* Sizes */}
            {/* <div>
              <p className="text-lg font-medium mb-3">Size:</p>
              <div className="flex gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-12 px-4 h-10 rounded border transition-all font-medium ${
                      selectedSize === size
                        ? "bg-red-500 text-white border-red-500"
                        : "bg-white text-gray-900 border-gray-300 hover:border-red-500"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div> */}

            {/* Stock Warning */}
            {product.stock > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  {product.stock} items left in stock!
                </p>
              </div>
            )}

            {/* Quantity & Buttons */}
            <div className="flex gap-4 items-center flex-wrap">
              <div className="flex items-center border-2 border-gray-300 rounded overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-11 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={quantity <= 1}
                >
                  <Minus size={20} />
                </button>
                <span className="w-20 h-11 flex items-center justify-center border-x-2 border-gray-300 font-semibold text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="w-10 h-11 flex items-center justify-center bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={quantity >= product.stock}
                >
                  <Plus size={20} />
                </button>
              </div>

              <button
                className="px-12 h-11 bg-red-500 text-white rounded font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isInStock}
              >
                Buy Now
              </button>

              <button className="w-11 h-11 border-2 border-gray-300 rounded flex items-center justify-center hover:border-red-500 hover:text-red-500 transition-colors">
                <Heart size={20} />
              </button>
            </div>

            {!isInStock && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800 font-medium">
                  This product is currently out of stock
                </p>
              </div>
            )}

            {/* Delivery Info */}
            <div className="space-y-0 border-2 border-gray-300 rounded-lg overflow-hidden">
              <div className="flex items-center gap-4 p-6">
                <div className="w-10 h-10 flex items-center justify-center">
                  <Truck size={32} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-semibold mb-1">Free Delivery</p>
                  <p className="text-sm text-gray-600">
                    <span className="underline cursor-pointer">
                      Enter your postal code for Delivery Availability
                    </span>
                  </p>
                </div>
              </div>

              <div className="border-t-2 border-gray-300">
                <div className="flex items-center gap-4 p-6">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <RotateCcw size={32} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Return Delivery</p>
                    <p className="text-sm text-gray-600">
                      Free 30 Days Delivery Returns.{" "}
                      <span className="underline cursor-pointer">Details</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Meta Info */}
            {(product.createdDate || product.updatedDate) && (
              <div className="text-xs text-gray-500 pt-4 border-t">
                {product.createdDate && (
                  <p>
                    Listed: {new Date(product.createdDate).toLocaleDateString()}
                  </p>
                )}
                {product.updatedDate && (
                  <p>
                    Updated:{" "}
                    {new Date(product.updatedDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

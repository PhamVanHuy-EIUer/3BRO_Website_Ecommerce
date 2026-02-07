"use client";
import { Product } from "@/models/Product";
import { ProductImage } from "@/models/ProductImage";
import { ChangeEvent, use, useState } from "react";
import { Heart, Minus, Plus, Truck, RotateCcw } from "lucide-react";
import { notification, Rate } from "antd";
import { formatCurrency } from "@/utils/currency";
import { ApiResponse } from "@/models/ApiResponse";
import { cartService } from "@/services/cart.service";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ZoomInOutlined, ZoomOutOutlined } from "@ant-design/icons";
import Image from "next/image";
import MainImage from "./MainImage";

export default function ProductGallery({
  product,
  imageProduct,
}: {
  product: Product;
  imageProduct: ProductImage[];
}) {
  const getFirstImage = (imageUrl: string | null | undefined) => {
    if (!imageUrl) return "/blank.jpg";

    // Nếu đã là URL đầy đủ (http hoặc https), trả về trực tiếp
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }

    // Nếu là đường dẫn tương đối, thêm base URL
    const baseUrl = "https://localhost:7041";
    const path = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
    return `${baseUrl}${path}`;
  };

  const [active, setActive] = useState(getFirstImage(product.imageUrl));
  const [numberProducts, setNumberProducts] = useState(1);
  const router = useRouter();
  // Check if product is in stock
  const isInStock = product.stock > 0;
  const stockStatus = isInStock ? "In Stock" : "Out of Stock";
  const stockColor = isInStock ? "text-green-500" : "text-red-500";
  const [api, contextHolder] = notification.useNotification();
  const { authorized } = useAuth();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    if (!value || value < 1) return; // chặn 0, NaN, âm

    setNumberProducts(value);
  };

  const hadleAddToCart = async () => {
    if (!authorized) return router.push("/login");
    try {
      const res: ApiResponse<any> = await cartService.addCart(
        product.id,
        numberProducts,
      );
      if (res.code === "401") {
        router.push("/login");
      }

      if (res.code === "200") {
        api.success({
          title: "Add to cart successfully",
          placement: "topRight",
          duration: 2,
        });
      }
    } catch (error) {
      api.error({
        title: "Error fetch data",
        placement: "topRight",
        duration: 2,
      });
    }
  };

  return (
    <>
      {contextHolder}
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
                  <div className="relative w-full h-full">
                    <Image
                      src={getFirstImage(product.imageUrl)}
                      alt={product.productName}
                      className="w-full h-full object-cover"
                      fill
                    />
                  </div>
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
                      <div className="relative w-full h-full">
                        <Image
                          src={getFirstImage(img.imageUrl)}
                          alt={`${product.productName} - ${img.id}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </button>
                  ))}
              </div>

              {/* Main Image - Chỉ ảnh này mới có thể zoom */}
              <MainImage product={product} active={active} />
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
                    <Rate
                      disabled
                      defaultValue={product.rating == null ? 0 : product.rating}
                    />
                  </div>
                  <span className="text-sm text-gray-500">(150 Reviews)</span>
                  <span className={`text-sm font-medium ${stockColor}`}>
                    | {stockStatus}
                  </span>
                </div>

                {/* Price */}
                <p className="text-3xl font-semibold text-gray-900 mb-4">
                  {formatCurrency(product.price)}
                </p>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed pb-6 border-b">
                  {product.description}
                </p>
              </div>

              {/* Stock Warning */}
              {product.stock > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    {product.stock} items left in stock!
                  </p>
                </div>
              )}

              {/* Quantity & Buttons */}
              <div className="flex gap-4 items-center flex-wrap">
                <div className="flex justify-between w-full items-center gap-20">
                  <div className="flex justify-between items-center border-2 border-gray-300 rounded overflow-hidden">
                    <button
                      onClick={() =>
                        setNumberProducts(Math.max(1, numberProducts - 1))
                      }
                      className="w-10 h-11 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={numberProducts <= 1}
                    >
                      <Minus size={20} />
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={numberProducts}
                      onChange={handleChange}
                      className="w-20 h-11 border-x-2 border-gray-300 font-semibold text-lg text-center no-spinner"
                    />
                    <button
                      onClick={() =>
                        setNumberProducts(
                          Math.min(product.stock, numberProducts + 1),
                        )
                      }
                      className="w-10 h-11 flex items-center justify-center bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={numberProducts >= product.stock}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <button className="w-11 h-11 border-2 border-gray-300 rounded flex items-center justify-center hover:border-red-500 hover:text-red-500 transition-colors ">
                    <Heart size={20} />
                  </button>
                </div>
                <div className="flex flex-row gap-10">
                  <button
                    className="px-12 h-11 bg-red-500 text-white rounded font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                    disabled={!isInStock}
                  >
                    Buy Now
                  </button>
                  <button
                    className="px-12 h-11 bg-red-100 rounded font-semibold border text-red-500 hover:bg-white transition-colors cursor-pointer"
                    disabled={!isInStock}
                    onClick={hadleAddToCart}
                  >
                    Add to Cart
                  </button>
                </div>
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
                        <span className="underline cursor-pointer">
                          Details
                        </span>
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
                      Listed:{" "}
                      {new Date(product.createdDate).toLocaleDateString()}
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
    </>
  );
}

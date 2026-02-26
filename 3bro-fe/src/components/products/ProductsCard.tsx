"use client";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/models/Product";
import { Eye, Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { formatCurrency } from "@/utils/currency";
import { Rate, Tooltip, notification } from "antd";
import { useRouter } from "next/navigation";
import { cartService } from "@/services/cart.service";
import { ApiResponse } from "@/models/ApiResponse";

const ProductCard = ({ product }: { product: Product }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response: ApiResponse<any> = await cartService.addCart(
        product.id,
        1,
      );
      if (response.code === "200" && response.isSuccess) {
        api.success({
          title: "Success",
          description: response.message,
          placement: "topRight",
          duration: 3,
        });
      } else {
        api.error({
          title: "Error",
          description: response.message || "Cannot add to cart",
          placement: "topRight",
          duration: 3,
        });
      }
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      api.error({
        message: "Error",
        description: error?.response?.data?.message || "Cannot add to cart",
        placement: "topRight",
        duration: 3,
      });
    }
  };

  const getFirstImage = (imageUrl?: string) => {
    if (!imageUrl) return "/blank.jpg";

    return imageUrl.startsWith("http")
      ? imageUrl
      : `https://localhost:7041${imageUrl}`;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Chỉ navigate khi click vào card chính, không phải buttons
    const target = e.target as HTMLElement;
    if (!target.closest("button")) {
      router.push(`/product/${product.id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white border border-gray-100 rounded-lg h-full flex flex-col hover:shadow-lg transition-all duration-300 w-full cursor-pointer shadow-md"
    >
      {contextHolder}
      {/* Image Container */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
        {/* Action Icons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite((prev) => !prev);
            }}
            className={`bg-white p-2 rounded-full shadow-md transition-colors ${
              isFavorite
                ? "text-red-500 hover:bg-red-50"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/product/${product.id}`);
            }}
            className="bg-white p-2 rounded-full shadow-md hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Product Image */}
        <div className="block w-full h-full">
          <Image
            src={getFirstImage(product.imageUrl)}
            alt={product.productName}
            fill
            unoptimized
            priority
            className="object-contain group-hover:scale-105 transition-transform duration-500 "
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>

        {/* Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="absolute bottom-0 left-0 right-0 bg-black text-white py-3 px-4
                     flex items-center justify-center gap-2
                     opacity-0 group-hover:opacity-100
                     transition-opacity duration-300 hover:bg-gray-800"
        >
          <ShoppingCart className="w-4 h-4" />
          Add To Cart
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title */}
        <Tooltip title={product.productName}>
          <h3
            className="text-gray-900 text-base font-medium mb-2
                         line-clamp-2 leading-6 min-h-[3rem]"
          >
            {product.productName}
          </h3>
        </Tooltip>

        {/* Price + Rating */}
        <div className="mt-auto">
          <span className="text-red-500 font-semibold text-lg">
            {formatCurrency(product.price)}
          </span>

          <div className="flex items-center gap-2 mt-2">
            <Rate disabled value={product.rating ?? 0} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

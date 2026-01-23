"use client";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/models/Product";
import { Eye, Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { formatCurrency } from "@/utils/currency";

const ProductCard = ({ product }: { product: Product }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const getFirstImage = (imageUrl?: string) => {
    if (!imageUrl) return "/blank.jpg";

    return imageUrl.startsWith("http")
      ? imageUrl
      : `https://localhost:7041${imageUrl}`;
  };

  return (
    <div className="group relative bg-white hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 rounded-lg h-full flex flex-col">
      {/* Image Container - Fixed aspect ratio */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
        {/* Action Icons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className={`bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors ${
              isFavorite ? "text-red-500" : "text-gray-600"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>

          <Link
            href={`/product/${product.id}`}
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-2 rounded-full shadow-md hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Image */}
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <div className="relative w-full h-full">
            <Image
              src={getFirstImage(product.imageUrl)}
              alt={product.productName}
              unoptimized
              fill
              className="object-contain group-hover:scale-105 transition-transform duration-500 p-6"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        </Link>

        {/* Add to Cart Button - Shows on hover */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // onAddToCart(product.id);
            console.log("Add to cart:", product.id);
          }}
          className="absolute bottom-0 left-0 right-0 bg-black text-white py-3 px-4 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-800"
        >
          <ShoppingCart className="w-4 h-4" />
          Add To Cart
        </button>
      </div>

      {/* Product Info */}
      <Link
        href={`/product/${product.id}`}
        className="p-4 flex-1 flex flex-col justify-between"
      >
        <h3 className="font-medium text-gray-900 text-base mb-2 line-clamp-2 min-h-[12]">
          {product.productName}
        </h3>

        <div className="mt-auto">
          <div className="flex items-center gap-3">
            <span className="text-red-500 font-semibold text-lg">
              {formatCurrency(product.price)}
            </span>
          </div>

          {/* Optional: Add rating if available */}
          {product && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(4)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300 fill-current"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              {/* {product.reviewCount && (
                <span className="text-gray-500 text-sm">
                  ({product.reviewCount})
                </span>
              )} */}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;

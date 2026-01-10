"use client";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/models/Product";
import { Eye, Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";

const ProductCard = ({ product }: { product: Product }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const getFirstImage = (imageUrl?: string) => {
    if (!imageUrl) return "/blank.jpg";

    return imageUrl.startsWith("http")
      ? imageUrl
      : `https://localhost:7041${imageUrl}`;
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="group relative bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col"
    >
      <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button
            // onClick={handleFavoriteClick}
            className={`bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors ${
              isFavorite ? "text-red-500" : "text-gray-600"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(`/product/${product.id}`, "_self");
            }}
            className="bg-white p-2 rounded-full shadow-md hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
        <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
          <Image
            src={getFirstImage(product.imageUrl)}
            alt={product.productName}
            unoptimized
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-500 p-4"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
      <button
        // onClick={(e) => {
        //   e.preventDefault();
        //   e.stopPropagation();
        //   onAddToCart(product.id);
        // }}
        className="hidden group-hover:flex w-full bg-black text-white py-3 px-4 items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
      >
        <ShoppingCart className="w-4 h-4" />
        Add To Cart
      </button>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <h3 className="font-medium text-gray-900 text-base mb-2 line-clamp-2">
          {product.productName}
        </h3>

        <div className="flex items-center gap-3 mt-2">
          <span className="text-red-500 font-semibold text-lg">
            {product.price} VND
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

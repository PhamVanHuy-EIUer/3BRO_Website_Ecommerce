"use client";
import React from "react";
import ProductCard from "./ProductsCard";
import { Product } from "@/models/Product";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Carousel } from "antd";
import Link from "next/link";

function RecommendProduct({ products }: { products: Product[] }) {
  const bestSellingCarouselRef = React.useRef<any>(null);
  return (
    <div>
      <div className="py-12 bg-transparent">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1 h-8 bg-red-500 rounded-full"></div>
                <span className="text-red-500 font-semibold">
                  Best Products
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900">Just For You</h2>
            </div>

            {/* Navigation Arrows */}
            <div className="flex gap-2">
              <button
                onClick={() => bestSellingCarouselRef.current?.prev()}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => bestSellingCarouselRef.current?.next()}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Products Carousel */}
          <div className="mb-12">
            <Carousel
              ref={bestSellingCarouselRef}
              dots={false}
              infinite={false}
              slidesToShow={4}
              slidesToScroll={1}
              responsive={[
                {
                  breakpoint: 1280,
                  settings: {
                    slidesToShow: 4,
                  },
                },
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 3,
                  },
                },
                {
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 2,
                  },
                },
                {
                  breakpoint: 640,
                  settings: {
                    slidesToShow: 1,
                  },
                },
              ]}
            >
              {products.map((product) => (
                <div key={product.id} className="px-2">
                  <ProductCard product={product} />
                </div>
              ))}
            </Carousel>
          </div>

          {/* View All Button */}
          <div className="flex justify-center">
            <Link href="/product/best-product">
              <button className="bg-red-500 text-white px-10 py-2 rounded hover:bg-red-600 transition-colors font-medium">
                View All
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecommendProduct;

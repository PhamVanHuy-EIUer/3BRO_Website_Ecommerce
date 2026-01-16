"use client";

import PageLoading from "@/components/Loading";
import { banners, categories } from "@/data/data";
import { Card, Carousel } from "antd";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { productService } from "@/services/product.service";
import { Product } from "@/models/Product";
import ProductCard from "@/components/products/ProductsCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Category } from "@/models/Category";
import { categoryService } from "@/services/category.service";

const HomePage = () => {
  const [loading, setLoading] = useState(true);

  // Tạo ref riêng cho mỗi carousel
  const categoryCarouselRef = useRef<any>(null);
  const bestSellingCarouselRef = useRef<any>(null);
  const productsCarouselRef = useRef<any>(null);

  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category[]>([]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getCategories();
      if (Array.isArray(data.list)) {
        setCategory(data.list);
      }
    } catch (error) {
      console.log(error);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };
  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts(1, 16);

      if (Array.isArray(data.list)) {
        setProducts(data.list);
      }
    } catch {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const loadTopProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.topProduct(1, 12);
      if (Array.isArray(data.list)) {
        setTopProducts(data.list);
      }
    } catch (error) {
      console.log(error);
      setError("Failed to load top products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    loadTopProducts();
    loadCategories();
  }, []);

  if (loading) return <PageLoading />;

  const getFirstImage = (imageUrl?: string) => {
    if (!imageUrl) return "/blank.jpg";
    return `https://localhost:7041${imageUrl}`;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex gap-8 py-10 ">
        {/* Products available */}
        <div className="w-64 shrink-0">
          <nav className="space-y-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 cursor-pointer hover:text-red-500"
              >
                <span className="text-sm">{category.name}</span>
                {category.hasSubmenu && <span>›</span>}
              </div>
            ))}
          </nav>
        </div>

        {/* Banner */}
        <div className="flex-1 min-w-0">
          <Carousel autoplay arrows>
            {banners.map((img) => (
              <div key={img.id}>
                <div className="relative h-90 w-full">
                  <Image
                    src={img.src}
                    alt=""
                    fill
                    priority
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>

      {/* Category */}
      <div className="py-10 items-center gap-6">
        <div className="flex justify-between items-center py-2">
          <div className="flex flex-row items-center gap-6">
            <div className="bg-red-500 w-5 h-10 rounded-md"></div>
            <div className="font-semibold text-red-500">Categories</div>
          </div>
          <div>
            <div className="flex gap-2">
              <button
                onClick={() => categoryCarouselRef.current?.prev()}
                className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-100"
              >
                <LeftOutlined />
              </button>

              <button
                onClick={() => categoryCarouselRef.current?.next()}
                className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-100"
              >
                <RightOutlined />
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="font-bold text-3xl text-neutral-950">
            Browse By Category
          </h2>
        </div>
        <div className="max-w-7xl mx-auto py-10">
          {/* Slider */}
          <Carousel
            ref={categoryCarouselRef}
            dots={false}
            slidesToShow={6}
            responsive={[
              { breakpoint: 1024, settings: { slidesToShow: 4 } },
              { breakpoint: 768, settings: { slidesToShow: 2 } },
            ]}
          >
            {category.map((item) => (
              <div key={item.id} className="px-2">
                <Link href={`/category/${item.id}`}>
                  <Card
                    hoverable
                    className="flex flex-col items-center justify-center text-center py-6"
                  >
                    <div className="text-3xl mb-8">
                      <Image
                        src={getFirstImage(item.imageUrl)}
                        alt=""
                        unoptimized
                        height={100}
                        width={100}
                        className="h-18 w-18 rounded-full"
                      />
                    </div>
                    <p className="font-medium">{item.categoryName}</p>
                  </Card>
                </Link>
              </div>
            ))}
          </Carousel>
        </div>
      </div>

      {/* Best Selling */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-5 h-10 bg-red-500 rounded"></div>
                <span className="text-red-500 font-semibold text-base">
                  This Month
                </span>
              </div>
              <h2 className="font-bold text-3xl text-neutral-950">
                Best Selling Products
              </h2>
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
            <Link href="/product">
              <button className="bg-red-500 text-white px-10 py-2 rounded hover:bg-red-600 transition-colors font-medium">
                View All
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Our Products */}
      <div className="py-10">
        {/* Title */}
        <div className="container mx-auto flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-5 h-10 bg-red-500 rounded"></div>
              <span className="text-red-500 font-semibold text-base">
                Our Products
              </span>
            </div>

            <h2 className="font-bold text-3xl text-neutral-950">
              Explore Our Products
            </h2>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => productsCarouselRef.current?.prev()}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
            >
              <LeftOutlined />
            </button>

            <button
              onClick={() => productsCarouselRef.current?.next()}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
            >
              <RightOutlined />
            </button>
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="container mx-auto mb-12">
          <Carousel
            ref={productsCarouselRef}
            dots={false}
            rows={2}
            slidesPerRow={4}
            responsive={[
              {
                breakpoint: 1024,
                settings: { rows: 2, slidesPerRow: 3 },
              },
              {
                breakpoint: 768,
                settings: { rows: 2, slidesPerRow: 2 },
              },
            ]}
          >
            {products.map((product) => (
              <div key={product.id} className="p-2">
                <ProductCard product={product} />
              </div>
            ))}
          </Carousel>
        </div>

        {/* View All Products Button */}
        <div className="container mx-auto flex justify-center">
          <Link href="/product">
            <button className="bg-red-500 text-white px-10 py-2 rounded hover:bg-red-600 font-medium">
              View All Products
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

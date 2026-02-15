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
import { useRouter } from "next/navigation";
import { CiDeliveryTruck } from "react-icons/ci";
import { CustomerServiceOutlined } from "@ant-design/icons";
import { RiRefund2Fill } from "react-icons/ri";

import ChatBox from "@/components/home/ChatBox";

const HomePage = () => {
  const [loading, setLoading] = useState(true);

  // Tạo ref riêng cho mỗi carousel
  const categoryCarouselRef = useRef<any>(null);
  const bestSellingCarouselRef = useRef<any>(null);
  const productsCarouselRef = useRef<any>(null);
  const router = useRouter();
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
    <div className="bg-[linear-gradient(135deg,#f5f7fa_0%,#fef5e7_100%)]">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-8">
            {/* Sidebar Categories */}
            <div className="w-64 shrink-0 bg-white rounded-xl shadow-sm p-4 h-fit">
              <nav className="space-y-2">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 px-3 cursor-pointer hover:bg-red-50 hover:text-red-500 rounded-lg transition-all duration-200 group"
                  >
                    <span className="text-sm font-medium">{category.name}</span>
                    {category.hasSubmenu && (
                      <ChevronRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Banner Carousel */}
            <div className="flex-1 min-w-0">
              <Carousel
                autoplay
                arrows
                className="rounded-xl overflow-hidden shadow-lg"
              >
                {banners.map((img) => (
                  <div key={img.id}>
                    <div className="relative h-96 w-full">
                      <Image
                        src={img.src}
                        alt=""
                        className="w-full h-full object-cover"
                        fill
                      />
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1 h-8 bg-red-500 rounded-full"></div>
                <span className="text-red-500 font-semibold">Categories</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900">
                Browse By Category
              </h2>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => categoryCarouselRef.current?.prev()}
                className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 border border-gray-200"
              >
                <LeftOutlined />
              </button>
              <button
                onClick={() => categoryCarouselRef.current?.next()}
                className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 border border-gray-200"
              >
                <RightOutlined />
              </button>
            </div>
          </div>

          <Carousel
            ref={categoryCarouselRef}
            dots={false}
            slidesToShow={6}
            responsive={[
              { breakpoint: 1024, settings: { slidesToShow: 4 } },
              { breakpoint: 768, settings: { slidesToShow: 3 } },
              { breakpoint: 640, settings: { slidesToShow: 2 } },
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

        {/* Best Selling */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-1 h-8 bg-red-500 rounded-full"></div>
                  <span className="text-red-500 font-semibold">This Month</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900">
                  Best Selling Products
                </h2>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => bestSellingCarouselRef.current?.prev()}
                  className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => bestSellingCarouselRef.current?.next()}
                  className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="mb-8">
              <Carousel
                ref={bestSellingCarouselRef}
                dots={false}
                infinite={false}
                slidesToShow={4}
                responsive={[
                  { breakpoint: 1280, settings: { slidesToShow: 4 } },
                  { breakpoint: 1024, settings: { slidesToShow: 3 } },
                  { breakpoint: 768, settings: { slidesToShow: 2 } },
                  { breakpoint: 640, settings: { slidesToShow: 1 } },
                ]}
              >
                {topProducts.map((product) => (
                  <div key={product.id} className="px-2">
                    <ProductCard product={product} />
                  </div>
                ))}
              </Carousel>
            </div>

            <div className="flex justify-center">
              <button
                className="bg-red-500 text-white px-12 py-3 rounded-full hover:bg-red-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                onClick={() => {
                  router.push("/product");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                View All Products
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="relative bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-20">
              <Image
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop"
                alt=""
                className="w-full h-full object-cover"
                width={1200}
                height={400}
              />
            </div>
            <div className="relative px-12 py-16 text-white">
              <div className="max-w-2xl">
                <h2 className="text-5xl font-bold mb-4">
                  Enhance Your Music Experience
                </h2>
                <p className="text-xl mb-8 text-gray-300">
                  Premium sound quality at affordable prices
                </p>
                <button className="bg-red-500 text-white px-10 py-4 rounded-full font-semibold hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-xl">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Our Products */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1 h-8 bg-red-500 rounded-full"></div>
                <span className="text-red-500 font-semibold">Our Products</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900">
                Explore Our Products
              </h2>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => productsCarouselRef.current?.prev()}
                className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 border border-gray-200"
              >
                <LeftOutlined />
              </button>
              <button
                onClick={() => productsCarouselRef.current?.next()}
                className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 border border-gray-200"
              >
                <RightOutlined />
              </button>
            </div>
          </div>

          <div className="mb-8">
            <Carousel
              ref={productsCarouselRef}
              dots={false}
              rows={2}
              slidesPerRow={4}
              responsive={[
                { breakpoint: 1024, settings: { rows: 2, slidesPerRow: 3 } },
                { breakpoint: 768, settings: { rows: 2, slidesPerRow: 2 } },
                { breakpoint: 640, settings: { rows: 2, slidesPerRow: 1 } },
              ]}
            >
              {products.map((product, index) => (
                <div key={`${product.id}-${index}`} className="p-2">
                  <ProductCard product={product} />
                </div>
              ))}
            </Carousel>
          </div>

          <div className="flex justify-center">
            <button
              className="bg-red-500 text-white px-12 py-3 rounded-full hover:bg-red-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
              onClick={() => {
                router.push("/product");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              View All Products
            </button>
          </div>
        </div>
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 border-8 border-gray-300">
                  <CiDeliveryTruck style={{ fontSize: "40px" }} />
                </div>
                <h3 className="font-bold text-xl mb-2">FAST DELIVERY</h3>
                <p className="text-gray-600">
                  Delivery in 3 - 5 days for national orders
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 border-8 border-gray-300">
                  <CustomerServiceOutlined style={{ fontSize: "40px" }} />
                </div>
                <h3 className="font-bold text-xl mb-2">
                  24/7 CUSTOMER SERVICE
                </h3>
                <p className="text-gray-600">Friendly 24/7 customer support</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 border-8 border-gray-300">
                  <RiRefund2Fill style={{ fontSize: "40px" }} />
                </div>
                <h3 className="font-bold text-xl mb-2">MONEY BACK GUARANTEE</h3>
                <p className="text-gray-600">We return money within 30 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChatBox />
    </div>
  );
};

export default HomePage;

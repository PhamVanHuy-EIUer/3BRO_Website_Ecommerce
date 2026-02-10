"use client";

import { use, useEffect, useState } from "react";
import { Pagination, Spin } from "antd";
import { productService } from "@/services/product.service";
import { Product } from "@/models/Product";
import ProductCard from "@/components/products/ProductsCard";
import RecommendProduct from "@/components/products/RecommendProduct";
import { categoryService } from "@/services/category.service";
import { ApiResponse } from "@/models/ApiResponse";
import { Category } from "@/models/Category";
import LoadingUser from "@/components/LoadingUser";
import { ChevronDown, ChevronUp, Grid, ArrowUpDown } from "lucide-react";
import { usePathname } from "next/navigation";

const PAGE_SIZE = 16;

const Products = () => {
  type ViewMode = "ALL" | "CATEGORY" | "ASC" | "DESC";

  const [viewMode, setViewMode] = useState<ViewMode>("ALL");
  const pathname = usePathname();
  const [loadPageProducts, setLoadPageProducts] = useState(false);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category[]>([]);
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(
    null,
  );
  const [showCategory, setShowCategory] = useState(true);
  const [showSort, setShowSort] = useState(true);

  const handleToogleCategory = () => {
    setShowCategory(!showCategory);
  };

  const handleToggleSort = () => {
    setShowSort(!showSort);
  };

  const loadProducts = async (currentPage: number) => {
    try {
      setLoading(true);
      const res = await productService.getProducts(currentPage, PAGE_SIZE);

      setProducts(res.list ?? []);
      setTotal(res.totalElement ?? 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadTopProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.topProduct(1, 8);
      if (Array.isArray(data.list)) {
        setTopProducts(data.list);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const loadAscendingProducts = async (currentPage: number) => {
    try {
      setLoadPageProducts(true);
      const data = await productService.productOrderAscend(
        currentPage,
        PAGE_SIZE,
      );
      if (Array.isArray(data.list)) {
        setProducts(data.list);
        setTotal(data.totalElement);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadPageProducts(false);
    }
  };

  const loadDescendingProducts = async (currentPage: number) => {
    try {
      setLoadPageProducts(true);
      const data = await productService.productOrderDescend(
        currentPage,
        PAGE_SIZE,
      );
      if (Array.isArray(data.list)) {
        setProducts(data.list);
        setTotal(data.totalElement);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadPageProducts(false);
    }
  };

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data: ApiResponse<Category> = await categoryService.getCategories();
      if (data.isSuccess && data.code === "200") {
        setCategory(data.list);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const loadingProductByCategory = async (id: string, currentPage: number) => {
    try {
      setLoadPageProducts(true);
      const data = await productService.getProductsByCategory(
        id,
        currentPage,
        PAGE_SIZE,
      );
      if (Array.isArray(data.list)) {
        setProducts(data.list);
        setTotal(data.totalElement);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadPageProducts(false);
    }
  };

  useEffect(() => {
    switch (viewMode) {
      case "CATEGORY":
        if (currentCategoryId) {
          loadingProductByCategory(currentCategoryId, page);
        }
        break;

      case "ASC":
        loadAscendingProducts(page);
        break;

      case "DESC":
        loadDescendingProducts(page);
        break;

      default:
        loadProducts(page);
    }

    loadTopProducts();
  }, [page, viewMode, currentCategoryId]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    setShowCategory(false);
    setShowSort(false);
  }, [pathname]);
  return (
    <div>
      {loading ? (
        <LoadingUser />
      ) : (
        <div className="flex max-w-7xl flex-row mx-auto py-6 gap-6">
          {/* LEFT SIDEBAR - WITH SMOOTH TRANSITIONS */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
              {/* Categories Section */}
              <div className="border-b border-gray-100">
                <button
                  onClick={handleToogleCategory}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <Grid className="w-5 h-5 text-gray-600" />
                    <h2 className="text-lg font-semibold text-gray-800">
                      Categories
                    </h2>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                      showCategory ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    showCategory
                      ? "max-h-[600px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => {
                        setPage(1);
                        setViewMode("ALL");
                        setCurrentCategoryId(null);
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 mb-1 ${
                        viewMode === "ALL" && !currentCategoryId
                          ? "bg-blue-50 text-blue-600 font-medium shadow-sm"
                          : "text-gray-700 hover:bg-gray-50 hover:translate-x-1"
                      }`}
                    >
                      All Products
                    </button>

                    {category.map((item, index) => (
                      <button
                        key={item.id}
                        style={{
                          transitionDelay: showCategory
                            ? `${index * 30}ms`
                            : "0ms",
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 mb-1 ${
                          currentCategoryId === item.id
                            ? "bg-blue-50 text-blue-600 font-medium shadow-sm"
                            : "text-gray-700 hover:bg-gray-50 hover:translate-x-1"
                        }`}
                        onClick={() => {
                          setPage(1);
                          setViewMode("CATEGORY");
                          setCurrentCategoryId(item.id);
                          loadingProductByCategory(item.id, page);
                        }}
                      >
                        {item.categoryName
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1),
                          )
                          .join(" ")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sort Section */}
              <div>
                <button
                  onClick={handleToggleSort}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <ArrowUpDown className="w-5 h-5 text-gray-600" />
                    <h2 className="text-lg font-semibold text-gray-800">
                      Sort By
                    </h2>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                      showSort ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    showSort ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-4 pb-4">
                    <button
                      style={{
                        transitionDelay: showSort ? "0ms" : "0ms",
                      }}
                      onClick={() => {
                        setPage(1);
                        setViewMode("ASC");
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 mb-1 ${
                        viewMode === "ASC"
                          ? "bg-blue-50 text-blue-600 font-medium shadow-sm"
                          : "text-gray-700 hover:bg-gray-50 hover:translate-x-1"
                      }`}
                    >
                      Price: Low to High
                    </button>
                    <button
                      style={{
                        transitionDelay: showSort ? "30ms" : "0ms",
                      }}
                      onClick={() => {
                        setPage(1);
                        setViewMode("DESC");
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 ${
                        viewMode === "DESC"
                          ? "bg-blue-50 text-blue-600 font-medium shadow-sm"
                          : "text-gray-700 hover:bg-gray-50 hover:translate-x-1"
                      }`}
                    >
                      Price: High to Low
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT AREA */}
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Products{" "}
                <span className="text-gray-400 font-normal">({total})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>

            <div className="flex justify-center mt-10">
              <Pagination
                current={page}
                pageSize={PAGE_SIZE}
                total={total}
                onChange={setPage}
                showSizeChanger={false}
              />
            </div>

            <RecommendProduct products={topProducts} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;

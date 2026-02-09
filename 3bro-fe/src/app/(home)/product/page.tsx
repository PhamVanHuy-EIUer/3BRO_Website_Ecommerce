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
import { p, s } from "framer-motion/client";

const PAGE_SIZE = 12;

const Products = () => {
  type ViewMode = "ALL" | "CATEGORY" | "ASC" | "DESC";
  const [viewMode, setViewMode] = useState<ViewMode>("ALL");
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category[]>([]);
  const [currentCategoryId, setCurretCategoryId] = useState<string | null>(
    null,
  );
  const [showCategory, setShowCategory] = useState(false);

  const handleToogleCategory = () => {
    setShowCategory(!showCategory);
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
      // setError("Failed to load top products");
    } finally {
      setLoading(false);
    }
  };

  const loadAscendingProducts = async (currentPage: number) => {
    try {
      setLoading(true);
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
      // setError("Failed to load top products");
    } finally {
      setLoading(false);
    }
  };

  const loadDescendingProducts = async (currentPage: number) => {
    try {
      setLoading(true);
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
      // setError("Failed to load top products");
    } finally {
      setLoading(false);
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
      // setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const loadingProductByCategory = async (id: string, currentPage: number) => {
    try {
      setLoading(true);
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
      setLoading(false);
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
  return (
    <div>
      {loading ? (
        <LoadingUser />
      ) : (
        <div className="flex max-w-7xl flex-row mx-auto py-6 gap-3">
          <div className="flex-2/6 text-left w-full">
            <div>
              <h2
                className="text-xl font-light mb-6 capitalize cursor-pointer"
                onClick={handleToogleCategory}
              >
                Categories
              </h2>

              {showCategory && (
                <div className="flex flex-col gap-2 ">
                  <button
                    onClick={() => {
                      setPage(1);
                      setViewMode("ALL");
                      setCurretCategoryId(null);
                    }}
                  >
                    All
                  </button>
                  {category.map((item) => (
                    <button
                      key={item.id}
                      className="text-left "
                      onClick={() => {
                        setPage(1);
                        setViewMode("CATEGORY");
                        setCurretCategoryId(item.id);
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
              )}
            </div>
            <div>
              <h2 className="text-xl font-light mb-6 capitalize">Sort</h2>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setPage(1);
                    setViewMode("ASC");
                  }}
                >
                  Ascending
                </button>
                <button
                  onClick={() => {
                    setPage(1);
                    setViewMode("DESC");
                  }}
                >
                  Descending
                </button>
              </div>
            </div>
          </div>
          <div className="flex-4/6 w-full">
            <h2 className="text-xl font-light mb-6 capitalize">
              Products ({total})
            </h2>

            <div className="grid grid-cols-4 gap-6">
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

"use client";

import { useEffect, useState } from "react";
import { Pagination } from "antd";
import { productService } from "@/services/product.service";
import { Product } from "@/models/Product";
import ProductCard from "@/components/products/ProductsCard";
import RecommendProduct from "@/components/products/RecommendProduct";
import LoadingUser from "@/components/LoadingUser";
import { Grid, PackageX, Award } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const PAGE_SIZE = 16;

const BestProducts = () => {
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [recommendProducts, setRecommendProducts] = useState<Product[]>([]);

  const loadBestProducts = async (currentPage: number) => {
    try {
      setLoading(true);
      const res = await productService.topProduct(currentPage, PAGE_SIZE);

      if (res && res.list) {
        setProducts(res.list);
        setTotal(res.totalElement ?? 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendProducts = async () => {
    try {
      // For best products page, we can show another set or just some high-rated ones
      const data = await productService.getProducts(1, 8);
      if (Array.isArray(data.list)) {
        setRecommendProducts(data.list);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadBestProducts(page);
  }, [page]);

  useEffect(() => {
    loadRecommendProducts();
  }, []);

  return (
    <div>
      {loading ? (
        <LoadingUser />
      ) : (
        <div className="bg-[linear-gradient(135deg,#f5f7fa_0%,#fef5e7_100%)] min-h-screen">
          <div className="flex max-w-7xl flex-col mx-auto py-10 px-4 gap-8">
            {/* Header Section */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 p-4 rounded-xl">
                  <Award className="w-8 h-8 text-yellow-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Best Products
                  </h1>
                  <p className="text-gray-500 mt-1">
                    Most popular and highest rated items
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-full border border-gray-100">
                <Grid className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600 font-medium">
                  {total} Products Found
                </span>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-w-0">
              {products.length ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`best-products-${page}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {products.map((item) => (
                        <ProductCard key={item.id} product={item} />
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="empty-state w-full flex flex-col items-center justify-center h-[50vh] bg-white rounded-2xl border border-dashed border-gray-200">
                  <PackageX
                    size={64}
                    strokeWidth={1.5}
                    className="text-gray-300"
                  />
                  <p className="text-gray-500 mt-4 text-lg">
                    No best products available at the moment.
                  </p>
                </div>
              )}

              <div className="flex justify-center mt-12 bg-white p-4 rounded-xl shadow-sm border border-gray-100 max-w-fit mx-auto">
                <Pagination
                  current={page}
                  pageSize={PAGE_SIZE}
                  total={total}
                  onChange={setPage}
                  showSizeChanger={false}
                />
              </div>

              <div className="mt-16">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-8 w-1.5 bg-blue-600 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    You May Also Like
                  </h2>
                </div>
                <RecommendProduct products={recommendProducts} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BestProducts;

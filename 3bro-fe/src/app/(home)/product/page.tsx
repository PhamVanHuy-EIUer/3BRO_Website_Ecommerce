"use client";

import { useEffect, useState } from "react";
import { Pagination, Spin } from "antd";
import { productService } from "@/services/product.service";
import { Product } from "@/models/Product";
import ProductCard from "@/components/products/ProductsCard";
import RecommendProduct from "@/components/products/RecommendProduct";

const PAGE_SIZE = 8;

const Products = () => {
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [topProducts, setTopProducts] = useState<Product[]>([]);

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

  useEffect(() => {
    loadProducts(page);
    loadTopProducts();
  }, [page]);

  return (
    <div>
      <div className="max-w-7xl mx-auto py-8">
        <h2 className="text-xl font-light mb-6 uppercase">
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

      {loading && (
        <div className="flex justify-center mt-4">
          <Spin />
        </div>
      )}
    </div>
  );
};

export default Products;

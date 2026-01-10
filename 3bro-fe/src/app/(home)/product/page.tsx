"use client";

import { useEffect, useState } from "react";
import { Pagination, Spin } from "antd";
import { productService } from "@/services/product.service";
import { Product } from "@/models/Product";
import ProductCard from "@/components/products/ProductsCard";

const PAGE_SIZE = 16;

const Products = () => {
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts(page);
  }, [page]);

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

  return (
    <div className="max-w-7xl mx-auto py-8">
      <h2 className="text-xl font-light mb-6">Products ({total})</h2>

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

      {loading && (
        <div className="flex justify-center mt-4">
          <Spin />
        </div>
      )}
    </div>
  );
};

export default Products;

"use client";

import PageLoading from "@/components/Loading";
import ProductCard from "@/components/products/ProductsCard";
import { Product } from "@/models/Product";
import { productService } from "@/services/product.service";
import { Pagination, Spin } from "antd";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const PAGE_SIZE = 8;

const CategoryPage = () => {
  const params = useParams();
  const category = params.category as string;

  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [nameCategory, setNameCategory] = useState<string | null>(null);
  const loadProducts = async (currentPage: number) => {
    try {
      setLoading(true);
      const res = await productService.getProductsByCategory(
        category,
        currentPage,
        PAGE_SIZE,
      );
      setProducts(res.list ?? []);
      setTotal(res.totalElement ?? 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (category) {
      loadProducts(page);
    }
  }, [page, category]);

  return (
    <div className="max-w-7xl mx-auto py-8">
      {loading && (
        <div className="flex justify-center mt-4">
          <PageLoading />
        </div>
      )}

      <h2 className="text-xl font-light mb-6 uppercase">
        {products.at(0)?.categoryName} / Products ({total})
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
    </div>
  );
};

export default CategoryPage;

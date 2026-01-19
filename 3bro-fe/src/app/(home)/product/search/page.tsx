"use client";

import { useEffect, useState } from "react";
import { Pagination, Spin } from "antd";
import { productService } from "@/services/product.service";
import { Product } from "@/models/Product";
import ProductCard from "@/components/products/ProductsCard";
import RecommendProduct from "@/components/products/RecommendProduct";
import { useSearchParams } from "next/navigation";

const PAGE_SIZE = 12;
const SearchProduct = () => {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const [page, setPage] = useState(1);

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [topProducts, setTopProducts] = useState<Product[]>([]);

  const loadProducts = async () => {
    if (!keyword) return;

    try {
      setLoading(true);
      const res = await productService.searchProduct(keyword, page, PAGE_SIZE);
      setProducts(res.list ?? []);
      setTotal(res.list?.length ?? 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadTopProducts = async () => {
    try {
      const data = await productService.topProduct(1, 8);
      setTopProducts(data.list ?? []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadProducts();
    loadTopProducts();
  }, [keyword]);

  return (
    <div className="max-w-7xl mx-auto py-8">
      <h2 className="text-xl font-light mb-6 uppercase">Products ({total})</h2>

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
  );
};

export default SearchProduct;

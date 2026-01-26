"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import ProductGallery from "@/components/products/ProductGalery";
import RecommendProduct from "@/components/products/RecommendProduct";
import NotFound from "@/components/NotFound";

import { productService } from "@/services/product.service";
import { Product } from "@/models/Product";
import { ApiResponse } from "@/models/ApiResponse";
import { ProductImage } from "@/models/ProductImage";

const SingleProduct = () => {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageProduct, setImageProduct] = useState<ProductImage[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

  // Fetch product
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await productService.getProductById(id);

        if (res?.isSuccess && res.object) {
          setProduct(res.object);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error(error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchImages = async () => {
      try {
        const res: ApiResponse<ProductImage> =
          await productService.getImageProduct(id);
        if (res?.isSuccess && res.list) {
          setImageProduct(res.list);
        } else {
          setImageProduct([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecommendedProducts = async () => {
      try {
        const res = await productService.getProducts(1, 4);
        if (res?.isSuccess && res.list) {
          setRecommendedProducts(res.list);
        } else {
          setRecommendedProducts([]);
        }
      } catch (error) {
        console.error(error);
        setRecommendedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    fetchImages();
    fetchRecommendedProducts();
  }, [id]);

  if (loading) return <div className="py-20 text-center">Loading...</div>;
  if (!product) return <NotFound />;

  return (
    <div className="w-[90vw] mx-auto py-10">
      <ProductGallery product={product} imageProduct={imageProduct} />

      <div className="mt-16">
        <RecommendProduct products={recommendedProducts} />
      </div>
    </div>
  );
};

export default SingleProduct;

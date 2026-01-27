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
import ReviewPage from "@/components/reviews/ReviewPage";
import { Review } from "@/models/Review";
import { reviewService } from "@/services/review.service";
import { notification } from "antd";

const SingleProduct = () => {
  const PAGE_SIZE = 4;
  const CURRENT_PAGE = 1;
  const { id } = useParams<{ id: string }>();
  const [api, contextHolder] = notification.useNotification();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageProduct, setImageProduct] = useState<ProductImage[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [productReview, setProductReview] = useState<Review[]>([]);
  const [totalPage, setTotalPage] = useState(1);
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
        api.error({
          title: "Error fetch image",
          placement: "topRight",
          duration: 2,
        });
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
        api.error({
          title: "Error fetch recommend product",
          placement: "topRight",
          duration: 2,
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchReview = async () => {
      try {
        const res: ApiResponse<Review> =
          await reviewService.getReviewByProductId(id, CURRENT_PAGE, PAGE_SIZE);
        if (res?.isSuccess && res.list) {
          setProductReview(res.list);
          setTotalPage(res.totalPage);
        } else {
          setProductReview([]);
          api.error({
            title: "Error fetch review",
            placement: "topRight",
            duration: 2,
          });
        }
      } catch (error) {
        console.error(error);
        setProductReview([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    fetchImages();
    fetchReview();
    fetchRecommendedProducts();
  }, [id]);

  if (loading) return <div className="py-20 text-center">Loading...</div>;
  if (!product) return <NotFound />;

  return (
    <div className="w-[90vw] mx-auto py-10">
      <ProductGallery product={product} imageProduct={imageProduct} />

      <div className="mt-16">
        <ReviewPage
          data={productReview}
          allReview={totalPage > 1}
          productID={id}
          reviewCount={totalPage}
        />
      </div>
      <div className="mt-16">
        <RecommendProduct products={recommendedProducts} />
      </div>
    </div>
  );
};

export default SingleProduct;

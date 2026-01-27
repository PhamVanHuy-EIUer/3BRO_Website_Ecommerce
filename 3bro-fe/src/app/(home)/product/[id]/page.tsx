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
  const { id } = useParams<{ id: string }>();
  const [api, contextHolder] = notification.useNotification();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageProduct, setImageProduct] = useState<ProductImage[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [productReview, setProductReview] = useState<Review[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

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
          message: "Error fetch image",
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
          message: "Error fetch recommend product",
          placement: "topRight",
          duration: 2,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    fetchImages();
    fetchRecommendedProducts();
  }, [id]);

  // Fetch reviews when page changes
  useEffect(() => {
    if (!id) return;

    const fetchReview = async () => {
      setLoading(true);
      try {
        const res: ApiResponse<Review> =
          await reviewService.getReviewByProductId(id, currentPage, PAGE_SIZE);
        if (res?.isSuccess && res.list) {
          setProductReview(res.list);
          setTotalPage(res.totalPage);
          setReviewCount(res.totalPage);
        } else {
          setProductReview([]);
          api.error({
            message: "Error fetch review",
            placement: "topRight",
            duration: 2,
          });
        }
      } catch (error) {
        console.error(error);
        setProductReview([]);
        api.error({
          message: "Error fetch review",
          placement: "topRight",
          duration: 2,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [id, currentPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPage) {
      setCurrentPage(page);
      // Scroll to review section
      const reviewSection = document.getElementById("review-section");
      if (reviewSection) {
        reviewSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  if (loading && !product)
    return <div className="py-20 text-center">Loading...</div>;
  if (!product) return <NotFound />;

  return (
    <div className="w-[90vw] mx-auto py-10">
      {contextHolder}
      <ProductGallery product={product} imageProduct={imageProduct} />

      <div id="review-section" className="mt-16">
        <ReviewPage
          data={productReview}
          productID={id}
          reviewCount={reviewCount}
          currentPage={currentPage}
          totalPages={totalPage}
          onPageChange={handlePageChange}
        />
      </div>
      <div className="mt-16">
        <RecommendProduct products={recommendedProducts} />
      </div>
    </div>
  );
};

export default SingleProduct;

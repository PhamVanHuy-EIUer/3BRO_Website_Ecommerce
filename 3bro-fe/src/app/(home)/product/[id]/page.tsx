import {
  getImageProduct,
  getProductByCategory,
  getProductById,
  topProduct,
} from "@/app/api/product/ProductApi";
import ProductGallery from "@/components/products/ProductGalery";
import { Product } from "@/models/Product";
import { ProductImage } from "@/models/ProductImage";
import NotFound from "@/components/NotFound";
import RecommendProduct from "@/components/products/RecommendProduct";

const SingleProduct = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const product: Product | null = await getProductById(id);
  const imageProduct: ProductImage[] | [] = await getImageProduct(id);
  if (!product) {
    return <NotFound />;
  }
  const recommendProducts = await topProduct(1, 12);

  //   if (!res || !res.isSuccess) return notFound();

  console.log(product);
  return (
    <div className="w-[90vw] mx-auto">
      <div>
        <ProductGallery product={product} imageProduct={imageProduct} />
        <RecommendProduct products={recommendProducts.list} />
      </div>
    </div>
  );
};

export default SingleProduct;

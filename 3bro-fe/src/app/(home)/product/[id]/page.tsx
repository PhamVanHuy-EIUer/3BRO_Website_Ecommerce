import { getImageProduct, getProductById } from "@/app/api/product/product";
import ProductGallery from "@/components/products/ProductGalery";
import { Product } from "@/models/Product";
import { ProductImage } from "@/models/ProductImage";

const SingleProduct = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const product: Product | null = await getProductById(id);
  const imageProduct: ProductImage[] | [] = await getImageProduct(id);

  //   if (!res || !res.isSuccess) return notFound();

  console.log(product);
  return (
    <div className="w-[90vw] mx-auto">
      {product !== null ? (
        <div>
          <ProductGallery product={product} imageProduct={imageProduct} />
        </div>
      ) : (
        <div>Not Ok</div>
      )}
    </div>
  );
};

export default SingleProduct;

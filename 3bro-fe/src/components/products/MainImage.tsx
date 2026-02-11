import { Product } from "@/models/Product";
import { Image } from "antd";
import { ZoomInOutlined } from "@ant-design/icons";

type Props = {
  product: Product;
  active: string;
};
const MainImage = ({ product, active }: Props) => {
  return (
    <div className="flex-1 bg-linear-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
      <Image
        src={active}
        alt={product.productName}
        className="w-full h-full object-cover !bg-transparent"
        preview={{
          cover: (
            <div className="flex items-center justify-center text-white text-xl">
              <ZoomInOutlined />
            </div>
          ),
        }}
        width={500}
        height={650}
      />
    </div>
  );
};

export default MainImage;

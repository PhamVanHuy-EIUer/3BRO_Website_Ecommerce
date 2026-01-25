import { Product } from "@/models/Product";
import { productService } from "@/services/product.service";
import { useEffect, useState } from "react";


export const useSearchProduct = (searchValue: string, PAGE_SIZE: number) => {
    // const PAGE_SIZE = 3;
    const [products, setProducts] = useState<Product[]>([]);
    const page = 1;
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const res = await productService.searchProduct(searchValue, page, PAGE_SIZE);
            setProducts(res.list ?? []);
            setTotal(res.totalElement ?? 0);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, [searchValue]);

    return { products, total };
}


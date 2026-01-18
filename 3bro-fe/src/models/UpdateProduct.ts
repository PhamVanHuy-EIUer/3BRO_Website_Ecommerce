export interface UpdateProduct {
    id: string;
    productName: string;
    description?: string;
    price: number;
    stock: number;
    categoryId: string;
    imageUrl: string;
}
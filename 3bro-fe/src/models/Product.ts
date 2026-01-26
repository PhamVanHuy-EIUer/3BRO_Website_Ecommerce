export interface Product {
    id: string;
    productName: string;
    description?: string;
    price: number;
    stock: number;
    imageUrl: string;
    categoryId?: string;
    categoryName: string;
    status?: number;
    createdDate?: string;
    updatedDate?: string;
    rating?: number;
}
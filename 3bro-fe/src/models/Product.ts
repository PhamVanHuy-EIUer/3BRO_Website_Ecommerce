export interface Product {
    id: string;
    productName: string;
    description?: string;
    price: number;
    stock: number;
    imageUrl: string;
    categoryId?: string;
    categoryName: string;
    status?: string;
    createdDate?: string;
    updatedDate?: string;
}
export interface User {
    id: string;          // Guid -> string
    fullName?: string;
    email: string;
    phone?: string;
    address?: string;
    isActive: boolean;
    createdDate?: string; // ISO string
    roles?: string[];     // từ JWT hoặc API riêng
}

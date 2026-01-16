export interface User {
    id: string;          // Guid -> string
    fullName?: string;
    email: string;
    phone?: string;
    address?: string;
    isActive: boolean;
    createdDate?: string; // ISO string
    roleList?: string[];     // từ JWT hoặc API riêng
}

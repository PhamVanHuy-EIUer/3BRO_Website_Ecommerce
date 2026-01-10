export type ApiResponse<T> = {
    list: T[] | [];                           // IEnumerable<T>?
    object: T | null;                           // T?
    code: string;
    message: string;
    error: Record<string, string[]> | null;     // Dictionary<string, string[]>?
    isSuccess: boolean;
    string: string | null;
    int: number | null;
    currentPage: number;
    pageSize: number;
    totalPage: number;
    totalElement: number;
};
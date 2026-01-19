import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Các route cần bảo vệ và role tương ứng
const protectedRoutes = [
    { path: "/admin", roles: ["Admin"] },
    { path: "/home", roles: ["User", "Admin"] },
];

export function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    // Lấy token từ HttpOnly cookie
    const token = req.cookies.get("access_token")?.value;

    // Lấy role từ cookie (không HttpOnly, để middleware đọc được)
    const rolesCookie = req.cookies.get("role")?.value;
    const roleList = rolesCookie
        ? rolesCookie.split(",").map((r) => r.trim().toLowerCase())
        : [];

    // Loop qua các route cần bảo vệ
    for (const route of protectedRoutes) {
        if (pathname.startsWith(route.path)) {
            // Nếu không có token → redirect login
            if (!token) {
                return NextResponse.redirect(new URL("/login", req.url));
            }

            // Kiểm tra role
            const routeRolesLower = route.roles.map((r) => r.toLowerCase());
            const hasAccess = routeRolesLower.some((r) => roleList.includes(r));

            if (!hasAccess) {
                return NextResponse.redirect(new URL("/404", req.url));
            }
        }
    }

    // Nếu không phải route bảo vệ hoặc đủ quyền → cho qua
    return NextResponse.next();
}

// Matcher cho các route cần middleware
export const config = {
    matcher: ["/admin", "/admin/:path*", "/user", "/user/:path*"],
};

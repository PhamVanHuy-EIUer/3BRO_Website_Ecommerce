import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
    { path: "/admin", roles: ["Admin"] },
    { path: "/home", roles: ["User", "Admin"] },
];

export function middleware(req: NextRequest) {
    const token = req.cookies.get("access_token")?.value;
    const rolesCookie = req.cookies.get("role")?.value;

    const roleList = rolesCookie ? rolesCookie.split(",") : [];
    const pathname = req.nextUrl.pathname;

    for (const route of protectedRoutes) {
        if (pathname.startsWith(route.path)) {

            if (!token) {
                return NextResponse.redirect(new URL("/login", req.url));
            }

            const hasAccess = route.roles.some(r => roleList.includes(r));
            if (!hasAccess) {
                return NextResponse.redirect(new URL("/", req.url));

            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/user/:path*"],
};

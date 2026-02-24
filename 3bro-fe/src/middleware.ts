import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
    { path: "/admin", roles: ["admin"] },
    { path: "/user", roles: ["user", "admin"] },
];

export function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    const refreshToken = req.cookies.get("refresh_token")?.value;

    const rolesCookie = req.cookies.get("role")?.value;
    const roleList = rolesCookie
        ? rolesCookie.split(",").map((r) => r.trim().toLowerCase())
        : [];

    for (const route of protectedRoutes) {
        if (pathname.startsWith(route.path)) {
            if (!refreshToken) {
                return NextResponse.redirect(new URL("/login", req.url));
            }

            const hasAccess = route.roles.some((r) =>
                roleList.includes(r.toLowerCase())
            );

            if (!hasAccess) {
                return NextResponse.redirect(new URL("/forbindden", req.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/user/:path*"],
};
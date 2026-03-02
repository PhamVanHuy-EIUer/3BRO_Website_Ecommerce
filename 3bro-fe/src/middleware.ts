import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const refreshToken = req.cookies.get("refresh_token")?.value;
    const rolesCookie = req.cookies.get("role")?.value;

    const roleList = rolesCookie
        ? rolesCookie.split(",").map((r) => r.trim().toLowerCase())
        : [];

    if (pathname === "/" && refreshToken) {
        if (roleList.includes("admin")) {
            return NextResponse.redirect(new URL("/admin", req.url));
        }

        if (roleList.includes("user")) {
            return NextResponse.redirect(new URL("/user", req.url));
        }
    }

    if (pathname.startsWith("/admin")) {

        // chưa login
        if (!refreshToken) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        if (roleList.length === 0) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // không phải admin
        else if (!roleList.includes("admin")) {
            return NextResponse.redirect(new URL("/forbindden", req.url));
        }
    }


    if (pathname.startsWith("/user")) {

        // chưa login
        if (!refreshToken) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        const hasAccess =
            roleList.includes("user") || roleList.includes("admin");
        if (roleList.length === 0) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        // user hoặc admin đều được


        else if (!hasAccess) {
            return NextResponse.redirect(new URL("/forbindden", req.url));
        }

    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/admin/:path*", "/user/:path*"],
};
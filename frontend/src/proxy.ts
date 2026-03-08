import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/", "/login", "/register", "/reset-password", "/verify"];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isPublicAsset =
        pathname.startsWith("/_next") ||
        pathname.startsWith("/favicon") ||
        pathname.startsWith("/logos/") ||
        /\.[^/]+$/.test(pathname);

    if (isPublicAsset) {
        return NextResponse.next();
    }

    if (publicPaths.some((path) => pathname === path)) {
        return NextResponse.next();
    }

    const token = request.cookies.get("access_token");
    if (!token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

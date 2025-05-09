import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const { pathname, hostname } = request.nextUrl;

    if (hostname === "printvc.com") {
        return NextResponse.redirect(
            new URL(pathname, "https://www.printvc.com"),
        );
    }

    if (token) {
        if (
            pathname.startsWith("/alogin") ||
            pathname.startsWith("/aregister") ||
            pathname.startsWith("/login") ||
            pathname.startsWith("/register")
        ) {
            if (token?.userType === "staff")
                return NextResponse.redirect(new URL("/admin", request.url));
            else if (token?.userType === "customer")
                return NextResponse.redirect(new URL("/", request.url));
        }

        // Block non-admin users from accessing the admin panel
        if (pathname.startsWith("/admin") && token?.userType !== "staff")
            return NextResponse.redirect(new URL("/", request.url));

        if (pathname.startsWith("/customer") && token?.userType !== "customer")
            return NextResponse.redirect(new URL("/", request.url));
    } else {
        if (pathname.startsWith("/admin"))
            return NextResponse.redirect(new URL("/alogin", request.url));

        // Redirect unauthenticated users to the login page
        if (pathname.startsWith("/customer"))
            return NextResponse.redirect(new URL("/login", request.url));
    }
    // Allow access to all other routes
    return NextResponse.next();
}

// Specify the routes to protect with the middleware
export const config = {
    matcher: [
        "/admin/:path*",
        "/customer/:path*",
        "/alogin",
        "/aregister",
        "/login",
        "/register",
    ],
};

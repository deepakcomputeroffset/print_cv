import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });

    const { pathname } = request.nextUrl;
    console.log("in middle ware", pathname);
    // Redirect unauthenticated users to the login page
    if (!token && pathname !== "/login") {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Block non-admin users from accessing the admin panel
    if (pathname.startsWith("/admin") && token?.userType !== "staff") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname.startsWith("/customer") && token?.userType !== "customer") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Allow access to all other routes
    return NextResponse.next();
}

// Specify the routes to protect with the middleware
export const config = {
    matcher: ["/admin/:path*", "/customer/:path*"], // Add other protected routes here
};

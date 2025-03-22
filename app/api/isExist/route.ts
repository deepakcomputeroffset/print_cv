import { auth } from "@/lib/auth";
import { Prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();

        if (!session) {
            const response = NextResponse.json(
                { message: "Logged out" },
                { status: 404 },
            );

            response.cookies.set("next-auth.session-token", "", { maxAge: 0 });
            response.cookies.set("next-auth.csrf-token", "", { maxAge: 0 });
            return response;
        }

        let isExist = false;

        if (session.user?.userType === "customer") {
            isExist = !!(await Prisma.customer.findUnique({
                where: { id: session?.user?.customer?.id },
            }));
        }

        if (session?.user?.userType === "staff") {
            isExist = !!(await Prisma.staff.findUnique({
                where: { id: session?.user?.staff?.id },
            }));
        }

        if (!isExist) {
            const response = NextResponse.json(
                { message: "Logged out" },
                { status: 404 },
            );

            response.cookies.set("next-auth.session-token", "", { maxAge: 0 });
            response.cookies.set("next-auth.csrf-token", "", { maxAge: 0 });
            return response;
        }

        return new Response(null, { status: 200 });
    } catch (error) {
        console.log(error);
        const response = NextResponse.json(
            { message: "Logged out" },
            { status: 404 },
        );

        response.cookies.set("next-auth.session-token", "", { maxAge: 0 });
        response.cookies.set("next-auth.csrf-token", "", { maxAge: 0 });
        return response;
    }
}

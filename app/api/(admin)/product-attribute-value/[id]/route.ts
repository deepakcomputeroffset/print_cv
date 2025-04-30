import { NextResponse } from "next/server";
import { Prisma } from "@/lib/prisma";
import { allowedRoleForCategoryAndProductManagement } from "@/lib/constants";
import { auth } from "@/lib/auth";
import serverResponse from "@/lib/serverResponse";
import { ROLE } from "@prisma/client";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const session = await auth();
        if (
            !session ||
            session.user.userType != "staff" ||
            !allowedRoleForCategoryAndProductManagement.includes(
                session.user.staff?.role as ROLE,
            ) ||
            (session.user.staff?.role !== "ADMIN" &&
                session.user.staff?.isBanned)
        ) {
            return serverResponse({
                status: 401,
                success: false,
                message: "Unauthorized",
            });
        }

        const { id } = await params;

        const productAttributeValue =
            await Prisma.productAttributeValue.findUnique({
                where: { id: parseInt(id) },
            });

        if (!productAttributeValue) {
            return NextResponse.json(
                { success: false, error: "product attribute value not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(
            { success: true, data: productAttributeValue },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error fetching product attribute value:", error);
        return NextResponse.json(
            { error: "Failed to fetch product attribute value" },
            { status: 500 },
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const session = await auth();
        if (
            !session ||
            session.user.userType != "staff" ||
            !allowedRoleForCategoryAndProductManagement.includes(
                session.user.staff?.role as ROLE,
            ) ||
            (session.user.staff?.role !== "ADMIN" &&
                session.user.staff?.isBanned)
        ) {
            return serverResponse({
                status: 401,
                success: false,
                message: "Unauthorized",
            });
        }
        const { id } = await params;
        const value = await Prisma.productAttributeValue.findUnique({
            where: {
                id: parseInt(id),
            },
            include: {
                _count: {
                    select: {
                        productItems: true,
                    },
                },
            },
        });
        if (!!value?._count?.productItems && value?._count?.productItems > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "product attribute value can't delete.",
                },
                { status: 400 },
            );
        }
        const productAttributeValue = await Prisma.productAttributeValue.delete(
            {
                where: { id: parseInt(id) },
            },
        );

        if (!productAttributeValue) {
            return NextResponse.json(
                {
                    success: false,
                    message: "product attribute value not found",
                },
                { status: 404 },
            );
        }

        return new NextResponse(null, { status: 200 });
    } catch (error) {
        console.error("Error deleting product attribute value:", `${error}`);
        return NextResponse.json(
            { error: "Failed to delete product attribute value" },
            { status: 500 },
        );
    }
}

import serverResponse from "@/lib/serverResponse";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { deleteFiles } from "@/lib/storage";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        // const session = await auth();

        // if (!session?.user) {
        //     return NextResponse.json(
        //         { message: "Unauthorized" },
        //         { status: 401 },
        //     );
        // }

        // const order = await prisma.order.findUnique({
        //     where: { id: params.id },
        //     include: {
        //         user: {
        //             select: {
        //                 name: true,
        //                 email: true,
        //             },
        //         },
        //     },
        // });

        // if (!order) {
        //     return NextResponse.json(
        //         { message: "Order not found" },
        //         { status: 404 },
        //     );
        // }

        // Only allow admin or the order owner to view the order
        // if (session.user.role !== "ADMIN" && order.userId !== session.user.id) {
        //     return NextResponse.json(
        //         { message: "Unauthorized" },
        //         { status: 401 },
        //     );
        // }
        console.log(req, params);
        // return NextResponse.json(order);
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error fetching order" },
            { status: 500 },
        );
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        // const session = await auth();
        // if (session?.user?.role !== "ADMIN") {
        //     return NextResponse.json(
        //         { message: "Unauthorized" },
        //         { status: 401 },
        //     );
        // }
        // console.log(params);
        // const { status } = await req.json();
        // const order = await prisma.order.update({
        //     where: { id: params.id },
        //     data: { status },
        //     include: {
        //         user: {
        //             select: {
        //                 name: true,
        //                 email: true,
        //             },
        //         },
        //     },
        // });
        // return NextResponse.json(order);
        console.log(req, params);
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error updating order" },
            { status: 500 },
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const session = await auth();

        if (
            session?.user?.userType != "customer" ||
            session?.user?.customer?.isBanned ||
            !session?.user?.customer
        ) {
            return serverResponse({
                status: 401,
                success: false,
                error: "Unauthorized",
            });
        }
        const { id } = await params;
        if (!id || isNaN(parseInt(id))) {
            return serverResponse({
                status: 400,
                success: false,
                error: "Order ID is required.",
            });
        }

        const order = await prisma.order.delete({
            where: { id: parseInt(id), customerId: session.user.customer.id },
            select: { file: true, id: true },
        });

        if (!order) {
            return serverResponse({
                status: 404,
                success: false,
                error: "Order not found!",
            });
        }

        if (order?.file) {
            const deleted = await deleteFiles(order?.file?.urls);
            console.log(
                deleted.length === order.file.urls.length
                    ? "File deleted"
                    : "Some file not deleted",
            );
        }

        return serverResponse({
            status: 200,
            success: true,
            message: "Order deleted successfully.",
        });
    } catch (error) {
        console.error(error);
        return serverResponse({
            status: 500,
            success: false,
            error: error instanceof Error ? error.message : error,
        });
    }
}

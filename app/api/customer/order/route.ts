import { NextResponse } from "next/server";
import { mockOrders } from "../../../../lib/mock/orders";
import { auth } from "@/lib/auth";
import { orderFormSchema } from "@/schemas/order.form.schema";
import { getPriceAccordingToCategoryOfCustomer } from "@/lib/getPriceOfProductItem";

export async function GET() {
    try {
        // const session = await auth();

        // if (session?.user?.role !== "ADMIN") {
        //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        // }

        return NextResponse.json(mockOrders);
    } catch (error) {
        return NextResponse.json(
            { message: "Error fetching orders", error },
            { status: 500 },
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (
            session?.user?.userType != "customer" ||
            session?.user?.customer?.isBanned ||
            !session?.user?.customer
        ) {
            return NextResponse.json(
                { message: "Unauthorised" },
                { status: 401 },
            );
        }

        const orderDetail = await request.json();

        const {
            success,
            data,
            error: parseError,
        } = orderFormSchema.safeParse(orderDetail);

        if (!success) {
            return Response.json({ error: parseError }, { status: 400 });
        }

        const productItem = await prisma?.productItem.findUnique({
            where: {
                id: data?.productItemId,
            },
        });

        if (!productItem) {
            return Response.json(
                { error: "Product not found!" },
                { status: 404 },
            );
        }

        const createdOrder = await prisma?.order.create({
            data: {
                customerId: session?.user?.customer?.id,
                productItemId: productItem?.id,
                qty: Math.max(data?.productItemId, productItem?.minQty),
                amount:
                    getPriceAccordingToCategoryOfCustomer(
                        session,
                        productItem,
                    ) * Math.max(data?.productItemId, productItem?.minQty),
            },
        });

        return Response.json(
            { data: createdOrder, message: "Order Placed" },
            { status: 201 },
        );
    } catch (error) {
        return Response.json(error, { status: 500 });
    }
}

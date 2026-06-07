import { auth } from "../../../../../lib/auth";
import { allowedRoleForDispatchManagement } from "../../../../../lib/constants";
import { Prisma } from "../../../../../lib/prisma";
import serverResponse from "../../../../../lib/serverResponse";
import { ROLE } from "@prisma/client";

type InvoiceAction = "generate" | "set-date";

export async function POST(request: Request) {
    try {
        const session = await auth();
        const staffSession = session as typeof session & {
            user: {
                userType?: "staff" | "customer";
                staff?: {
                    role?: ROLE;
                    isBanned?: boolean;
                };
            };
        };

        if (
            !staffSession?.user ||
            staffSession.user.userType !== "staff" ||
            !allowedRoleForDispatchManagement.includes(
                staffSession.user.staff?.role as ROLE,
            ) ||
            (staffSession.user.staff?.role !== "ADMIN" &&
                staffSession.user.staff?.isBanned === true)
        ) {
            return serverResponse({
                status: 401,
                success: false,
                message: "Unauthorized",
            });
        }

        const { id, action, invoiceDate } = (await request.json()) as {
            id?: number;
            action?: InvoiceAction;
            invoiceDate?: string;
        };

        if (!id || !action) {
            return serverResponse({
                status: 400,
                success: false,
                message: "All fields are required.",
            });
        }

        const order = (await Prisma.order.findUnique({
            where: { id },
        })) as {
            invoiceDate?: Date | null;
            invoiceGeneratedAt?: Date | null;
        } | null;

        if (!order) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Order not found.",
            });
        }

        if (action === "set-date") {
            if (staffSession.user.staff?.role !== "ADMIN") {
                return serverResponse({
                    status: 403,
                    success: false,
                    message: "Only admins can edit the invoice date.",
                });
            }

            if (order.invoiceGeneratedAt) {
                return serverResponse({
                    status: 409,
                    success: false,
                    message:
                        "Invoice is already generated, so the date cannot be changed.",
                });
            }

            if (!invoiceDate) {
                return serverResponse({
                    status: 400,
                    success: false,
                    message: "Invoice date is required.",
                });
            }

            const updatedOrder = await Prisma.order.update({
                where: { id },
                data: {
                    invoiceDate: new Date(invoiceDate),
                } as never,
            });

            return serverResponse({
                status: 200,
                success: true,
                message: "Invoice date updated successfully.",
                data: updatedOrder,
            });
        }

        if (action === "generate") {
            if (order.invoiceGeneratedAt) {
                return serverResponse({
                    status: 200,
                    success: true,
                    message: "Invoice is already generated.",
                    data: order,
                });
            }

            const selectedInvoiceDate = order.invoiceDate ?? new Date();
            const updatedOrder = await Prisma.order.update({
                where: { id },
                data: {
                    invoiceDate: selectedInvoiceDate,
                    invoiceGeneratedAt: new Date(),
                } as never,
            });

            return serverResponse({
                status: 200,
                success: true,
                message: "Invoice generated successfully.",
                data: updatedOrder,
            });
        }

        return serverResponse({
            status: 400,
            success: false,
            message: "Invalid invoice action.",
        });
    } catch (error) {
        return serverResponse({
            status: 500,
            success: false,
            message: "Error processing invoice request",
            error: error instanceof Error ? error.message : error,
        });
    }
}

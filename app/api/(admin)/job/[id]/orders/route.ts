import serverResponse from "@/lib/serverResponse";
import { addOrdersToJobFormSchema } from "@/schemas/job.form.schema";
import { Prisma } from "@/lib/prisma";
import { STATUS } from "@prisma/client";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        if (!id) {
            return serverResponse({
                status: 400,
                success: false,
                message: "Invalid job id",
            });
        }
        const data = await request.json();
        const result = addOrdersToJobFormSchema.safeParse(data);

        if (!id || isNaN(parseInt(id)) || !result.success) {
            return serverResponse({
                status: 400,
                success: false,
                message: "Invaid data",
                error: result?.error?.issues,
            });
        }

        const isJobExist = await Prisma?.job.findUnique({
            where: { id: parseInt(id) },
        });

        const isOrdersExist = await Prisma?.order.findMany({
            where: {
                id: {
                    in: result.data.orders,
                },
                status: STATUS.FILE_UPLOADED,
            },
        });

        if (!isJobExist || !isOrdersExist) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Invalid orders or job",
            });
        }
        console.log(result.data.orders);
        // connect orders to job
        const updatedOrder = await Prisma?.order.updateMany({
            where: {
                id: {
                    in: result.data.orders,
                },
                status: STATUS.FILE_UPLOADED,
            },
            data: {
                jobId: isJobExist.id,
                status: "PROCESSING",
            },
        });

        console.log(updatedOrder);
        return serverResponse({
            status: 200,
            success: true,
            message: "Order updated successfully",
            data: updatedOrder,
        });
    } catch (error) {
        return serverResponse({
            status: 500,
            success: false,
            message: "Failed to adding orders to job.",
            error: error instanceof Error ? error.message : error,
        });
    }
}

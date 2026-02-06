import { Prisma } from "@/lib/prisma";
import { Prisma as PrismaType, ROLE } from "@prisma/client";
import { auth } from "@/lib/auth";
import { allowedRoleForOrderManagement } from "@/lib/constants";

export async function getOrdersCountToReview() {
    const session = await auth();
    if (
        !session ||
        session?.user?.userType != "staff" ||
        !allowedRoleForOrderManagement.includes(
            session?.user?.staff?.role as ROLE,
        ) ||
        (session.user.staff?.role !== "ADMIN" && session.user.staff?.isBanned)
    ) {
        throw new Error("Unauthorized");
    }
    const where: PrismaType.orderWhereInput = {
        isAttachmentVerified: false,
        OR: [
            {
                status: "PLACED",
                uploadFilesVia: "EMAIL",
            },
            {
                status: "FILE_UPLOADED",
                uploadFilesVia: "UPLOAD",
            },
        ],
    };

    return await Prisma.order.count({ where });
}

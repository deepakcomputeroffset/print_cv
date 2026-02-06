import { Prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getPendingTaskCount() {
    const session = await auth();
    if (
        !session ||
        session?.user?.userType !== "staff" ||
        !session.user.staff
    ) {
        throw new Error("Unauthorized");
    }

    return await Prisma.task.count({
        where: {
            assignedStaffId: session.user.staff.id,
            completedAt: null,
        },
    });
}

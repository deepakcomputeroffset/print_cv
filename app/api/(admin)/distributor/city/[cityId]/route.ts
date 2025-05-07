import { auth } from "@/lib/auth";
import { allowedRoleForDispatchManagement } from "@/lib/constants";
import { Prisma } from "@/lib/prisma";
import serverResponse from "@/lib/serverResponse";
import { ROLE } from "@prisma/client";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ cityId: string }> },
) {
    try {
        const session = await auth();
        if (
            !session ||
            session.user.userType !== "staff" ||
            !allowedRoleForDispatchManagement.includes(
                session.user.staff?.role as ROLE,
            ) ||
            (session.user.staff?.role !== "ADMIN" &&
                session.user.staff?.isBanned === true)
        ) {
            return serverResponse({
                status: 401,
                success: false,
                message: "Unauthorized",
            });
        }
        const { cityId } = await params;
        const staffs = await Prisma.address.findMany({
            where: { cityId: parseInt(cityId), ownerType: "STAFF" },
            select: {
                ownerId: true,
            },
        });

        if (!staffs) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Distributer not found",
            });
        }

        let staffsId = staffs.map((s) => s.ownerId);

        const distributors = await Prisma.staff.findMany({
            where: {
                id: { in: staffsId },
                role: "DISTRIBUTER",
                isBanned: false,
            },
        });

        staffsId = distributors.map((d) => d.id);

        const addresses = await Prisma.address.findMany({
            where: {
                ownerId: { in: staffsId },
                ownerType: "STAFF",
            },
        });

        const distributorsWithAddresses = distributors.map((s) => ({
            ...s,
            address: addresses.filter(
                (a) => a.ownerId === s.id && a.ownerType === "STAFF",
            )[0],
        }));

        return serverResponse({
            status: 200,
            success: true,
            data: distributorsWithAddresses,
            message: "staff fetched successfully.",
        });
    } catch (error) {
        return serverResponse({
            status: 500,
            success: false,
            message: "Error while fetching staff.",
            error: error instanceof Error ? error.message : error,
        });
    }
}

import { Prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import serverResponse from "@/lib/serverResponse";
import { allowedRoleForJobManagement } from "@/lib/constants";
import { ROLE } from "@prisma/client";
import { jobPrefixFormSchema } from "@/schemas/job.form.schema";

function isAuthorized(session: Awaited<ReturnType<typeof auth>>) {
    return (
        session &&
        session?.user?.userType === "staff" &&
        allowedRoleForJobManagement.includes(
            session?.user?.staff?.role as ROLE,
        ) &&
        !(session.user.staff?.role !== "ADMIN" && session.user.staff?.isBanned)
    );
}

export async function GET() {
    try {
        const session = await auth();
        if (!isAuthorized(session)) {
            return serverResponse({
                status: 401,
                success: false,
                error: "Unauthorized",
            });
        }

        const prefixes = await Prisma.jobPrefix.findMany({
            orderBy: { prefix: "asc" },
        });

        return serverResponse({
            status: 200,
            success: true,
            data: prefixes,
            message: "Prefixes fetched successfully.",
        });
    } catch (error) {
        return serverResponse({
            status: 500,
            success: false,
            message: "Error while fetching prefixes.",
            error: error instanceof Error ? error.message : error,
        });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!isAuthorized(session)) {
            return serverResponse({
                status: 401,
                success: false,
                error: "Unauthorized",
            });
        }

        const body = await req.json();
        const parsed = jobPrefixFormSchema.safeParse(body);

        if (!parsed.success) {
            return serverResponse({
                status: 400,
                success: false,
                message: "Invalid prefix data",
                error: parsed.error.issues,
            });
        }

        const existing = await Prisma.jobPrefix.findUnique({
            where: { prefix: parsed.data.prefix },
        });

        if (existing) {
            return serverResponse({
                status: 409,
                success: false,
                message: "A prefix with this name already exists.",
            });
        }

        const created = await Prisma.jobPrefix.create({
            data: { prefix: parsed.data.prefix },
        });

        return serverResponse({
            status: 201,
            success: true,
            data: created,
            message: "Prefix created successfully.",
        });
    } catch (error) {
        return serverResponse({
            status: 500,
            success: false,
            message: "Error while creating prefix.",
            error: error instanceof Error ? error.message : error,
        });
    }
}

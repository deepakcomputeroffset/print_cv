import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TASK_STATUS } from "@prisma/client";
import ClientTaskTable from "./components/taskTable";

export default async function StaffTasks() {
    const session = await auth();
    if (
        !session ||
        session?.user?.userType != "staff" ||
        (session.user.staff?.role !== "ADMIN" && session.user.staff?.isBanned)
    ) {
        return redirect("/");
    }

    // Server-side data fetching
    const [pendingTasks, inProgressTasks, completedTasks] =
        await prisma.$transaction([
            prisma.task.findMany({
                where: {
                    assignedStaffId: session.user.staff?.id,
                    status: TASK_STATUS.PENDING,
                },
                include: { job: true, taskType: true },
                orderBy: { createdAt: "asc" },
            }),
            prisma.task.findMany({
                where: {
                    assignedStaffId: session.user.staff?.id,
                    status: TASK_STATUS.IN_PROGRESS,
                },
                include: { job: true, taskType: true },
                orderBy: { createdAt: "asc" },
            }),
            prisma.task.findMany({
                where: {
                    assignedStaffId: session.user.staff?.id,
                    status: TASK_STATUS.COMPLETED,
                },
                include: { job: true, taskType: true },
                orderBy: { createdAt: "asc" },
            }),
        ]);

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Your Tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
                <ClientTaskTable
                    pendingTasks={JSON.parse(JSON.stringify(pendingTasks))}
                    inProgressTasks={JSON.parse(
                        JSON.stringify(inProgressTasks),
                    )}
                    completedTasks={JSON.parse(JSON.stringify(completedTasks))}
                />
            </CardContent>
        </Card>
    );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TASK_STATUS } from "@prisma/client";
import ClientTaskTable from "./components/taskTable";
import { SidebarTrigger } from "@/components/ui/sidebar";

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
        await Prisma.$transaction([
            Prisma.task.findMany({
                where: {
                    assignedStaffId: session.user.staff?.id,
                    status: TASK_STATUS.PENDING,
                },
                include: { job: true, taskType: true },
                orderBy: { createdAt: "asc" },
            }),
            Prisma.task.findMany({
                where: {
                    assignedStaffId: session.user.staff?.id,
                    status: TASK_STATUS.IN_PROGRESS,
                },
                include: { job: true, taskType: true },
                orderBy: { createdAt: "asc" },
            }),
            Prisma.task.findMany({
                where: {
                    assignedStaffId: session.user.staff?.id,
                    status: TASK_STATUS.COMPLETED,
                },
                include: { job: true, taskType: true },
                orderBy: { createdAt: "asc" },
            }),
        ]);

    return (
        <div className="space-y-6 h-full min-h-full">
            <div className="flex items-center gap-3">
                <SidebarTrigger className="w-8 h-8" />
                <h1 className="text-2xl font-semibold">Tasks</h1>
            </div>
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
                        completedTasks={JSON.parse(
                            JSON.stringify(completedTasks),
                        )}
                    />
                </CardContent>
            </Card>
        </div>
    );
}

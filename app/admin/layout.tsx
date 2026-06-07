import { AppSidebar } from "@/components/admin/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import CheckSession from "@/components/checkSession";
import { auth } from "@/lib/auth";
import { AdminNotificationWrapper } from "@/components/admin/admin-notification-wrapper";
import { getOrdersCountToReview } from "./review/reminder.action";
import { getPendingTaskCount } from "./tasks/task-count.action";
import { AdminHeader } from "@/components/admin/admin-header";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    let initialReviewCount = 0;
    let initialTaskCount = 0;
    try {
        initialReviewCount = await getOrdersCountToReview();
    } catch {
        // User may not have permission — that's fine, default to 0
    }
    try {
        initialTaskCount = await getPendingTaskCount();
    } catch {
        // default to 0
    }

    return (
        <div className="flex h-full bg-white">
            <AdminNotificationWrapper
                session={session}
                initialReviewCount={initialReviewCount}
                initialTaskCount={initialTaskCount}
            >
                <SidebarProvider>
                    <AppSidebar session={session} />
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <AdminHeader />
                        <main className="flex-1 overflow-y-auto px-6 py-4">
                            {children}
                        </main>
                    </div>
                </SidebarProvider>
            </AdminNotificationWrapper>
            <CheckSession />
        </div>
    );
}

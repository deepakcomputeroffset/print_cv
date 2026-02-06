import { AppSidebar } from "@/components/admin/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import CheckSession from "@/components/checkSession";
import { auth } from "@/lib/auth";
import { AdminNotificationWrapper } from "@/components/admin/admin-notification-wrapper";
import { getOrdersCountToReview } from "./review/reminder.action";
import { getPendingTaskCount } from "./tasks/task-count.action";

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
        <div className="flex h-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
            <AdminNotificationWrapper
                session={session}
                initialReviewCount={initialReviewCount}
                initialTaskCount={initialTaskCount}
            >
                <SidebarProvider>
                    <AppSidebar session={session} />
                    <main className="flex-1 overflow-y-auto p-6">
                        {/* <div className="max-w-7xl mx-auto"> */}
                        {children}
                        {/* </div> */}
                    </main>
                </SidebarProvider>
            </AdminNotificationWrapper>
            <CheckSession />
        </div>
    );
}

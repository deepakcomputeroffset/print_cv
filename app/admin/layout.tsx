import { AppSidebar } from "@/components/admin/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // const session = await auth();

    // if (session?.user?.role !== "ADMIN") {
    //   redirect("/login");
    // }

    return (
        <div className="flex h-screen">
            <SidebarProvider>
                <AppSidebar />
                <main className="flex-1 overflow-y-auto p-8 h-full">
                    {children}
                </main>
            </SidebarProvider>
        </div>
    );
}

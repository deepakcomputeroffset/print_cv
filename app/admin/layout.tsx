import { AppSidebar } from "@/components/admin/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import CheckSession from "@/components/checkSession";
import { auth } from "@/lib/auth";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    return (
        <div className="flex h-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
            <SidebarProvider>
                <AppSidebar session={session} />
                <main className="flex-1 overflow-y-auto p-6">
                    {/* <div className="max-w-7xl mx-auto"> */}
                    {children}
                    {/* </div> */}
                </main>
            </SidebarProvider>
            <CheckSession />
        </div>
    );
}

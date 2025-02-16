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
        <div className="flex h-screen">
            <SidebarProvider>
                <AppSidebar session={session} />
                <main className="flex-1 overflow-y-auto p-8 h-full">
                    {children}
                </main>
            </SidebarProvider>
            <CheckSession />
        </div>
    );
}

// import { redirect } from "next/navigation";
// import { auth } from "@/lib/auth";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
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
                {/* <AdminSidebar /> */}
                <AppSidebar />
                <main className="flex-1 overflow-y-auto p-8 h-full">
                    {children}
                </main>
            </SidebarProvider>
        </div>
    );
}

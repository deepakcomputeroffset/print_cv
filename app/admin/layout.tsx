// import { redirect } from "next/navigation";
// import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";

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
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto p-8 h-full">{children}</main>
        </div>
    );
}

"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

const pageTitles: Record<string, string> = {
    "/admin": "Dashboard",
    "/admin/staff": "Staff",
    "/admin/customer": "Customers",
    "/admin/customer-category": "Customer Categories",
    "/admin/tasks": "Tasks",
    "/admin/wallet": "Wallet",
    "/admin/category": "Categories",
    "/admin/products": "Products",
    "/admin/department": "Departments",
    "/admin/job": "Jobs",
    "/admin/dispatch": "Dispatch",
    "/admin/review": "Review Orders",
    "/admin/orders": "Orders",
    "/admin/distribution": "Distribution",
    "/admin/design-category": "Design Categories",
    "/admin/design-items": "Designs",
    "/admin/carousel": "Carousels",
};

function getPageTitle(pathname: string): string {
    // Exact match first
    if (pageTitles[pathname]) return pageTitles[pathname];
    // Try prefix match (for nested routes like /admin/orders/123)
    const segments = pathname.split("/").filter(Boolean);
    for (let i = segments.length; i >= 2; i--) {
        const prefix = "/" + segments.slice(0, i).join("/");
        if (pageTitles[prefix]) return pageTitles[prefix];
    }
    return "Admin";
}

export function AdminHeader() {
    const pathname = usePathname();
    const title = getPageTitle(pathname);

    return (
        <header
            className="sticky top-0 z-20 flex items-center gap-3 px-4 h-14 border-b bg-white/80 backdrop-blur-sm"
            style={{ borderColor: "hsl(var(--gmail-border))" }}
        >
            {/* Sidebar toggle */}
            <SidebarTrigger className="w-8 h-8 text-gmail-text-secondary hover:bg-gmail-hover rounded-full transition-colors" />

            {/* Page title */}
            <h1 className="text-base font-medium text-gmail-text whitespace-nowrap">
                {title}
            </h1>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Search bar */}
            <div className="hidden md:flex items-center max-w-md w-full">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gmail-text-secondary" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full h-9 pl-9 pr-4 rounded-full text-sm bg-gmail-surface border border-transparent focus:border-gmail-blue focus:bg-white focus:outline-none focus:ring-1 focus:ring-gmail-blue/30 transition-all placeholder:text-gmail-text-secondary"
                    />
                </div>
            </div>

            {/* Spacer */}
            <div className="flex-1" />
        </header>
    );
}

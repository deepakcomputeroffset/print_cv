"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    Package,
    Settings,
} from "lucide-react";

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/admin",
        pattern: /^\/admin$/,
    },
    {
        label: "Staffs",
        icon: Users,
        href: "/admin/staff",
        pattern: /^\/admin\/staff/,
    },
    {
        label: "Customers",
        icon: Users,
        href: "/admin/customer",
        pattern: /^\/admin\/customer/,
    },
    {
        label: "Category",
        icon: ShoppingBag,
        href: "/admin/category",
        pattern: /^\/admin\/category/,
    },
    {
        label: "Products",
        icon: ShoppingBag,
        href: "/admin/products",
        pattern: /^\/admin\/products/,
    },
    {
        label: "Orders",
        icon: Package,
        href: "/admin/orders",
        pattern: /^\/admin\/orders/,
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/admin/settings",
        pattern: /^\/admin\/settings/,
    },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-muted w-64 border-r">
            <div className="px-3 py-2 flex-1">
                <Link href="/admin" className="flex items-center pl-3 mb-14">
                    <h1 className="text-xl font-bold">Admin Panel</h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-lg transition",
                                route.pattern.test(pathname)
                                    ? "bg-accent"
                                    : "transparent",
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3")} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

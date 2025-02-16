"use client";
import {
    GalleryVerticalEnd,
    Home,
    LayoutDashboard,
    Package,
    ShoppingBag,
    ShoppingCart,
    Users,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavUser } from "./nav-user";
import { Session } from "next-auth";

const routes = [
    {
        title: "Home",
        icon: Home,
        url: "/",
        pattern: /^\/$/,
    },
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        url: "/admin",
        pattern: /^\/admin$/,
    },
    {
        title: "Staffs",
        icon: Users,
        url: "/admin/staff?search=&sortorder=asc&perpage=100",
        pattern: /^\/admin\/staff(?:\/.*)?$/, // Matches /admin/staff and any nested route
    },
    {
        title: "Customers",
        icon: Users,
        url: "/admin/customer?search=&sortorder=asc&perpage=100",
        pattern: /^\/admin\/customer(?:\/.*)?$/,
    },
    {
        title: "Category",
        icon: ShoppingBag,
        url: "/admin/category?search=&sortorder=asc&perpage=100",
        pattern: /^\/admin\/category(?:\/.*)?$/,
    },
    {
        title: "Products",
        icon: Package,
        url: "/admin/products?search=&sortorder=asc&perpage=100",
        pattern: /^\/admin\/products(?:\/.*)?$/,
    },
    {
        title: "Orders",
        icon: ShoppingCart,
        url: "/admin/orders",
        pattern: /^\/admin\/orders(?:\/.*)?$/,
    },
];

export function AppSidebar({ session }: { session: Session | null }) {
    const currentPath = usePathname();
    const isRouteActive = (pattern: RegExp) => pattern.test(currentPath);
    const { isMobile, toggleSidebar } = useSidebar();
    return (
        <Sidebar variant="floating" collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <div>
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <GalleryVerticalEnd className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">
                                        Print Club
                                    </span>
                                    <span>Dashboard</span>
                                </div>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {routes.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        className={`sidebar-item ${isRouteActive(item.pattern) ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}`}
                                        asChild
                                    >
                                        <Link
                                            href={item?.url}
                                            onClick={() =>
                                                isMobile && toggleSidebar()
                                            }
                                        >
                                            <item.icon />
                                            <span className="text-base font-semibold">
                                                {item?.title}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavUser session={session} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}

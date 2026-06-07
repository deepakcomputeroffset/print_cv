"use client";
import { GalleryVerticalEnd } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavUser } from "./nav-user";
import { Session } from "next-auth";
import { routes, groupLabels, RouteGroup } from "./routes";
import { COMPANY_DATA } from "@/lib/constants";
import { useNotificationStore } from "@/provider/notification.provider";

export function AppSidebar({ session }: { session: Session | null }) {
    const currentPath = usePathname();
    const isRouteActive = (pattern: RegExp) => pattern.test(currentPath);
    const { isMobile, toggleSidebar, state } = useSidebar();
    const reviewCount = useNotificationStore((s) => s.reviewCount);
    const taskCount = useNotificationStore((s) => s.taskCount);

    // Filter routes by role
    const filteredRoutes = routes.filter((item) =>
        item.roles.includes(
            session?.user?.staff?.role ? session.user.staff.role : "STAFF",
        ),
    );

    // Group routes
    const groupedRoutes = filteredRoutes.reduce(
        (acc, route) => {
            if (!acc[route.group]) acc[route.group] = [];
            acc[route.group].push(route);
            return acc;
        },
        {} as Record<RouteGroup, typeof filteredRoutes>,
    );

    // Define group order
    const groupOrder: RouteGroup[] = [
        "main",
        "people",
        "catalog",
        "operations",
        "content",
    ];

    return (
        <Sidebar
            variant="sidebar"
            collapsible="icon"
            className="border-r"
            style={{ borderColor: "hsl(var(--gmail-border))" }}
        >
            <SidebarHeader
                className="border-b"
                style={{ borderColor: "hsl(var(--gmail-border))" }}
            >
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            className="group-data-[collapsible=icon]:!mx-auto group-data-[collapsible=icon]:!p-0"
                            asChild
                        >
                            <div className="flex items-center gap-3 group-data-[collapsible=icon]:!gap-0">
                                <div className="flex shrink-0 aspect-square size-8 items-center justify-center rounded-xl bg-gmail-blue text-white shadow-sm">
                                    <GalleryVerticalEnd className="size-5" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                                    <span className="font-semibold text-[15px] text-gmail-text truncate">
                                        {COMPANY_DATA.shortName}
                                    </span>
                                    <span className="text-xs text-gmail-text-secondary truncate">
                                        Admin Panel
                                    </span>
                                </div>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="py-2">
                {groupOrder.map((groupKey) => {
                    const groupRoutes = groupedRoutes[groupKey];
                    if (!groupRoutes || groupRoutes.length === 0) return null;

                    return (
                        <SidebarGroup key={groupKey} className="py-1">
                            <SidebarGroupLabel className="px-4 text-[11px] font-semibold text-gmail-text-secondary uppercase tracking-widest mb-1">
                                {groupLabels[groupKey]}
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {groupRoutes.map((item) => {
                                        const active = isRouteActive(
                                            item.pattern,
                                        );
                                        return (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton
                                                    className={`transition-all duration-150 mx-2 rounded-full group-data-[collapsible=icon]:!mx-auto group-data-[collapsible=icon]:!justify-center ${
                                                        active
                                                            ? "bg-blue-100 text-blue-700 font-medium"
                                                            : "text-gmail-text-secondary hover:bg-gmail-hover hover:text-gmail-text"
                                                    }`}
                                                    asChild
                                                >
                                                    <Link
                                                        href={item?.url}
                                                        onClick={() =>
                                                            isMobile &&
                                                            toggleSidebar()
                                                        }
                                                        className="flex items-center gap-3"
                                                    >
                                                        <item.icon
                                                            className={`size-[18px] shrink-0 ${
                                                                active
                                                                    ? "text-blue-600"
                                                                    : "text-gmail-text-secondary"
                                                            }`}
                                                        />
                                                        <span className="text-[13px] group-data-[collapsible=icon]:hidden truncate">
                                                            {item?.title}
                                                        </span>
                                                    </Link>
                                                </SidebarMenuButton>
                                                {item.title ===
                                                    "Review Orders" &&
                                                    reviewCount > 0 && (
                                                        <SidebarMenuBadge className="bg-gmail-red text-white text-[11px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center">
                                                            {reviewCount > 99
                                                                ? "99+"
                                                                : reviewCount}
                                                        </SidebarMenuBadge>
                                                    )}
                                                {item.title === "Tasks" &&
                                                    taskCount > 0 && (
                                                        <SidebarMenuBadge className="bg-gmail-blue text-white text-[11px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center">
                                                            {taskCount > 99
                                                                ? "99+"
                                                                : taskCount}
                                                        </SidebarMenuBadge>
                                                    )}
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    );
                })}
            </SidebarContent>

            <SidebarFooter
                className="border-t"
                style={{ borderColor: "hsl(var(--gmail-border))" }}
            >
                <NavUser session={session} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}

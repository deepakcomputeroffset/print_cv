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
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavUser } from "./nav-user";
import { Session } from "next-auth";
import { routes } from "./routes";
import { COMPANY_DATA } from "@/lib/constants";

export function AppSidebar({ session }: { session: Session | null }) {
    const currentPath = usePathname();
    const isRouteActive = (pattern: RegExp) => pattern.test(currentPath);
    const { isMobile, toggleSidebar, state } = useSidebar();

    return (
        <Sidebar
            variant="floating"
            collapsible="icon"
            className="border-r border-gray-200"
        >
            <SidebarHeader className="border-b border-gray-100">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <div className="flex items-center gap-3 p-2">
                                <div className="flex aspect-square px-[7px] items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-md">
                                    <GalleryVerticalEnd className="size-5 m-0" />
                                </div>
                                {state !== "collapsed" && (
                                    <div className="flex flex-col gap-0.5 leading-none">
                                        <span className="font-bold text-lg bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                            {COMPANY_DATA.shortName}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            Admin Panel
                                        </span>
                                    </div>
                                )}
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="py-4">
                <SidebarGroup>
                    <SidebarGroupLabel className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Navigation
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {routes
                                .filter((item) =>
                                    item.roles.includes(
                                        session?.user?.staff?.role
                                            ? session.user.staff.role
                                            : "STAFF",
                                    ),
                                )
                                .map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            className={`sidebar-item transition-all duration-200 ${
                                                isRouteActive(item.pattern)
                                                    ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                                                    : "hover:bg-gray-50 hover:text-gray-900"
                                            }`}
                                            asChild
                                        >
                                            <Link
                                                href={item?.url}
                                                onClick={() =>
                                                    isMobile && toggleSidebar()
                                                }
                                                className="flex items-center gap-3 px-4 py-2.5"
                                            >
                                                <item.icon
                                                    className={`size-5 ${
                                                        isRouteActive(
                                                            item.pattern,
                                                        )
                                                            ? "text-blue-600"
                                                            : "text-gray-500"
                                                    }`}
                                                />
                                                <span className="text-sm font-medium">
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

            <SidebarFooter className="border-t border-gray-100">
                <NavUser session={session} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}

"use client";

import { ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";

export function NavUser({ session }: { session: Session | null }) {
    const { isMobile } = useSidebar();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-gmail-hover data-[state=open]:text-gmail-text rounded-full mx-1 group-data-[collapsible=icon]:!mx-auto group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:!p-0"
                        >
                            <Avatar className="h-8 w-8 rounded-full shrink-0">
                                <AvatarImage alt={session?.user?.staff?.name} />
                                <AvatarFallback className="rounded-full bg-gmail-blue text-white text-sm font-medium">
                                    {session?.user?.staff?.name.substring(0, 1)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                                <span className="truncate font-medium text-gmail-text text-[13px]">
                                    {session?.user?.staff?.name}
                                </span>
                                <span className="truncate text-[11px] text-gmail-text-secondary">
                                    {session?.user?.staff?.email}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4 text-gmail-text-secondary group-data-[collapsible=icon]:hidden" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl shadow-lg border"
                        style={{ borderColor: "hsl(var(--gmail-border))" }}
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-3 px-3 py-3 text-left text-sm">
                                <Avatar className="h-9 w-9 rounded-full">
                                    <AvatarImage
                                        alt={session?.user?.staff?.name}
                                    />
                                    <AvatarFallback className="rounded-full bg-gmail-blue text-white text-sm font-medium">
                                        {session?.user?.staff?.name.substring(
                                            0,
                                            1,
                                        )}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium text-gmail-text">
                                        {session?.user?.staff?.name}
                                    </span>
                                    <span className="truncate text-xs text-gmail-text-secondary">
                                        {session?.user?.staff?.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => signOut()}
                            className="cursor-pointer text-gmail-text-secondary hover:text-gmail-red focus:text-gmail-red rounded-lg mx-1 my-1"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

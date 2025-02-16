"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Printer, RotateCw } from "lucide-react";
import { signOut } from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Session } from "next-auth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function NavLinks({ session }: { session: Session | null }) {
    const pathname = usePathname();
    const {
        data: wallet,
        refetch,
        isLoading,
    } = useQuery({
        queryKey: ["wallet"],
        queryFn: async () => {
            const { data } = await axios("/api/customer/wallet");
            return data;
        },
        initialData: session?.user?.customer?.wallet,
    });

    return (
        <div className="container flex h-14 items-center mx-auto">
            <div className="mr-4 flex">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <Printer className="h-6 w-6" />
                    <span className="font-bold">Print Press</span>
                </Link>
                {!!session && session?.user?.userType === "customer" && (
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link
                            href="/customer/categories"
                            className={
                                pathname === "/categories"
                                    ? "text-foreground"
                                    : "text-foreground/60"
                            }
                        >
                            Categories
                        </Link>
                        <Link
                            href="/customer/products"
                            className={
                                pathname === "/products"
                                    ? "text-foreground"
                                    : "text-foreground/60"
                            }
                        >
                            Products
                        </Link>
                        <Link
                            href="/customer/orders"
                            className={
                                pathname === "/orders"
                                    ? "text-foreground"
                                    : "text-foreground/60"
                            }
                        >
                            My Orders
                        </Link>
                    </nav>
                )}
            </div>
            <div className="flex flex-1 items-center justify-end space-x-2">
                {!!session && session?.user?.userType === "customer" && (
                    <Link href="/customer">
                        <Button variant="ghost">Dashboard</Button>
                    </Link>
                )}

                {!!session && session?.user?.userType === "staff" && (
                    <nav>
                        <Link href="/admin">
                            <Button variant="ghost">Dashboard</Button>
                        </Link>
                    </nav>
                )}

                {!session && (
                    <nav className="flex items-center space-x-2">
                        <Link href="/login">
                            <Button variant="ghost">Login</Button>
                        </Link>
                        <Link href="/register">
                            <Button>Sign Up</Button>
                        </Link>
                    </nav>
                )}

                {!!session && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="h-8 w-8 rounded-full cursor-pointer">
                                <AvatarImage
                                    alt={
                                        session?.user.customer
                                            ? session?.user?.customer?.name
                                            : session?.user?.staff?.name
                                    }
                                />
                                <AvatarFallback className="rounded-lg">
                                    {session?.user.customer
                                        ? session?.user?.customer?.name.substring(
                                              0,
                                              1,
                                          )
                                        : session?.user?.staff?.name.substring(
                                              0,
                                              1,
                                          )}
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                            side={true ? "bottom" : "right"}
                            align="end"
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage
                                            alt={
                                                session?.user.customer
                                                    ? session?.user?.customer
                                                          ?.name
                                                    : session?.user?.staff?.name
                                            }
                                        />
                                        <AvatarFallback className="rounded-lg">
                                            {session?.user.customer
                                                ? session?.user?.customer?.name.substring(
                                                      0,
                                                      1,
                                                  )
                                                : session?.user?.staff?.name.substring(
                                                      0,
                                                      1,
                                                  )}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">
                                            {session?.user.customer
                                                ? session?.user?.customer?.name
                                                : session?.user?.staff?.name}
                                        </span>
                                        <span className="truncate text-xs">
                                            {session?.user.customer
                                                ? session?.user?.customer?.email
                                                : session?.user?.staff?.email}
                                        </span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>
                                <div className="flex gap-2 items-center">
                                    <span>Wallet : </span>
                                    <span className="align-middle text-center">
                                        {wallet?.balance}
                                    </span>
                                    <Button
                                        variant={"secondary"}
                                        size={"sm"}
                                        className="ml-auto"
                                        disabled={isLoading}
                                        onClick={() => refetch()}
                                    >
                                        <RotateCw
                                            className={
                                                isLoading ? "animate-spin" : ""
                                            }
                                        />
                                    </Button>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => signOut()}
                                className="cursor-pointer"
                            >
                                <LogOut />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </div>
    );
}

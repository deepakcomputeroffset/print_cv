"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Printer } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
    const pathname = usePathname();
    const session = useSession();
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center mx-auto">
                <div className="mr-4 flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <Printer className="h-6 w-6" />
                        <span className="font-bold">Print Press</span>
                    </Link>
                    {session?.status === "authenticated" &&
                        session?.data?.user?.userType === "customer" && (
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
                    {session.status === "authenticated" &&
                        session?.data?.user?.userType === "customer" && (
                            <nav className="flex items-center space-x-2">
                                <Link href="/customer">
                                    <Button variant="secondary">
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button
                                    variant={"secondary"}
                                    onClick={() => signOut()}
                                >
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            </nav>
                        )}

                    {session.status === "authenticated" &&
                        session?.data?.user?.userType === "staff" && (
                            <nav>
                                <Link href="/admin">
                                    <Button variant="ghost">Dashboard</Button>
                                </Link>
                            </nav>
                        )}

                    {session?.status === "unauthenticated" && (
                        <nav className="flex items-center space-x-2">
                            <Link href="/login">
                                <Button variant="ghost">Login</Button>
                            </Link>
                            <Link href="/register">
                                <Button>Sign Up</Button>
                            </Link>
                        </nav>
                    )}
                </div>
            </div>
        </header>
    );
}

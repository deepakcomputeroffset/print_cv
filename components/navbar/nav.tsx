"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useAnimate } from "motion/react-mini";
import { usePathname } from "next/navigation";
import { sourceSerif4 } from "@/lib/font";
import { Session } from "next-auth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import { Lock, LogOut, Pen, Menu, X } from "lucide-react";
import dynamic from "next/dynamic";
import { Button } from "../ui/button";

const NAV_LINKS = [
    { name: "Home", url: "/" },
    { name: "Services", url: "/categories" },
    {
        name: "Orders",
        url: "/customer/orders?search=&sortorder=desc&perpage=100",
    },
    { name: "Contact us", url: "/#connect" },
];
const Wallet = dynamic(() => import("@/components/wallet"), {
    ssr: false,
});

export default function NavbarLinks({ session }: { session: Session | null }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [menuScope, menuAnimate] = useAnimate();
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Mobile menu animation
    const toggleMobileMenu = () => {
        if (isMobileMenuOpen) {
            // Closing animation
            menuAnimate(
                menuScope.current,
                { opacity: 0, x: 20 },
                { duration: 0.3, ease: "easeOut" },
            ).then(() => {
                setIsMobileMenuOpen(false);
            });
        } else {
            // Opening animation
            setIsMobileMenuOpen(true);
            menuAnimate(
                menuScope.current,
                { opacity: 1, x: 0 },
                { duration: 0.3, delay: 0.1, ease: "easeOut" },
            );
        }
    };

    // Check if a link is active
    const isActiveLink = (url: string) => {
        if (url === "/") {
            return pathname === "/";
        }
        return pathname.startsWith(url);
    };

    return (
        <nav
            className={cn(
                "transition-all duration-300 font-medium w-full z-50",
                sourceSerif4.className,
                scrolled
                    ? "bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 shadow-sm border-b border-primary/5"
                    : "bg-background",
            )}
        >
            <div className="w-full relative px-4 md:px-8 lg:container mx-auto flex items-center justify-between py-3">
                <div className="flex items-center space-x-4 lg:space-x-10">
                    <Link
                        href="/"
                        className="flex-shrink-0 flex items-center space-x-3 group"
                    >
                        <div className="relative overflow-hidden rounded-lg shadow-md bg-gradient-to-br from-primary/80 to-cyan-600 h-10 w-10 p-1 transition-all group-hover:scale-105">
                            <Image
                                src="/logo.avif"
                                width={32}
                                height={32}
                                alt="Printify Logo"
                                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                        </div>

                        <span
                            suppressHydrationWarning
                            className="font-bold text-2xl tracking-tight group-hover:text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-500 transition-all duration-300"
                        >
                            Printify
                        </span>
                    </Link>

                    <div className="hidden lg:flex items-center space-x-1">
                        {NAV_LINKS.map((link) => (
                            <div key={link.name} className="px-2">
                                <Link
                                    href={link.url}
                                    className={cn(
                                        "relative group py-2 px-3 rounded-md text-base transition-all duration-300 flex items-center",
                                        isActiveLink(link.url)
                                            ? "text-primary font-medium"
                                            : "text-foreground/80 hover:text-primary",
                                    )}
                                >
                                    {link.name}
                                    <span
                                        className={cn(
                                            "absolute bottom-0 left-3 right-3 h-0.5 rounded-full transition-all duration-300",
                                            isActiveLink(link.url)
                                                ? "bg-gradient-to-r from-primary to-cyan-500 w-[calc(100%-24px)]"
                                                : "bg-transparent w-0 group-hover:w-[calc(100%-24px)] group-hover:bg-gradient-to-r group-hover:from-primary/60 group-hover:to-cyan-500/60",
                                        )}
                                    />
                                </Link>
                            </div>
                        ))}

                        {!session && (
                            <div className="px-2">
                                <Link
                                    href="/login"
                                    className="relative group py-2 px-3 rounded-md text-base transition-all duration-300 flex items-center text-foreground/80 hover:text-primary"
                                >
                                    Login
                                    <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full transition-all duration-300 bg-transparent w-0 group-hover:w-[calc(100%-24px)] group-hover:bg-gradient-to-r group-hover:from-primary/60 group-hover:to-cyan-500/60" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                <div className="hidden lg:flex items-center justify-center gap-4">
                    {/* Get Started */}
                    {!session && (
                        <div className="box-border justify-end items-center">
                            <Link href="/register">
                                <Button className="bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-600 transition-all text-white shadow-sm hover:shadow">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Customer Dashboard */}
                    {!!session && session?.user?.userType === "customer" && (
                        <div>
                            <Link
                                href="/customer"
                                className={cn(
                                    "relative group py-2 px-3 rounded-md text-base transition-all duration-300 flex items-center",
                                    pathname.startsWith("/customer")
                                        ? "text-primary font-medium"
                                        : "text-foreground/80 hover:text-primary",
                                )}
                            >
                                Dashboard
                                <span
                                    className={cn(
                                        "absolute bottom-0 left-3 right-3 h-0.5 rounded-full transition-all duration-300",
                                        pathname.startsWith("/customer")
                                            ? "bg-gradient-to-r from-primary to-cyan-500 w-[calc(100%-24px)]"
                                            : "bg-transparent w-0 group-hover:w-[calc(100%-24px)] group-hover:bg-gradient-to-r group-hover:from-primary/60 group-hover:to-cyan-500/60",
                                    )}
                                />
                            </Link>
                        </div>
                    )}

                    {/* Staff Dashboard */}
                    {!!session && session?.user?.userType === "staff" && (
                        <div>
                            <Link
                                href="/admin"
                                className={cn(
                                    "relative group py-2 px-3 rounded-md text-base transition-all duration-300 flex items-center",
                                    pathname.startsWith("/admin")
                                        ? "text-primary font-medium"
                                        : "text-foreground/80 hover:text-primary",
                                )}
                            >
                                Dashboard
                                <span
                                    className={cn(
                                        "absolute bottom-0 left-3 right-3 h-0.5 rounded-full transition-all duration-300",
                                        pathname.startsWith("/admin")
                                            ? "bg-gradient-to-r from-primary to-cyan-500 w-[calc(100%-24px)]"
                                            : "bg-transparent w-0 group-hover:w-[calc(100%-24px)] group-hover:bg-gradient-to-r group-hover:from-primary/60 group-hover:to-cyan-500/60",
                                    )}
                                />
                            </Link>
                        </div>
                    )}

                    {/* User Dropdown */}
                    {!!session && (
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="rounded-full p-0 h-10 w-10 hover:bg-primary/10"
                                >
                                    <Avatar className="h-8 w-8 rounded-full cursor-pointer border-2 border-primary/20 hover:border-primary/50 transition-all">
                                        <AvatarImage
                                            alt={
                                                session?.user.customer
                                                    ? session?.user?.customer
                                                          ?.name
                                                    : session?.user?.staff?.name
                                            }
                                        />
                                        <AvatarFallback className="text-black bg-gradient-to-br from-primary/20 to-cyan-600/20 rounded-full">
                                            {session?.user.customer
                                                ? session?.user?.customer?.name
                                                      .substring(0, 1)
                                                      .toUpperCase()
                                                : session?.user?.staff?.name
                                                      .substring(0, 1)
                                                      .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <UserDropdownContent session={session} />
                        </DropdownMenu>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="lg:hidden flex items-center">
                    {!!session && (
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="rounded-full p-0 h-10 w-10 mr-2 hover:bg-primary/10"
                                >
                                    <Avatar className="h-8 w-8 rounded-full cursor-pointer border-2 border-primary/20">
                                        <AvatarImage
                                            alt={
                                                session?.user.customer
                                                    ? session?.user?.customer
                                                          ?.name
                                                    : session?.user?.staff?.name
                                            }
                                        />
                                        <AvatarFallback className="text-black bg-gradient-to-br from-primary/20 to-cyan-600/20 rounded-full">
                                            {session?.user.customer
                                                ? session?.user?.customer?.name
                                                      .substring(0, 1)
                                                      .toUpperCase()
                                                : session?.user?.staff?.name
                                                      .substring(0, 1)
                                                      .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <UserDropdownContent session={session} />
                        </DropdownMenu>
                    )}

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleMobileMenu}
                        className="text-foreground"
                    >
                        {isMobileMenuOpen ? (
                            <X size={24} />
                        ) : (
                            <Menu size={24} />
                        )}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div
                    ref={menuScope}
                    className="lg:hidden fixed inset-0 top-[73px] z-50 bg-background/95 backdrop-blur-md"
                    style={{ opacity: 0, transform: "translateX(20px)" }}
                >
                    <div className="p-6 flex flex-col h-full">
                        <div className="space-y-2 mb-6">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.url}
                                    onClick={toggleMobileMenu}
                                    className={cn(
                                        "block w-full p-3 rounded-lg text-lg transition-all",
                                        isActiveLink(link.url)
                                            ? "bg-gradient-to-r from-primary/10 to-cyan-500/10 border border-primary/10 text-primary font-medium"
                                            : "text-foreground",
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            {!session && (
                                <Link
                                    href="/login"
                                    onClick={toggleMobileMenu}
                                    className="block w-full p-3 rounded-lg text-lg transition-all text-foreground"
                                >
                                    Login
                                </Link>
                            )}

                            {/* Customer Dashboard */}
                            {!!session &&
                                session?.user?.userType === "customer" && (
                                    <Link
                                        href="/customer"
                                        onClick={toggleMobileMenu}
                                        className={cn(
                                            "block w-full p-3 rounded-lg text-lg transition-all",
                                            pathname.startsWith("/customer")
                                                ? "bg-gradient-to-r from-primary/10 to-cyan-500/10 border border-primary/10 text-primary font-medium"
                                                : "text-foreground",
                                        )}
                                    >
                                        Dashboard
                                    </Link>
                                )}

                            {/* Staff Dashboard */}
                            {!!session &&
                                session?.user?.userType === "staff" && (
                                    <Link
                                        href="/admin"
                                        onClick={toggleMobileMenu}
                                        className={cn(
                                            "block w-full p-3 rounded-lg text-lg transition-all",
                                            pathname.startsWith("/admin")
                                                ? "bg-gradient-to-r from-primary/10 to-cyan-500/10 border border-primary/10 text-primary font-medium"
                                                : "text-foreground",
                                        )}
                                    >
                                        Dashboard
                                    </Link>
                                )}
                        </div>

                        {/* Get Started */}
                        {!session && (
                            <div className="mt-4">
                                <Link
                                    href="/register"
                                    onClick={toggleMobileMenu}
                                >
                                    <Button className="w-full bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-600 py-6 text-lg">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        )}

                        <div className="mt-auto">
                            <div className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-cyan-500/5 border border-primary/10">
                                <p className="text-sm text-muted-foreground mb-2">
                                    Need assistance with your printing needs?
                                </p>
                                <p className="text-sm font-medium">
                                    Contact us at{" "}
                                    <a
                                        href="mailto:support@printify.com"
                                        className="text-primary"
                                    >
                                        support@printify.com
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

// User dropdown content extracted to a separate component for reuse
function UserDropdownContent({ session }: { session: Session }) {
    return (
        <DropdownMenuContent
            className="min-w-56 rounded-lg mt-2 border-primary/10 shadow-md"
            side="bottom"
            align="end"
            sideOffset={4}
        >
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-3 p-3 text-left border-b border-primary/5 pb-3">
                    <Avatar className="h-10 w-10 rounded-lg shadow-sm">
                        <AvatarImage
                            alt={
                                session?.user.customer
                                    ? session?.user?.customer?.name
                                    : session?.user?.staff?.name
                            }
                        />
                        <AvatarFallback className="rounded-lg bg-gradient-to-br from-primary/20 to-cyan-600/20">
                            {session?.user.customer
                                ? session?.user?.customer?.name
                                      .substring(0, 1)
                                      .toUpperCase()
                                : session?.user?.staff?.name
                                      .substring(0, 1)
                                      .toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold text-base">
                            {session?.user.customer
                                ? session?.user?.customer?.name
                                : session?.user?.staff?.name}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                            {session?.user.customer
                                ? session?.user?.customer?.email
                                : session?.user?.staff?.email}
                        </span>
                    </div>
                </div>
            </DropdownMenuLabel>

            {/* Wallet */}
            {!!session && session.user.userType === "customer" && (
                <>
                    <DropdownMenuLabel className="bg-gradient-to-r from-primary/5 to-cyan-500/5 rounded-md mx-2 my-2">
                        <Wallet session={session} />
                    </DropdownMenuLabel>
                </>
            )}

            {/* Edit Profile */}
            {!!session && session.user.userType === "customer" && (
                <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
                    <div className="flex w-full items-center p-2 pl-3 gap-2 cursor-default hover:bg-transparent">
                        <span className="text-sm font-medium">
                            Edit Profile
                        </span>
                        <Link href="/customer/edit" className="ml-auto">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-primary/20 hover:bg-primary/10 hover:text-primary"
                            >
                                <Pen className="h-3.5 w-3.5" />
                            </Button>
                        </Link>
                    </div>
                </DropdownMenuItem>
            )}

            {/* Change Password */}
            {!!session && session.user.userType === "customer" && (
                <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
                    <div className="flex w-full items-center p-2 pl-3 gap-2 cursor-default hover:bg-transparent">
                        <span className="text-sm font-medium">
                            Change Password
                        </span>
                        <Link
                            href="/customer/changePassword"
                            className="ml-auto"
                        >
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-primary/20 hover:bg-primary/10 hover:text-primary"
                            >
                                <Lock className="h-3.5 w-3.5" />
                            </Button>
                        </Link>
                    </div>
                </DropdownMenuItem>
            )}

            <DropdownMenuSeparator className="my-1.5" />

            <DropdownMenuItem
                onClick={() => signOut()}
                className="cursor-pointer mx-2 my-1 rounded-md hover:bg-destructive/10 hover:text-destructive"
            >
                <LogOut className="h-4 w-4 mr-2" />
                Log out
            </DropdownMenuItem>
        </DropdownMenuContent>
    );
}

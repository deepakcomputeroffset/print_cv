"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useAnimate } from "motion/react";
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
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
    { name: "Home", url: "/" },
    { name: "Add Order", url: "/categories" },
    { name: "Contact us", url: "/#connect" },
];

const CUSTOMER_LINKS = [
    {
        name: "Orders",
        url: "/customer/orders?search=&sortorder=desc&perpage=100",
    },
    { name: "Wallet", url: "/customer/wallet" },
];

const Wallet = dynamic(() => import("@/components/wallet"), { ssr: false });

export default function NavbarLinks({ session }: { session: Session | null }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [menuScope, menuAnimate] = useAnimate();
    const pathname = usePathname();

    const toggleMobileMenu = () => {
        if (isMobileMenuOpen) {
            if (menuScope.current) {
                menuAnimate(
                    menuScope.current,
                    { opacity: 0, x: 20 },
                    { duration: 0.3, ease: "easeOut" },
                ).then(() => setIsMobileMenuOpen(false));
            } else {
                setIsMobileMenuOpen(false);
            }
        } else {
            setIsMobileMenuOpen(true);
            setTimeout(() => {
                if (menuScope.current) {
                    menuAnimate(
                        menuScope.current,
                        { opacity: 1, x: 0 },
                        { duration: 0.3, delay: 0.1, ease: "easeOut" },
                    );
                }
            }, 0);
        }
    };

    const isActiveLink = (url: string) =>
        url === "/" ? pathname === "/" : pathname.startsWith(url);

    return (
        <nav
            className={cn(
                "transition-all duration-300 font-medium w-full z-50",
                sourceSerif4.className,
            )}
        >
            <div className="w-full relative px-3 md:px-6 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 shadow-sm border-b border-primary/5">
                <div className="w-full relative container mx-auto flex items-center justify-between py-2">
                    {/* Logo Section */}
                    <div className="flex items-center space-x-3 lg:space-x-6">
                        <Link
                            href="/"
                            className="flex-shrink-0 flex items-center space-x-2 group"
                        >
                            <div className="relative overflow-hidden rounded-lg shadow-md bg-gradient-to-br from-primary/80 to-cyan-600 h-8 w-8 p-1 transition-all group-hover:scale-105">
                                <Image
                                    src="/logo.avif"
                                    width={24}
                                    height={24}
                                    alt="Printify Logo"
                                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <span
                                suppressHydrationWarning
                                className="font-bold text-xl tracking-tight group-hover:text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-500 transition-all duration-300"
                            >
                                Printify
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-1">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.url}
                                    className={cn(
                                        "relative group py-1.5 px-2 rounded-md text-sm transition-all duration-300 flex items-center",
                                        isActiveLink(link.url)
                                            ? "text-primary font-medium"
                                            : "text-foreground/80 hover:text-primary",
                                    )}
                                >
                                    {link.name}
                                    <span
                                        className={cn(
                                            "absolute bottom-0 left-2 right-2 h-0.5 rounded-full transition-all duration-300",
                                            isActiveLink(link.url)
                                                ? "bg-gradient-to-r from-primary to-cyan-500 w-[calc(100%-16px)]"
                                                : "bg-transparent w-0 group-hover:w-[calc(100%-16px)] group-hover:bg-gradient-to-r group-hover:from-primary/60 group-hover:to-cyan-500/60",
                                        )}
                                    />
                                </Link>
                            ))}

                            {session?.user?.userType === "customer" &&
                                CUSTOMER_LINKS.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.url}
                                        className={cn(
                                            "relative group py-1.5 px-2 rounded-md text-sm transition-all duration-300 flex items-center",
                                            isActiveLink(link.url)
                                                ? "text-primary font-medium"
                                                : "text-foreground/80 hover:text-primary",
                                        )}
                                    >
                                        {link.name}
                                        <span
                                            className={cn(
                                                "absolute bottom-0 left-2 right-2 h-0.5 rounded-full transition-all duration-300",
                                                isActiveLink(link.url)
                                                    ? "bg-gradient-to-r from-primary to-cyan-500 w-[calc(100%-16px)]"
                                                    : "bg-transparent w-0 group-hover:w-[calc(100%-16px)] group-hover:bg-gradient-to-r group-hover:from-primary/60 group-hover:to-cyan-500/60",
                                            )}
                                        />
                                    </Link>
                                ))}

                            {!session && (
                                <Link
                                    href="/login"
                                    className="relative group py-1.5 px-2 rounded-md text-sm transition-all duration-300 flex items-center text-foreground/80 hover:text-primary"
                                >
                                    Login
                                    <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full transition-all duration-300 bg-transparent w-0 group-hover:w-[calc(100%-16px)] group-hover:bg-gradient-to-r group-hover:from-primary/60 group-hover:to-cyan-500/60" />
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="hidden lg:flex items-center justify-center gap-3">
                        {!session && (
                            <Link href="/register">
                                <Button
                                    size="sm"
                                    className="bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-600 transition-all text-white shadow-sm hover:shadow text-sm px-4 py-1.5"
                                >
                                    Get Started
                                </Button>
                            </Link>
                        )}

                        {/* Dashboard Links */}
                        {session?.user?.userType === "customer" && (
                            <Link
                                href="/customer"
                                className={cn(
                                    "relative group py-1.5 px-2 rounded-md text-sm transition-all duration-300 flex items-center",
                                    pathname.startsWith("/customer")
                                        ? "text-primary font-medium"
                                        : "text-foreground/80 hover:text-primary",
                                )}
                            >
                                Dashboard
                                <span
                                    className={cn(
                                        "absolute bottom-0 left-2 right-2 h-0.5 rounded-full transition-all duration-300",
                                        pathname.startsWith("/customer")
                                            ? "bg-gradient-to-r from-primary to-cyan-500 w-[calc(100%-16px)]"
                                            : "bg-transparent w-0 group-hover:w-[calc(100%-16px)] group-hover:bg-gradient-to-r group-hover:from-primary/60 group-hover:to-cyan-500/60",
                                    )}
                                />
                            </Link>
                        )}

                        {session?.user?.userType === "staff" && (
                            <Link
                                href="/admin"
                                className={cn(
                                    "relative group py-1.5 px-2 rounded-md text-sm transition-all duration-300 flex items-center",
                                    pathname.startsWith("/admin")
                                        ? "text-primary font-medium"
                                        : "text-foreground/80 hover:text-primary",
                                )}
                            >
                                Dashboard
                                <span
                                    className={cn(
                                        "absolute bottom-0 left-2 right-2 h-0.5 rounded-full transition-all duration-300",
                                        pathname.startsWith("/admin")
                                            ? "bg-gradient-to-r from-primary to-cyan-500 w-[calc(100%-16px)]"
                                            : "bg-transparent w-0 group-hover:w-[calc(100%-16px)] group-hover:bg-gradient-to-r group-hover:from-primary/60 group-hover:to-cyan-500/60",
                                    )}
                                />
                            </Link>
                        )}

                        {/* User Avatar */}
                        {session && (
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="rounded-full p-0 h-8 w-8 hover:bg-primary/10"
                                    >
                                        <Avatar className="h-7 w-7 rounded-full cursor-pointer border-2 border-primary/20 hover:border-primary/50 transition-all">
                                            <AvatarImage
                                                alt={
                                                    session?.user.customer
                                                        ?.name ||
                                                    session?.user?.staff?.name
                                                }
                                            />
                                            <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-cyan-600/20 rounded-full">
                                                {(
                                                    session?.user.customer
                                                        ?.name ||
                                                    session?.user?.staff?.name
                                                )
                                                    ?.substring(0, 1)
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <UserDropdownContent session={session} />
                            </DropdownMenu>
                        )}
                    </div>

                    {/* Mobile Menu */}
                    <div className="lg:hidden flex items-center">
                        {session && (
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="rounded-full p-0 h-8 w-8 mr-2 hover:bg-primary/10"
                                    >
                                        <Avatar className="h-7 w-7 rounded-full cursor-pointer border-2 border-primary/20">
                                            <AvatarImage
                                                alt={
                                                    session?.user.customer
                                                        ?.name ||
                                                    session?.user?.staff?.name
                                                }
                                            />
                                            <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-cyan-600/20 rounded-full">
                                                {(
                                                    session?.user.customer
                                                        ?.name ||
                                                    session?.user?.staff?.name
                                                )
                                                    ?.substring(0, 1)
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
                            className="text-foreground h-8 w-8"
                        >
                            {isMobileMenuOpen ? (
                                <X size={20} />
                            ) : (
                                <Menu size={20} />
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    ref={menuScope}
                    className="lg:hidden fixed inset-0 top-[57px] z-50 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm border-b border-primary/5"
                    style={{ opacity: 0, transform: "translateX(20px)" }}
                >
                    <div className="p-4 flex flex-col h-full">
                        <div className="space-y-1 mb-4">
                            {NAV_LINKS?.map((link) => (
                                <Link
                                    key={link?.name}
                                    href={link?.url}
                                    onClick={toggleMobileMenu}
                                    className={cn(
                                        "block w-full p-2.5 rounded-lg text-base transition-all",
                                        isActiveLink(link?.url)
                                            ? "bg-gradient-to-r from-primary/10 to-cyan-500/10 border border-primary/10 text-primary font-medium"
                                            : "text-foreground",
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            {session?.user?.userType === "customer" &&
                                CUSTOMER_LINKS.map((link) => (
                                    <Link
                                        key={link?.name}
                                        href={link?.url}
                                        onClick={toggleMobileMenu}
                                        className={cn(
                                            "block w-full p-2.5 rounded-lg text-base transition-all",
                                            isActiveLink(link?.url)
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
                                    className="block w-full p-2.5 rounded-lg text-base transition-all text-foreground"
                                >
                                    Login
                                </Link>
                            )}

                            {session?.user?.userType === "customer" && (
                                <Link
                                    href="/customer"
                                    onClick={toggleMobileMenu}
                                    className={cn(
                                        "block w-full p-2.5 rounded-lg text-base transition-all",
                                        pathname.startsWith("/customer")
                                            ? "bg-gradient-to-r from-primary/10 to-cyan-500/10 border border-primary/10 text-primary font-medium"
                                            : "text-foreground",
                                    )}
                                >
                                    Dashboard
                                </Link>
                            )}

                            {session?.user?.userType === "staff" && (
                                <Link
                                    href="/admin"
                                    onClick={toggleMobileMenu}
                                    className={cn(
                                        "block w-full p-2.5 rounded-lg text-base transition-all",
                                        pathname.startsWith("/admin")
                                            ? "bg-gradient-to-r from-primary/10 to-cyan-500/10 border border-primary/10 text-primary font-medium"
                                            : "text-foreground",
                                    )}
                                >
                                    Dashboard
                                </Link>
                            )}
                        </div>

                        {!session && (
                            <div className="mt-3">
                                <Link
                                    href="/register"
                                    onClick={toggleMobileMenu}
                                >
                                    <Button className="w-full bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-600 py-5 text-base">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        )}

                        <div className="mt-auto">
                            <div className="p-3 rounded-lg bg-gradient-to-r from-primary/5 to-cyan-500/5 border border-primary/10">
                                <p className="text-xs text-muted-foreground mb-1.5">
                                    Need assistance with your printing needs?
                                </p>
                                <p className="text-xs font-medium">
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

function UserDropdownContent({ session }: { session: Session }) {
    return (
        <DropdownMenuContent
            className="min-w-52 rounded-lg mt-2 border-primary/10 shadow-md"
            side="bottom"
            align="end"
            sideOffset={4}
        >
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2.5 p-2.5 text-left border-b border-primary/5 pb-2.5">
                    <Avatar className="h-8 w-8 rounded-lg shadow-sm">
                        <AvatarImage
                            alt={
                                session?.user.customer?.name ||
                                session?.user?.staff?.name
                            }
                        />
                        <AvatarFallback className="rounded-lg bg-gradient-to-br from-primary/20 to-cyan-600/20 text-xs">
                            {(
                                session?.user.customer?.name ||
                                session?.user?.staff?.name
                            )
                                ?.substring(0, 1)
                                .toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-xs leading-tight">
                        <span className="truncate font-semibold text-sm">
                            {session?.user.customer?.name ||
                                session?.user?.staff?.name}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                            {session?.user.customer?.email ||
                                session?.user?.staff?.email}
                        </span>
                    </div>
                </div>
            </DropdownMenuLabel>

            {session.user.userType === "customer" && (
                <DropdownMenuLabel className="bg-gradient-to-r from-primary/5 to-cyan-500/5 rounded-md mx-1.5 my-1.5">
                    <Wallet session={session} />
                </DropdownMenuLabel>
            )}

            {session.user.userType === "customer" && (
                <>
                    <DropdownMenuItem
                        asChild
                        className="p-0 focus:bg-transparent"
                    >
                        <div className="flex w-full items-center p-1.5 pl-2.5 gap-2 cursor-default hover:bg-transparent">
                            <span className="text-xs font-medium">
                                Edit Profile
                            </span>
                            <Link href="/customer/edit" className="ml-auto">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-primary/20 hover:bg-primary/10 hover:text-primary h-7 w-7 p-0"
                                >
                                    <Pen className="h-3 w-3" />
                                </Button>
                            </Link>
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        asChild
                        className="p-0 focus:bg-transparent"
                    >
                        <div className="flex w-full items-center p-1.5 pl-2.5 gap-2 cursor-default hover:bg-transparent">
                            <span className="text-xs font-medium">
                                Change Password
                            </span>
                            <Link
                                href="/customer/changePassword"
                                className="ml-auto"
                            >
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-primary/20 hover:bg-primary/10 hover:text-primary h-7 w-7 p-0"
                                >
                                    <Lock className="h-3 w-3" />
                                </Button>
                            </Link>
                        </div>
                    </DropdownMenuItem>
                </>
            )}

            <DropdownMenuSeparator className="my-1" />

            <DropdownMenuItem
                onClick={() => signOut()}
                className="cursor-pointer mx-1.5 my-1 rounded-md hover:bg-destructive/10 hover:text-destructive text-xs"
            >
                <LogOut className="h-3.5 w-3.5 mr-2" />
                Log out
            </DropdownMenuItem>
        </DropdownMenuContent>
    );
}

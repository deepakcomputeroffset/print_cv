"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useAnimate } from "motion/react-mini";
// import { motion } from "motion/react";
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
import { Lock, LogOut, Pen } from "lucide-react";
import dynamic from "next/dynamic";
import { Button } from "../ui/button";

const NAV_LINKS = [
    { name: "Home", url: "/" },
    { name: "Services", url: "/categories" },
    { name: "Orders", url: "/customer/orders" },
    { name: "Contact us", url: "/#connect" },
];
const Wallet = dynamic(() => import("@/components/wallet"), {
    ssr: false,
});

export default function NavbarLinks({ session }: { session: Session | null }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scope, animate] = useAnimate();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev);
        animate(
            scope.current,
            {
                opacity: isMobileMenuOpen ? 0 : 1,
                y: isMobileMenuOpen ? -20 : 0,
            },
            { duration: 0.4, ease: "easeInOut" },
        );
    };

    return (
        <nav
            className={cn(
                "transition-all duration-1000 font-medium w-full sticky top-0 z-50",
                sourceSerif4.className,
                "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
            )}
        >
            <div className="w-full relative px-[5vw] py-1 mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-10">
                    <Link
                        href="/"
                        className="p-1 min-h-[70px] flex-shrink-0 px-0 py-2 flex items-center space-x-3"
                    >
                        <Image
                            src="/logo.avif"
                            width={32}
                            height={32}
                            alt="Logo"
                            className="h-8 w-8 object-cover"
                        />

                        <span
                            suppressHydrationWarning
                            className={cn(
                                "box-border hover:text-[#32d3f4] font-bold leading-[28px] cursor-pointer break-words transition-colors duration-100 text-[28px] m-0 tracking-[-0.8px]",
                            )}
                        >
                            Printify
                        </span>
                    </Link>
                    <div className="hidden lg:flex items-center space-x-4">
                        {NAV_LINKS.map((link) => (
                            <div key={link.name}>
                                <Link
                                    href={link.url}
                                    className="relative group text-lg tracking-wide"
                                >
                                    {link.name}
                                    <span
                                        className={cn(
                                            "absolute left-0 bottom-0 w-0 h-[1px] origin-left transition-all duration-500 group-hover:w-full",
                                            "bg-black",
                                        )}
                                    />
                                </Link>
                            </div>
                        ))}

                        {!session && (
                            <div>
                                <Link
                                    href={"/login"}
                                    className="relative group text-lg tracking-wide"
                                >
                                    Login
                                    <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white origin-left transition-all duration-500 group-hover:w-full" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                <div className="hidden lg:flex items-center justify-center gap-4">
                    {/* Get Started */}
                    {!session && (
                        <div className="hidden lg:flex box-border justify-end items-center">
                            <Link
                                href="/register"
                                className="box-border text-white text-[16px] font-semibold leading-[30px] inline-flex text-center align-middle cursor-pointer bg-[#D65076] border-solid border-transparent px-6 py-2 rounded-lg border-dominant-color-2 break-words border items-center justify-center mt-0 min-w-[120px] whitespace-nowrap tracking-[-0.2px] hover:scale-105 transition-transform duration-500"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}

                    {/* Customer Dashboard */}
                    {!!session && session?.user?.userType === "customer" && (
                        <div>
                            <Link
                                href={"/customer"}
                                className="relative group text-lg tracking-wide"
                            >
                                Dashboard
                                <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white origin-left transition-all duration-500 group-hover:w-full" />
                            </Link>
                        </div>
                    )}

                    {/* Staff Dashboard */}
                    {!!session && session?.user?.userType === "staff" && (
                        <div>
                            <Link
                                href={"/admin"}
                                className="relative group text-lg tracking-wide"
                            >
                                Dashboard
                                <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white origin-left transition-all duration-500 group-hover:w-full" />
                            </Link>
                        </div>
                    )}

                    {/* Dropdown */}
                    {!!session && (
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="h-8 w-8 rounded-full cursor-pointer">
                                    <AvatarImage
                                        alt={
                                            session?.user.customer
                                                ? session?.user?.customer?.name
                                                : session?.user?.staff?.name
                                        }
                                    />
                                    <AvatarFallback className="rounded-lg text-black">
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
                                className="min-w-56 rounded-lg"
                                side={"top"}
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage
                                                alt={
                                                    session?.user.customer
                                                        ? session?.user
                                                              ?.customer?.name
                                                        : session?.user?.staff
                                                              ?.name
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
                                                    ? session?.user?.customer
                                                          ?.name
                                                    : session?.user?.staff
                                                          ?.name}
                                            </span>
                                            <span className="truncate text-xs">
                                                {session?.user.customer
                                                    ? session?.user?.customer
                                                          ?.email
                                                    : session?.user?.staff
                                                          ?.email}
                                            </span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {!!session &&
                                    session.user.userType === "customer" && (
                                        <>
                                            <DropdownMenuLabel>
                                                <Wallet session={session} />
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                        </>
                                    )}
                                {!!session &&
                                    session.user.userType === "customer" && (
                                        <>
                                            <DropdownMenuLabel>
                                                <div className="flex gap-2 items-center">
                                                    <span>Edit Profile</span>

                                                    <Link
                                                        href="/customer/edit"
                                                        className="ml-auto"
                                                    >
                                                        <Button
                                                            variant={
                                                                "secondary"
                                                            }
                                                            size={"sm"}
                                                        >
                                                            <Pen />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                        </>
                                    )}

                                {/* Change Password */}
                                {!!session &&
                                    session.user.userType === "customer" && (
                                        <>
                                            <DropdownMenuLabel>
                                                <div className="flex gap-2 items-center">
                                                    <span>Change Password</span>

                                                    <Link
                                                        href="/customer/changePassword"
                                                        className="ml-auto"
                                                    >
                                                        <Button
                                                            variant={
                                                                "secondary"
                                                            }
                                                            size={"sm"}
                                                        >
                                                            <Lock />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                        </>
                                    )}

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

                <div className="lg:hidden">
                    <button
                        className="p-2 flex items-center"
                        onClick={toggleMobileMenu}
                    >
                        <div className="relative w-6 h-5 flex flex-col justify-between">
                            {[0, 1, 2].map((i) => (
                                <span
                                    key={i}
                                    className={cn(
                                        "bg-white w-full h-[2px] max-h-[2px] min-h-[2px] transition-all duration-300",
                                        isMobileMenuOpen &&
                                            i === 0 &&
                                            "rotate-45 translate-y-[9px]",
                                        isMobileMenuOpen &&
                                            i === 1 &&
                                            "opacity-0",
                                        isMobileMenuOpen &&
                                            i === 2 &&
                                            "-rotate-45 -translate-y-[9px]",
                                    )}
                                />
                            ))}
                        </div>
                    </button>
                </div>
            </div>
            <div
                ref={scope}
                className="z-50 lg:hidden absolute top-20 left-0 w-full bg-dominant-color p-4 shadow-md opacity-0"
            >
                <ul className="flex flex-col space-y-4">
                    {NAV_LINKS.map((link) => (
                        <li key={link.name}>
                            <Link
                                href={link.url}
                                className="relative group text-lg tracking-wide"
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                    {/* Login */}
                    {!session && (
                        <li>
                            <Link
                                href={"/login"}
                                className="relative group text-lg tracking-wide"
                            >
                                Login
                                <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white origin-left transition-all duration-500 group-hover:w-full" />
                            </Link>
                        </li>
                    )}
                    {/* Get Started */}
                    {!session && (
                        <li>
                            <Link
                                href="/register"
                                className="block w-full mt-4 bg-dominant-color-2 hover:bg-crimson-700 text-white py-3 px-5 rounded-md transition duration-300 text-xl font-bold"
                            >
                                Get Started
                            </Link>
                        </li>
                    )}
                    {/* Customer Dashboard */}
                    {!!session && session?.user?.userType === "customer" && (
                        <li>
                            <Link
                                href={"/customer"}
                                className="relative group text-lg tracking-wide"
                            >
                                Dashboard
                            </Link>
                        </li>
                    )}

                    {/* Staff Dashboard */}
                    {!!session && session?.user?.userType === "staff" && (
                        <li>
                            <Link
                                href={"/admin"}
                                className="relative group text-lg tracking-wide"
                            >
                                Dashboard
                            </Link>
                        </li>
                    )}

                    {/* Dropdown */}
                    {!!session && (
                        <li>
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className="h-8 w-8 rounded-full cursor-pointer">
                                        <AvatarImage
                                            alt={
                                                session?.user.customer
                                                    ? session?.user?.customer
                                                          ?.name
                                                    : session?.user?.staff?.name
                                            }
                                        />
                                        <AvatarFallback className="rounded-lg text-black">
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
                                    className="min-w-56 rounded-lg"
                                    side={"bottom"}
                                    align="end"
                                    sideOffset={4}
                                >
                                    <DropdownMenuLabel className="p-0 font-normal">
                                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                            {/* Avatar */}
                                            <Avatar className="h-8 w-8 rounded-lg">
                                                <AvatarImage
                                                    alt={
                                                        session?.user.customer
                                                            ? session?.user
                                                                  ?.customer
                                                                  ?.name
                                                            : session?.user
                                                                  ?.staff?.name
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
                                            {/* Name and Email */}
                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                <span className="truncate font-semibold">
                                                    {session?.user.customer
                                                        ? session?.user
                                                              ?.customer?.name
                                                        : session?.user?.staff
                                                              ?.name}
                                                </span>
                                                <span className="truncate text-xs">
                                                    {session?.user.customer
                                                        ? session?.user
                                                              ?.customer?.email
                                                        : session?.user?.staff
                                                              ?.email}
                                                </span>
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />

                                    {/* Wallet */}
                                    {!!session &&
                                        session.user.userType ===
                                            "customer" && (
                                            <>
                                                <DropdownMenuLabel>
                                                    <Wallet session={session} />
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                            </>
                                        )}

                                    {/* Edit Profile */}
                                    {!!session &&
                                        session.user.userType ===
                                            "customer" && (
                                            <>
                                                <DropdownMenuLabel>
                                                    <div className="flex gap-2 items-center">
                                                        <span>
                                                            Edit Profile
                                                        </span>

                                                        <Link
                                                            href="/customer/edit"
                                                            className="ml-auto"
                                                        >
                                                            <Button
                                                                variant={
                                                                    "secondary"
                                                                }
                                                                size={"sm"}
                                                            >
                                                                <Pen />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                            </>
                                        )}

                                    {/* Change Password */}
                                    {!!session &&
                                        session.user.userType ===
                                            "customer" && (
                                            <>
                                                <DropdownMenuLabel>
                                                    <div className="flex gap-2 items-center">
                                                        <span>
                                                            Change Password
                                                        </span>

                                                        <Link
                                                            href="/customer/changePassword"
                                                            className="ml-auto"
                                                        >
                                                            <Button
                                                                variant={
                                                                    "secondary"
                                                                }
                                                                size={"sm"}
                                                            >
                                                                <Lock />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                            </>
                                        )}

                                    <DropdownMenuItem
                                        onClick={() => signOut()}
                                        className="cursor-pointer"
                                    >
                                        <LogOut />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}

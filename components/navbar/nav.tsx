"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useAnimate } from "motion/react-mini";
import { motion } from "motion/react";
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
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";
import { signOut } from "next-auth/react";
import { LogOut, RotateCw } from "lucide-react";

const NAV_LINKS = [
    { name: "Our Service", url: "/customer/categories" },
    { name: "Contact Us", url: "/#connect" },
];

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

    const {
        data: wallet,
        refetch,
        isLoading,
    } = useWallet(session?.user?.customer?.wallet);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 250);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "transition-all duration-1000 font-medium w-full sticky top-0 z-50",
                sourceSerif4.className,
                isScrolled
                    ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
                    : "bg-dominant-color text-white",
            )}
        >
            <div className="w-full relative px-[16px] max-w-customHaf lg:max-w-custom  mx-auto p-4 flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, transform: "translateY(-20px)" }} // Initial position above
                    animate={{
                        opacity: 1,
                        transform: "translateY(0px)",
                        transition: {
                            duration: 0.8,
                            ease: "easeInOut",
                        },
                    }}
                    className="flex items-center space-x-10"
                >
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
                            className={cn(
                                "box-border hover:text-[#32d3f4] font-bold leading-[28px] cursor-pointer break-words transition-colors duration-500 text-[28px] m-0 tracking-[-0.8px]",
                                isScrolled ? "text-black" : "text-white",
                            )}
                        >
                            Printify
                        </span>
                    </Link>
                    <div className="hidden lg:flex items-center space-x-8">
                        {NAV_LINKS.map((link, index) => (
                            <motion.div
                                key={link.name}
                                initial={{
                                    opacity: 0,
                                    transform: "translateY(-20px)",
                                }}
                                animate={{
                                    opacity: 1,
                                    transform: "translateY(0px)",
                                    transition: {
                                        duration: 0.8,
                                        delay: 0.1 + index * 0.1,
                                        ease: "easeInOut",
                                    },
                                }}
                            >
                                <Link
                                    href={link.url}
                                    className="relative group text-lg tracking-wide"
                                >
                                    {link.name}
                                    <span
                                        className={cn(
                                            "absolute left-0 bottom-0 w-0 h-[1px] origin-left transition-all duration-500 group-hover:w-full",
                                            isScrolled
                                                ? "bg-black"
                                                : "bg-white",
                                        )}
                                    />
                                </Link>
                            </motion.div>
                        ))}

                        {!session && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    transform: "translateY(-20px)",
                                }}
                                animate={{
                                    opacity: 1,
                                    transform: "translateY(0px)",
                                    transition: {
                                        duration: 0.8,
                                        delay: 0.4,
                                        ease: "easeInOut",
                                    },
                                }}
                            >
                                <Link
                                    href={"/login"}
                                    className="relative group text-lg tracking-wide"
                                >
                                    Login
                                    <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white origin-left transition-all duration-500 group-hover:w-full" />
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                <div className="flex items-center justify-center gap-10">
                    {/* Get Started */}
                    {!session && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                transform: "translateY(-20px)",
                            }}
                            animate={{
                                opacity: 1,
                                transform: "translateY(0px)",
                                transition: {
                                    duration: 0.8,
                                    ease: "easeInOut",
                                },
                            }}
                            className="hidden lg:flex box-border justify-end items-center"
                        >
                            <Link
                                href="/register"
                                className="box-border text-white text-[20px] font-semibold leading-[30px] inline-flex text-center align-middle cursor-pointer bg-dominant-color-2 border-solid border-transparent px-6 py-3 m-2 rounded-lg border-dominant-color-2 break-words border items-center justify-center mt-0 min-w-[120px] whitespace-nowrap tracking-[-0.2px] hover:scale-105 transition-transform duration-500"
                            >
                                Get Started
                            </Link>
                        </motion.div>
                    )}

                    {/* Customer Dashboard */}
                    {!!session && session?.user?.userType === "customer" && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                transform: "translateY(-20px)",
                            }}
                            animate={{
                                opacity: 1,
                                transform: "translateY(0px)",
                                transition: {
                                    duration: 0.8,
                                    delay: 0.1,
                                    ease: "easeInOut",
                                },
                            }}
                        >
                            <Link
                                href={"/customer"}
                                className="relative group text-lg tracking-wide"
                            >
                                Dashboard
                                <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white origin-left transition-all duration-500 group-hover:w-full" />
                            </Link>
                        </motion.div>
                    )}

                    {/* Staff Dashboard */}
                    {!!session && session?.user?.userType === "staff" && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                transform: "translateY(-20px)",
                            }}
                            animate={{
                                opacity: 1,
                                transform: "translateY(0px)",
                                transition: {
                                    duration: 0.8,
                                    delay: 0.1,
                                    ease: "easeInOut",
                                },
                            }}
                        >
                            <Link
                                href={"/admin"}
                                className="relative group text-lg tracking-wide"
                            >
                                Dashboard
                                <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white origin-left transition-all duration-500 group-hover:w-full" />
                            </Link>
                        </motion.div>
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
                                                    isLoading
                                                        ? "animate-spin"
                                                        : ""
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
                </ul>

                <Link
                    href={"#"}
                    className="block w-full mt-4 bg-dominant-color-2 hover:bg-crimson-700 text-white py-3 px-5 rounded-md transition duration-300 text-xl font-bold"
                >
                    Get Started
                </Link>
            </div>
        </nav>
    );
}

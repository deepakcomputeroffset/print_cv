"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useAnimate } from "motion/react-mini";
import { motion } from "motion/react";
import { sourceSerif4 } from "@/lib/font";

const NAV_LINKS = ["Our Services", "Pricing Plans", "Contact Us"];

export default function Navbar() {
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
            className={`${sourceSerif4.className} bg-dominant-color text-white w-full font-medium`}
        >
            <div className="w-full px-[16px] max-w-customHaf lg:max-w-custom  mx-auto p-4 flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, transform: "translateY(-20px)" }} // Initial position above
                    animate={{
                        opacity: 1,
                        transform: "translateY(0px)",
                        transition: {
                            duration: 0.8,
                            delay: 0.2,
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

                        <span className="box-border text-white hover:text-[#32d3f4] font-bold leading-[28px] cursor-pointer break-words transition-colors duration-500 text-[28px] m-0 tracking-[-0.8px]">
                            Printify
                        </span>
                    </Link>
                    <div className="hidden lg:flex items-center space-x-8">
                        {NAV_LINKS.map((text, index) => (
                            <motion.div
                                key={text}
                                initial={{
                                    opacity: 0,
                                    transform: "translateY(-20px)",
                                }}
                                animate={{
                                    opacity: 1,
                                    transform: "translateY(0px)",
                                    transition: {
                                        duration: 0.8,
                                        delay: 0.4 + index * 0.2,
                                        ease: "easeInOut",
                                    },
                                }} // Delay based on index
                            >
                                <Link
                                    key={text}
                                    href={`/${text.toLowerCase().replace(/\s+/g, "-")}`}
                                    className="relative group text-lg tracking-wide"
                                >
                                    {text}
                                    <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white origin-left transition-all duration-500 group-hover:w-full" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, transform: "translateY(-20px)" }} // Initial position above
                    animate={{
                        opacity: 1,
                        transform: "translateY(0px)",
                        transition: {
                            duration: 0.8,
                            delay: 0.6,
                            ease: "easeInOut",
                        },
                    }}
                    className="hidden lg:flex box-border justify-end"
                >
                    <Link
                        href="#"
                        className="box-border text-white text-[20px] font-semibold leading-[30px] inline-flex text-center align-middle cursor-pointer bg-dominant-color-2 border-solid border-transparent px-6 py-3 m-2 rounded-lg border-dominant-color-2 break-words border items-center justify-center mt-0 min-w-[120px] whitespace-nowrap tracking-[-0.2px] hover:scale-105 transition-transform duration-500"
                    >
                        Get Started
                    </Link>
                </motion.div>
                <div className="lg:hidden">
                    <button
                        className="p-2 flex items-center"
                        onClick={toggleMobileMenu}
                        aria-expanded={isMobileMenuOpen}
                        aria-label="Toggle menu"
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
                    {NAV_LINKS.map((text) => (
                        <li key={text}>
                            <Link
                                href={`/${text.toLowerCase().replace(/\s+/g, "-")}`}
                                className="relative group text-lg tracking-wide"
                            >
                                {text}
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

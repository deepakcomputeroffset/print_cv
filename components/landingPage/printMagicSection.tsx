"use client";

import { sourceSerif4 } from "@/lib/font";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Link from "next/link";

export default function PrintMagicSection() {
    return (
        <section
            className={cn(
                "relative overflow-hidden h-full bg-[#eda371] flex justify-center items-center py-20",
                sourceSerif4.className,
            )}
        >
            <div className="relative max-w-customHaf lg:max-w-custom px-4 w-full h-full flex items-center justify-between bg-transparent z-10 flex-col xl:flex-row space-y-16">
                <div className="max-w-xl">
                    <motion.h1
                        initial={{ opacity: 0 }}
                        whileInView={{
                            opacity: 1,
                            transition: {
                                duration: 0.8,
                                ease: "easeInOut",
                            },
                        }}
                        viewport={{ once: true }}
                        className="mb-[56px] text-[88px] leading-[79.2px] tracking-[-0.52px] font-normal text-black"
                    >
                        Print Magic Awaits
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{
                            opacity: 1,
                            transition: {
                                duration: 0.8,
                                ease: "easeInOut",
                            },
                        }}
                        viewport={{ once: true }}
                        className="inline-flex w-[85%] mb-[32px] text-[20px] leading-[30px] tracking-[-0.2px] text-black"
                    >
                        Join the printing revolution! Our services are tailored
                        to meet your wildest printing dreams. Let’s make your
                        vision a reality!
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{
                            opacity: 1,
                            transition: {
                                duration: 0.8,
                                ease: "easeInOut",
                            },
                        }}
                        viewport={{ once: true }}
                        className="flex box-border justify-start items-center"
                    >
                        <Link
                            href="#"
                            className="box-border text-white text-[20px] font-semibold leading-[30px] inline-flex text-center align-middle cursor-pointer bg-dominant-color-2 border-solid border-transparent px-6 py-3 m-2 rounded-lg border-dominant-color-2 break-words border items-center justify-center mt-0 min-w-[120px] whitespace-nowrap tracking-[-0.2px] hover:scale-105 transition-transform duration-500 max-h-16"
                        >
                            Join Us
                        </Link>
                    </motion.div>
                </div>
                <div className="justify-end pt-[64px] px-[40px] pb-[40px] rounded-xl bg-dominant-color max-w-xl">
                    <div className="-mt-[96px]">
                        <h4 className="inline-flex px-[24px] py-[12px] rounded-[8px] shadow-[4px_6px_0px_0px_#000] mb-[40px] text-[20px] leading-[30px] tracking-[-0.2px] bg-[#eda371]">
                            Creative Genius
                        </h4>
                    </div>
                    <motion.h4
                        initial={{ opacity: 0 }}
                        whileInView={{
                            opacity: 1,
                            transition: {
                                duration: 0.8,
                                ease: "easeInOut",
                            },
                        }}
                        viewport={{ once: true }}
                        className="text-[rgb(255,_255,_255)] text-[20px] leading-[30px] tracking-[-0.2px]"
                    >
                        Meet our team of printing wizards who turn your ideas
                        into reality. With years of experience, they know how to
                        make your prints shine!
                    </motion.h4>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{
                            opacity: 1,
                            transition: {
                                duration: 0.8,
                                ease: "easeInOut",
                            },
                        }}
                        viewport={{ once: true }}
                        className="mt-[20px] bg-[rgb(114,_0,_38)]"
                    >
                        <p className="text-[rgb(255,_255,_255)] text-[20px] leading-[30px] tracking-[-0.2px]">
                            Max Print
                        </p>
                        <p className="text-[rgb(255,_255,_255)] text-[20px] leading-[30px] tracking-[-0.2px]">
                            Chief Wizard
                        </p>
                    </motion.div>
                </div>
            </div>
            <div className="absolute top-0 right-0 min-w-[50%] hidden lg:block w-1/2 h-full">
                <img
                    src="https://images.unsplash.com/photo-1622595659454-2de32ab192fc?ixid=M3w0Mzc5fDB8MXxzZWFyY2h8MTl8fHByaW50c3xlbnwwfDB8fHwxNzM5ODEwMjE4fDA&amp;ixlib=rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=1200&amp;q=80&amp;e=1739875378&amp;s=wWzakFFB4guTAM9CDmv75BWNFQGSLE8l5EmdkQZUxwA"
                    className="absolute top-0 right-0 w-full h-full object-cover rounded-none"
                />
            </div>
        </section>
    );
}

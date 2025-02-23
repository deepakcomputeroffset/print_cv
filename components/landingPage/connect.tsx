"use client";
import { sourceSerif4 } from "@/lib/font";
import { cn } from "@/lib/utils";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export function ConnectSection() {
    const connects = [
        {
            name: "Facebook",
            icon: Facebook,
            url: "",
        },
        {
            name: "Instagram",
            icon: Instagram,
            url: "",
        },
        {
            name: "Youtube",
            icon: Youtube,
            url: "",
        },
        {
            name: "Twitter",
            icon: Twitter,
            url: "",
        },
        {
            name: "LinkedIn",
            icon: Linkedin,
            url: "",
        },
    ];
    return (
        <section
            className={cn(
                "py-10 max-w-customHaf lg:max-w-custom mx-auto",
                sourceSerif4.className,
            )}
        >
            <div className="relative px-4">
                <div>
                    <motion.h3
                        initial={{
                            opacity: 0,
                        }}
                        whileInView={{
                            opacity: 1,
                            transition: {
                                duration: 0.8,
                                ease: "easeInOut",
                            },
                        }}
                        viewport={{ once: true }}
                        className="inline-flex mb-[56px] px-[24px] py-2 md:py-[18px] shadow-[6px_8px_0px_0px_#000] rounded-2xl text-5xl md:text-7xl tracking-[-0.52px] bg-[#EDA371] text-black"
                    >
                        Connect
                    </motion.h3>
                </div>
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="relative grid grid-cols-2 sm:grid-cols-3 gap-3 place-items-center">
                        {connects.map((connect, idx) => (
                            <Link
                                href={connect.url}
                                key={idx}
                                className="w-full max-w-[200px] max-h-[200px] px-10 py-8  gap-6 rounded-[16px] bg-[#e8ccd2] flex items-center justify-center flex-col"
                            >
                                <connect.icon className="w-20 h-16 text-black bg-[#e8ccd2]" />
                                <h4 className="text-center text-[20px] leading-[30px]">
                                    {connect.name}
                                </h4>
                            </Link>
                        ))}
                    </div>

                    <div className="w-full lg:w-1/3 md:ml-auto flex justify-center items-center">
                        <p className="mb-0 text-center lg:text-right text-[28px] leading-8 tracking-[-0.8px]">
                            Join us on social media for the latest updates,
                            tips, and a sprinkle of printing magic!
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

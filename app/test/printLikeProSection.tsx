"use client";
import { sourceSerif4 } from "@/lib/font";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Link from "next/link";

export default function PrintLikeProSection() {
    return (
        <section
            className={cn(
                "mt-20 lg:mt-0 pt-[80px] pb-[80px] text-[16px] leading-[24px] font-normal bg-dominant-color text-white px-4",
                sourceSerif4.className,
            )}
        >
            <div
                className={cn(
                    "max-w-customHaf lg:max-w-custom mx-auto lg:grid lg:grid-cols-2 lg:grid-rows-2 space-y-20 lg:space-y-0",
                )}
            >
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
                >
                    <h2
                        className={cn(
                            "mb-[16px] text-8xl md:text-[121.6px] mt-0 leading-[103.36px] font-normal tracking-[-0.6px]",
                        )}
                    >
                        Print Like a Pro!
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{
                        opacity: 1,
                        transition: {
                            duration: 0.8,
                            delay: 0.2,
                            ease: "easeInOut",
                        },
                    }}
                    viewport={{ once: true }}
                    className={cn(
                        "flex items-center justify-center mt-0 mb-[16px] px-4",
                    )}
                >
                    <img
                        src="https://images.unsplash.com/photo-1620907369757-ca0e2ae38256?ixid=M3w0Mzc5fDB8MXxzZWFyY2h8MjF8fHByaW50c3xlbnwwfDB8fHwxNzM5ODEwMjE4fDA&amp;ixlib=rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=1200&amp;q=80&amp;e=1739875378&amp;s=raSz-wMjEduZ0wYRkgB_hG4bMwCFtifIPMS61hbhkxY"
                        className={cn(
                            "w-[450px] h-[400px] lg:w-[200px] lg:h-[200px] object-cover shadow-[6px_8px_0px_0px_#000] rounded-xl rotate-[4deg]",
                        )}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{
                        opacity: 1,
                        transition: {
                            duration: 0.8,
                            delay: 0.4,
                            ease: "easeInOut",
                        },
                    }}
                    viewport={{ once: true }}
                    className="flex box-border justify-center items-center"
                >
                    <Link
                        href="#"
                        className="box-border text-white text-[20px] font-semibold leading-[30px] inline-flex text-center align-middle cursor-pointer bg-dominant-color-2 border-solid border-transparent px-6 py-3 m-2 rounded-lg border-dominant-color-2 break-words border items-center justify-center mt-0 min-w-[120px] whitespace-nowrap tracking-[-0.2px] hover:scale-105 transition-transform duration-500 max-h-16"
                    >
                        Get Started
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{
                        opacity: 1,
                        transition: {
                            duration: 0.8,
                            delay: 0.6,
                            ease: "easeInOut",
                        },
                    }}
                    viewport={{ once: true }}
                    className={cn(
                        "mb-0 text-center lg:text-start self-center place-self-center",
                    )}
                >
                    <p
                        className={cn(
                            "text-[28px] mt-0 mb-[16px] leading-[42px] font-normal tracking-[-0.8px]",
                        )}
                    >
                        Transform your ideas into stunning prints. Our services
                        are designed to make your projects pop and leave a
                        lasting impression.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

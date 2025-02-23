"use client";
import { sourceSerif4 } from "@/lib/font";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Link from "next/link";

export default function GetStartedSection() {
    return (
        <section
            className={cn(
                "lg:pb-10 bg-white text-charcoal-black text-[16px] m-0 leading-[24px] font-normal px-4",
                sourceSerif4.className,
            )}
        >
            <div className="max-w-customHaf lg:max-w-custom px-4 xl:px-0 w-full mx-auto">
                <div className="relative">
                    <motion.h2
                        initial={{
                            opacity: 0,
                        }}
                        whileInView={{
                            opacity: 1,
                            transition: {
                                duration: 0.8,
                                delay: 0.4,
                                ease: "easeInOut",
                            },
                        }}
                        viewport={{ once: true }}
                        className="text-8xl leading-[1.0336] tracking-[-0.6px] font-medium lg:font-normal mb-[56px] text-black origin-top-left"
                    >
                        Get Started
                    </motion.h2>
                    {/* <motion.h3
                        initial={{
                            opacity: 0,
                        }}
                        whileInView={{
                            opacity: 1,
                            transition: {
                                duration: 0.8,
                                delay: 0.2,
                                ease: "easeInOut",
                            },
                        }}
                        viewport={{ once: true }}
                        className="inline-flex mb-[56px] px-[24px] py-[18px] shadow-[6px_8px_0px_0px_#000] rounded-2xl rotate-[-4deg] text-4xl sm:text-7xl leading-[64.8px] font-normal tracking-[-0.52px] bg-[#EDA371] text-black"
                    >
                        Today!
                    </motion.h3> */}
                    <div className="relative z-10 flex lg:w-2/5 text-black text-center">
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
                                    delay: 0.6,
                                    ease: "easeInOut",
                                },
                            }}
                        >
                            <Link
                                href="#"
                                className="box-border text-white text-base md:text-[20px] font-semibold leading-[30px] inline-flex text-center align-middle cursor-pointer bg-dominant-color-2 border-solid border-transparent px-3 md:px-6 py-3 m-2 rounded-lg border-dominant-color-2 break-words border items-center justify-center mt-0 md:in-w-[120px] whitespace-nowrap tracking-[-0.2px] hover:scale-105 transition-transform duration-500"
                            >
                                Contact Us
                            </Link>
                        </motion.div>
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
                                    delay: 0.6,
                                    ease: "easeInOut",
                                },
                            }}
                        >
                            <Link
                                href="#"
                                className="box-border text-white text-base md:text-[20px] font-semibold leading-[30px] inline-flex text-center align-middle cursor-pointer bg-dominant-color-2 border-solid border-transparent px-3 md:px-6 py-3 m-2 rounded-lg border-dominant-color-2 break-words border items-center justify-center mt-0 md:min-w-[120px] whitespace-nowrap tracking-[-0.2px] hover:scale-105 transition-transform duration-500"
                            >
                                View Gallery
                            </Link>
                        </motion.div>
                    </div>

                    <div className="max-w-2xl lg:max-w-full text-[16px] m-0 leading-[24px] font-normal flex gap-6 lg:gap-10 flex-col">
                        <div className='mt-11 lg:-mt-[96px] lg:pt-[104px] relative  text-white text-[16px] leading-[24px] font-normal lg:before:content-[""] lg:before:absolute lg:before:w-1/2 lg:before:h-[140px] lg:before:top-0 lg:before:right-0 lg:before:rounded-tr-xl lg:before:bg-dominant-color lg:after:content-[""] lg:after:absolute lg:after:top-0 lg:after:right-[15%] lg:after:w-[43%] lg:after:h-[110px] lg:after:bg-dominant-color lg:after:-skew-x-[45deg]'>
                            <div className="flex flex-col lg:flex-row relative !rounded-[24px] bg-dominant-color">
                                <div className="w-full lg:w-1/2 p-10 md:p-[96px]">
                                    <motion.img
                                        initial={{
                                            opacity: 0,
                                        }}
                                        whileInView={{
                                            opacity: 1,
                                            transition: {
                                                duration: 0.8,
                                                delay: 0.4,
                                                ease: "easeInOut",
                                            },
                                        }}
                                        viewport={{ once: true }}
                                        src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixid=M3w0Mzc5fDB8MXxzZWFyY2h8M3x8cHJpbnRzfGVufDB8MHx8fDE3Mzk4MTAyMTh8MA&ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80&amp;e=1739875378&amp;s=641e_j1U7RJY8YItIYgKCCSuCqJe9nGZc5HDp7T7ml8"
                                        className="h-[300px] w-full shadow-[6px_8px_0px_0px_#000] object-cover rounded-xl"
                                    />
                                </div>
                                <div className="w-full lg:w-1/2 px-10 md:px-[96px] lg:pl-0 pb-[96px] text-charcoal-black text-[16px] m-0 leading-[24px] font-normal flex flex-col justify-center gap-5">
                                    <motion.h4
                                        initial={{
                                            opacity: 0,
                                        }}
                                        whileInView={{
                                            opacity: 1,
                                            transition: {
                                                duration: 0.8,
                                                delay: 0.6,
                                                ease: "easeInOut",
                                            },
                                        }}
                                        viewport={{ once: true }}
                                        className="text-white  text-6xl md:text-[88px] leading-[79.2px] font-normal tracking-[-0.52px] text-start"
                                    >
                                        Prints
                                    </motion.h4>

                                    <motion.p
                                        initial={{
                                            opacity: 0,
                                        }}
                                        whileInView={{
                                            opacity: 1,
                                            transition: {
                                                duration: 0.8,
                                                delay: 0.8,
                                                ease: "easeInOut",
                                            },
                                        }}
                                        viewport={{ once: true }}
                                        className="text-white text-right lg:text-left text-[20px] mt-0 mx-0 mb-[16px] leading-[30px] font-normal tracking-[-0.2px]"
                                    >
                                        From business cards to banners, we make
                                        your ideas stand out with vibrant colors
                                        and sharp details. Quality prints, just
                                        the way you imagined!
                                    </motion.p>
                                </div>
                            </div>
                        </div>
                        <div className='lg:pt-[104px] relative text-white text-[16px] leading-[24px] font-normal lg:before:content-[""] lg:before:absolute lg:before:w-1/2 lg:before:h-[140px] lg:before:top-0 lg:before:right-0 lg:before:rounded-tr-xl lg:before:bg-dominant-color-2 lg:after:content-[""] lg:after:absolute lg:after:top-0 lg:after:right-[15%] lg:after:w-[43%] lg:after:h-[110px] lg:after:bg-dominant-color-2 lg:after:-skew-x-[45deg]'>
                            <div className="flex flex-col lg:flex-row relative rounded-[24px] bg-dominant-color-2">
                                <div className="w-full lg:w-1/2 p-10 md:p-[96px]">
                                    <motion.img
                                        initial={{
                                            opacity: 0,
                                        }}
                                        whileInView={{
                                            opacity: 1,
                                            transition: {
                                                duration: 0.8,
                                                delay: 0.4,
                                                ease: "easeInOut",
                                            },
                                        }}
                                        viewport={{ once: true }}
                                        src="https://images.unsplash.com/photo-1580437050166-a25d6951d88e?ixid=M3w0Mzc5fDB8MXxzZWFyY2h8MjV8fHByaW50c3xlbnwwfDB8fHwxNzM5ODEwMjE4fDA&ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80&e=1739875378&s=7R5FpsueYbEqJn52cp3Y8i7bu4tVNOdFcd_DLzxBZKw"
                                        className="h-[300px] w-full shadow-[6px_8px_0px_0px_#000] object-cover rounded-xl"
                                    />
                                </div>
                                <div className="w-full lg:w-1/2 px-10 md:px-[96px] lg:pl-0 pb-[96px] text-charcoal-black text-[16px] m-0 leading-[24px] font-normal flex justify-center flex-col gap-5">
                                    <motion.h4
                                        initial={{
                                            opacity: 0,
                                        }}
                                        whileInView={{
                                            opacity: 1,
                                            transition: {
                                                duration: 0.8,
                                                delay: 0.6,
                                                ease: "easeInOut",
                                            },
                                        }}
                                        viewport={{ once: true }}
                                        className="text-white text-start text-6xl md:text-[88px] mt-0 mx-0 mb-[8px] leading-[79.2px] font-normal tracking-[-0.52px]"
                                    >
                                        Support
                                    </motion.h4>

                                    <motion.p
                                        initial={{
                                            opacity: 0,
                                        }}
                                        whileInView={{
                                            opacity: 1,
                                            transition: {
                                                duration: 0.8,
                                                delay: 0.8,
                                                ease: "easeInOut",
                                            },
                                        }}
                                        viewport={{ once: true }}
                                        className="text-white text-right lg:text-left text-[20px] mt-0 mx-0 mb-[16px] leading-[30px] font-normal tracking-[-0.2px]"
                                    >
                                        Our friendly team is here to guide you
                                        every step of the way, ensuring a smooth
                                        and stress-free experience. No question
                                        is too small or too silly—we’re always
                                        happy to help!
                                    </motion.p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

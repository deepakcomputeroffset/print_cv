"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { sourceSerif4 } from "@/lib/font";

const HeroSection = () => {
    return (
        <section
            className={`w-full box-border relative break-words bg-[50%_50%] bg-no-repeat bg-cover pt-16 pb-16 md:pt-20 md:pb-20 lg:pt-[80px] lg:pb-[80px] text-charcoal-black text-[16px] m-0 leading-[24px] font-normal bg-dominant-color flex items-center justify-center ${sourceSerif4.className}`}
        >
            <div className="box-border w-full px-4 md:px-6 lg:px-[16px] max-w-customHaf lg:max-w-custom relative break-words flex items-center justify-center">
                <div className="box-border flex flex-col lg:flex-row gap-10 md:gap-20 lg:gap-0 items-center justify-center -mx-4 md:-mx-6 lg:-mx-[16px]">
                    {/* Left */}
                    <div className="box-border w-full lg:w-7/12 max-w-full px-3 md:px-6 lg:px-[16px] relative flex flex-col break-words bg-transparent bg-clip-border rounded-[4px] justify-center">
                        <div className="box-border flex lg:block text-center lg:text-start flex-col items-center justify-center">
                            <motion.h2
                                initial={{
                                    opacity: 0,
                                    transform: "translateY(-50px)",
                                }}
                                whileInView={{
                                    opacity: 1,
                                    transform: "translateY(0px)",
                                    transition: {
                                        duration: 0.8,
                                        ease: "easeInOut",
                                    },
                                }}
                                viewport={{ once: true }}
                                className="mt-0 mb-8 md:mb-16 font-normal text-5xl sm:text-6xl md:text-8xl lg:text-[121.6px] leading-[1.2] md:leading-[1.1] lg:leading-[103.36px] break-words text-white tracking-[-0.6px]"
                            >
                                Print Magic
                            </motion.h2>

                            <motion.p
                                initial={{
                                    opacity: 0,
                                    transform: "translateY(-50px)",
                                }}
                                whileInView={{
                                    opacity: 1,
                                    transform: "translateY(0px)",
                                    transition: {
                                        duration: 0.8,
                                        ease: "easeInOut",
                                    },
                                }}
                                viewport={{ once: true }}
                                className="text-white bg-[#720026] mt-0 mb-4 md:mb-8 leading-7 md:leading-[35px] break-words font-normal w-full text-xl sm:text-2xl lg:text-[25px] tracking-[0.1px]"
                            >
                                Turn ideas into stunning, high-quality prints
                                with rich colors and sharp details. From
                                business materials to custom designs, we make
                                every print stand out!
                            </motion.p>

                            <motion.div
                                initial={{
                                    opacity: 0,
                                    transform: "translateY(-50px)",
                                }}
                                whileInView={{
                                    opacity: 1,
                                    transform: "translateY(0px)",
                                    transition: {
                                        duration: 0.8,
                                        ease: "easeInOut",
                                    },
                                }}
                                viewport={{ once: true }}
                                className="w-fit"
                            >
                                <Link
                                    href={"#"}
                                    className="text-white text-xl font-semibold leading-6 md:leading-[30px] inline-flex text-center align-middle cursor-pointer bg-dominant-color-2 border border-solid border-dominant-color-2 px-6 py-3 md:px-8 md:py-4 rounded-xl transition duration-500 ease-in-out m-2 hover:scale-105"
                                >
                                    See More
                                </Link>
                            </motion.div>
                        </div>
                    </div>

                    {/* Right */}
                    <div className="box-border w-full lg:w-5/12 max-w-full px-4 md:px-6 lg:px-4 relative flex min-w-0 bg-transparent justify-center mt-8 md:mt-0">
                        <motion.div
                            initial={{
                                opacity: 0,
                                transform: "translateY(-50px)",
                            }}
                            whileInView={{
                                opacity: 1,
                                transform: "translateY(0px)",
                                transition: {
                                    duration: 1,
                                    ease: "easeInOut",
                                },
                            }}
                            viewport={{ once: true }}
                            className="box-border ml-0 md:ml-8 lg:ml-[32px]"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1532152934380-321e9a99fe20?ixid=M3w0Mzc5fDB8MXxzZWFyY2h8NXx8cHJpbnRzfGVufDB8MHx8fDE3Mzk4MTAyMTh8MA&amp;ixlib=rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=1200&amp;q=80&amp;e=1739875378&amp;s=AnQpDON_VF0lTuA-LQ7MeKm2u_q9kv14JaFfZEwMf6w"
                                className="box-border align-middle block w-full h-auto md:h-[400px] lg:h-[660px] object-cover shadow-[6px_8px_0px_0px_rgb(0,0,0)] rounded-[24px]"
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;

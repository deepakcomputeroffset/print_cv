"use client";
import { sourceSerif4 } from "@/lib/font";
import { cn } from "@/lib/utils";
// import { motion } from "motion/react";
// import Link from "next/link";

export default function PrintLikeProSection() {
    return (
        // <section
        //     className={cn(
        //         "mt-20 lg:mt-0 pt-[80px] pb-[80px] text-[16px] leading-[24px] font-normal bg-dominant-color text-white px-4",
        //         sourceSerif4.className,
        //     )}
        // >
        //     <div
        //         className={cn(
        //             "max-w-customHaf lg:max-w-custom mx-auto lg:grid lg:grid-cols-2 lg:grid-rows-2 space-y-20 lg:space-y-0",
        //         )}
        //     >
        //         <motion.div
        //             initial={{ opacity: 0 }}
        //             whileInView={{
        //                 opacity: 1,
        //                 transition: {
        //                     duration: 0.8,
        //                     ease: "easeInOut",
        //                 },
        //             }}
        //             viewport={{ once: true }}
        //         >
        //             <h2
        //                 className={cn(
        //                     "mb-[16px] text-8xl md:text-[121.6px] mt-0 leading-[103.36px] font-normal tracking-[-0.6px]",
        //                 )}
        //             >
        //                 Print Like a Pro!
        //             </h2>
        //         </motion.div>

        //         <motion.div
        //             initial={{ opacity: 0 }}
        //             whileInView={{
        //                 opacity: 1,
        //                 transition: {
        //                     duration: 0.8,
        //                     delay: 0.2,
        //                     ease: "easeInOut",
        //                 },
        //             }}
        //             viewport={{ once: true }}
        //             className={cn(
        //                 "flex items-center justify-center mt-0 mb-[16px] px-4",
        //             )}
        //         >
        //             <img
        //                 src="https://images.unsplash.com/photo-1620907369757-ca0e2ae38256?ixid=M3w0Mzc5fDB8MXxzZWFyY2h8MjF8fHByaW50c3xlbnwwfDB8fHwxNzM5ODEwMjE4fDA&amp;ixlib=rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=1200&amp;q=80&amp;e=1739875378&amp;s=raSz-wMjEduZ0wYRkgB_hG4bMwCFtifIPMS61hbhkxY"
        //                 className={cn(
        //                     "w-[450px] h-[400px] lg:w-[200px] lg:h-[200px] object-cover shadow-[6px_8px_0px_0px_#000] rounded-xl rotate-[4deg]",
        //                 )}
        //             />
        //         </motion.div>

        //         <motion.div
        //             initial={{ opacity: 0 }}
        //             whileInView={{
        //                 opacity: 1,
        //                 transition: {
        //                     duration: 0.8,
        //                     delay: 0.4,
        //                     ease: "easeInOut",
        //                 },
        //             }}
        //             viewport={{ once: true }}
        //             className="flex box-border justify-center items-center"
        //         >
        //             <Link
        //                 href="#"
        //                 className="box-border text-white text-[20px] font-semibold leading-[30px] inline-flex text-center align-middle cursor-pointer bg-dominant-color-2 border-solid border-transparent px-6 py-3 m-2 rounded-lg border-dominant-color-2 break-words border items-center justify-center mt-0 min-w-[120px] whitespace-nowrap tracking-[-0.2px] hover:scale-105 transition-transform duration-500 max-h-16"
        //             >
        //                 Get Started
        //             </Link>
        //         </motion.div>

        //         <motion.div
        //             initial={{ opacity: 0 }}
        //             whileInView={{
        //                 opacity: 1,
        //                 transition: {
        //                     duration: 0.8,
        //                     delay: 0.6,
        //                     ease: "easeInOut",
        //                 },
        //             }}
        //             viewport={{ once: true }}
        //             className={cn(
        //                 "mb-0 text-center lg:text-start self-center place-self-center",
        //             )}
        //         >
        //             <p
        //                 className={cn(
        //                     "mb-0 mt-7 text-white text-[20px] m-0 leading-[30px]  tracking-[-0.2px]",
        //                 )}
        //             >
        //                 Transform your ideas into stunning prints with vibrant
        //                 colors, sharp details, and premium-quality materials.
        //                 Whether you need business cards, marketing banners, or
        //                 personalized prints, we ensure every piece is crafted to
        //                 perfection. From design to delivery, we make the process
        //                 seamless, so your projects not only look amazing but
        //                 also leave a lasting impression.
        //             </p>
        //         </motion.div>
        //     </div>
        // </section>

        <section
            className={cn("py-20 bg-dominant-color", sourceSerif4.className)}
        >
            <div
                className={cn(
                    "max-w-customHaf lg:max-w-custom mx-auto px-4",
                    sourceSerif4.className,
                )}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 space-y-7 lg:space-y-0 lg:gap-12">
                    <div className="justify-center text-white text-[16px] m-0 leading-[24px] h-full flex flex-col">
                        {/* <h3 className="inline-flex mb-[56px] px-[12px] py-[4px] [box-shadow:rgb(0,_0,_0)_3px_4px_0px_0px] !rounded-[8px] text-[rgb(255,_255,_255)] text-[20px] mt-0 mx-0 leading-[30px]  tracking-[-0.2px] bg-dominant-color">
                                Our Services
                            </h3> */}
                        <h2 className="text-6xl md:text-[72px] mt-0 mx-0 leading-[64.8px] tracking-[-0.52px] text-white">
                            Print Like a Pro
                        </h2>
                        <p className="mb-0 mt-7 text-[20px] m-0 leading-[30px]  tracking-[-0.2px]">
                            Transform your ideas into stunning prints with
                            vibrant colors and sharp details. Whether it’s
                            business cards, banners, or custom prints, we craft
                            each piece to perfection. From design to delivery,
                            we make it easy to bring your vision to life.
                        </p>
                    </div>
                    <img
                        src="https://images.unsplash.com/photo-1620907369757-ca0e2ae38256?ixid=M3w0Mzc5fDB8MXxzZWFyY2h8MjF8fHByaW50c3xlbnwwfDB8fHwxNzM5ODEwMjE4fDA&amp;ixlib=rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=1200&amp;q=80&amp;e=1739875378&amp;s=raSz-wMjEduZ0wYRkgB_hG4bMwCFtifIPMS61hbhkxY"
                        className="h-60 lg:h-[410px] w-full object-cover rounded-xl"
                    />
                </div>
            </div>
        </section>
    );
}

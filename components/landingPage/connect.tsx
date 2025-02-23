"use client";
import {
    Facebook,
    Instagram,
    Linkedin,
    Phone,
    Twitter,
    Youtube,
} from "lucide-react";
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
        {
            name: "9876543210",
            icon: Phone,
            url: "tel:9876543210",
        },
    ];
    return (
        <section className='py-10 md:py-20 bg-[rgb(255,_255,_255)] text-[rgb(35,_35,_35)] text-[16px] m-0 leading-[24px] font-normal font-["Source_Serif_4",_sans-serif] max-w-customHaf lg:max-w-custom mx-auto'>
            <div className="">
                <div className="relative px-4">
                    <div className="mb-14 lg:mb-16">
                        <motion.h3
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
                            className="inline-flex mb-[56px] px-[24px] py-[18px] shadow-[6px_8px_0px_0px_#000] rounded-2xl rotate-[4deg] text-5xl md:text-7xl mt-0 mx-0 leading-[64.8px] font-normal tracking-[-0.52px] bg-[#EDA371] text-black"
                        >
                            Connect
                        </motion.h3>
                        <h2 className='mb-0 text-6xl lg:text-[121.6px] m-0 leading-[65px] lg:leading-[103.36px] font-normal tracking-[-0.6px] font-["Source_Serif_4",_sans-serif]'>
                            Follow Our Adventures
                        </h2>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-3 place-items-center">
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
            </div>
        </section>
    );
}

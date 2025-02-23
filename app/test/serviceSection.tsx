"use client";
import React from "react";
import {
    Image,
    Clock,
    Settings,
    Leaf,
    Headphones,
    DollarSign,
} from "lucide-react"; // Import individual icons
import { cn } from "@/lib/utils";
import { sourceSerif4 } from "@/lib/font";
import { motion } from "motion/react";

interface Service {
    title: string;
    description: string;
    icon: React.JSX.Element;
    bgColor: string;
    textColor: string;
}

const ServicesSection: React.FC = () => {
    const services: Service[] = [
        {
            title: "Quality Prints",
            description: "High-resolution images & durable materials",
            icon: <Image className="w-10 h-10" />,
            bgColor: "bg-[#D65076]",
            textColor: "text-white",
        },
        {
            title: "Fast Turnaround",
            description: "Same-day service & express shipping options",
            icon: <Clock className="w-10 h-10" />,
            bgColor: "bg-[#EDA371]",
            textColor: "text-gray-800",
        },
        {
            title: "Custom Solutions",
            description: "Tailored designs & personalized support",
            icon: <Settings className="w-10 h-10" />,
            bgColor: "bg-[#E8CCD2]",
            textColor: "text-gray-800",
        },
        {
            title: "Eco-Friendly",
            description: "Sustainable materials & green practices",
            icon: <Leaf className="w-10 h-10" />,
            bgColor: "bg-[#E8CCD2]",
            textColor: "text-black",
        },
        {
            title: "Customer Support",
            description: "24/7 assistance & dedicated account managers",
            icon: <Headphones className="w-10 h-10" />,
            bgColor: "bg-[#EDA371]",
            textColor: "text-black",
        },
        {
            title: "Bulk Discounts",
            description: "Competitive pricing for large orders",
            icon: <DollarSign className="w-10 h-10" />,
            bgColor: "bg-[#D65076]",
            textColor: "text-white",
        },
    ];

    return (
        <section
            className={`px-4 py-32 bg-dominant-color ${sourceSerif4.className}`}
        >
            <div className="max-w-customHaf lg:max-w-custom mx-auto">
                <motion.h2
                    initial={{
                        opacity: 0,
                    }}
                    whileInView={{
                        opacity: 1,
                        transition: {
                            duration: 1,
                            delay: 0.6,
                            ease: "easeInOut",
                        },
                    }}
                    viewport={{ once: true }}
                    className="text-7xl lg:text-8xl font-bold mb-16 text-pretty sm:text-center text-white"
                >
                    Our Services
                </motion.h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <motion.div
                            initial={{
                                opacity: 0,
                            }}
                            whileInView={{
                                opacity: 1,
                                transition: {
                                    duration: 0.4,
                                    delay: 0.2 * index + 1,
                                    ease: "linear",
                                },
                            }}
                            viewport={{ once: true }}
                            key={index}
                            className={cn(
                                "rounded-lg shadow-lg p-6 transition duration-300 hover:scale-105 hover:shadow-xl w-full sm:w-auto",
                                service?.bgColor,
                                service?.textColor,
                            )}
                        >
                            <div className="flex items-center justify-center mb-4 text-4xl">
                                {service?.icon}
                            </div>
                            <h3 className="text-2xl font-semibold mb-2 text-center tracking-wide">
                                {service?.title}
                            </h3>
                            <p className="text-center text-base font-semibold tracking-wide">
                                {service?.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export const ServicesSectionTwo = () => {
    return (
        <section className={cn("py-20", sourceSerif4.className)}>
            <div
                className={cn(
                    "text-charcoal-black text-[16px] leading-[24px] max-w-customHaf lg:max-w-custom mx-auto px-4 py-20",
                    sourceSerif4.className,
                )}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 space-y-7 lg:space-y-0 lg:gap-12">
                    <img
                        src="https://images.unsplash.com/photo-1459664018906-085c36f472af?ixid=M3w0Mzc5fDB8MXxzZWFyY2h8MTh8fHByaW50c3xlbnwwfDB8fHwxNzM5ODEwMjE4fDA&amp;ixlib=rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=1200&amp;q=80&amp;e=1739875378&amp;s=sUtOgPWfaDIznF5w8pqGNk9Pu10t4m4tWj8Lq7doLGg"
                        className="h-60 lg:h-[410px] w-full object-cover rounded-xl"
                    />

                    <div className="justify-between text-charcoal-black text-[16px] m-0 leading-[24px] h-full flex flex-col">
                        <div className="text-charcoal-black text-[16px] m-0 leading-[24px] ">
                            <h3 className="inline-flex mb-[56px] px-[12px] py-[4px] [box-shadow:rgb(0,_0,_0)_3px_4px_0px_0px] !rounded-[8px] text-[rgb(255,_255,_255)] text-[20px] mt-0 mx-0 leading-[30px]  tracking-[-0.2px] bg-dominant-color">
                                Our Services
                            </h3>
                            <h2 className="text-black bg-white text-6xl md:text-[72px] mt-0 mx-0 leading-[64.8px] tracking-[-0.52px]">
                                Print Perfection
                            </h2>
                        </div>
                        <p className="mb-0 mt-auto text-black bg-white text-[20px] m-0 leading-[30px]  tracking-[-0.2px]">
                            Vibrant prints that capture attention and
                            imagination.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;

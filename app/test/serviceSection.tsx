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
    icon: React.JSX.Element; // Type the icon prop correctly
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
            <div className="max-w-[1320px] mx-auto">
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

export default ServicesSection;
